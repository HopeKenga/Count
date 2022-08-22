import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class createVoteDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    questionId: number;

    @IsString()
    @IsNotEmpty()
    questionType: string;
    
    @IsArray()
    @IsNotEmpty()
    options: string[];
}