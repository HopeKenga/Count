import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createVoteDto } from './dto/create.dto';
import { VoteService } from './vote.service';

@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get('/')
  public async findAll() {
    return await this.voteService.findAll();
  }

  @Post('/')
  public async create(@Body() vote: createVoteDto) {
    //check if user has already voted
    const votes = await this.voteService.checkIfUserHasVoted(vote.userId, vote.questionId);
    if (votes) {
      return {
        message: 'You have already voted in this question'
      }
    }
    return await this.voteService.create(vote);
  }

  @Get('/question/:id')
  public async findAllVotesPerQuestion(@Param('id') id: string) {
    return await this.voteService.findAllVotesPerQuestion(parseInt(id));
  }

  @Get('/question/summary/:id')
    public async findAllVotesPerQuestionSummary(@Param('id') id: string) {
        return await this.voteService.findAllVotesPerQuestionSummary(parseInt(id));
    }
}
