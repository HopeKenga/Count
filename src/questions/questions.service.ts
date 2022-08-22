import { Injectable } from '@nestjs/common';
import { PrismaClient, Question } from '@prisma/client';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

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
export class QuestionsService {
  async create(createQuestionDto: any) {
    const questionData: any = {
      userId: createQuestionDto.userId,
      description: createQuestionDto.description,
      questionType: createQuestionDto.questionType,
      anonymous: createQuestionDto.anonymous
    }
    
    try {
      const question =  await prisma.question.create({
        data: questionData
      })
      //creating options for the question
      const options = createQuestionDto.options;
      for (let i = 0; i < options.length; i++) {
        await prisma.option.create({
          data: {
            question: { connect: { id: question.id } },
            option: options[i]
          }
        })
      }

      return question;
      
    } catch (error) {
      throw error
    }
  }

  findAll() {
    return prisma.question.findMany({
      include: {
        options: true,
        votes: true,
      }
    });
  }

  findOne(id: number) {
    return prisma.question.findFirst({
      where: {
        id,
      }
    })
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return prisma.question.delete({
      where: {
        id,
      }
    })
  }
}
