import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    // Check incoming query type
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        // Change to findFirst - you cannot filter
        // by anything except ID / unique with findUnique
        params.action = 'findFirst'
        // Add 'deleted' filter
        // ID filter maintained
        params.args.where['deletedAt'] = null
      }
      if (params.action === 'findMany') {
        // Find many queries
        if (params.args.where) {
          if (params.args.where.deletedAt == undefined) {
            // Exclude deleted records if they have not been explicitly requested
            params.args.where['deletedAt'] = null
          }
        } else {
          params.args['where'] = { deletedAt: null }
        }
      }
  
      //softdeletes
      if (params.action == 'delete') {
        // Delete queries
        // Change action to an update
        params.action = 'update'
        params.args['data'] = { deletedAt: new Date() }
      }
    return next(params)
  })

@Injectable()
export class VoteService {
    async create(vote: any) {
        return await prisma.vote.create({
        data: {
            userId: vote.userId,
            questionId: vote.questionId,
            optionId: vote.optionId
        }
        });
    }

    async findAllVotesPerQuestion(id: number) {
        const votes = await prisma.vote.findMany({
            where: {
                questionId: id
            }
        });
        return votes;
    }

    async findAll() {
        const votes = await prisma.vote.findMany({});
        return votes;
    }

    async findAllVotesPerQuestionSummary(id: number) {
        //get all votes for a question
        const votes = await prisma.vote.findMany({
            where: {
                questionId: id
            }
        })
        //count percentage of votes for each option for a question
        const options = await prisma.option.findMany({
            where: {
                questionId: id
            }
        })
        let optionVotes = [];
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let optionVotesCount = 0;
            for (let j = 0; j < votes.length; j++) {
                let vote = votes[j];
                if (vote.optionId == option.id) {
                    optionVotesCount++;
                }
            }
            //getting each option percentage
            let optionPercentage = (optionVotesCount / votes.length) * 100;
            optionVotes.push({
                option: option,
                votes: optionVotesCount,
                percentage: optionPercentage
            });
        }

        return optionVotes;
    }

    //check if user has already voted in that question
    async checkIfUserHasVoted(userId: number, questionId: number) {
        const votes = await prisma.vote.findMany({
            where: {
                userId: userId,
                questionId: questionId
            }
        });
        if (votes.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}