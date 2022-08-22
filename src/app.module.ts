import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { QuestionsModule } from './questions/questions.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [QuestionsModule, VoteModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
