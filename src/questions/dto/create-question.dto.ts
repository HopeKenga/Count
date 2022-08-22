import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateQuestionDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    questionType: string;

    @IsBoolean()
    @IsNotEmpty()
    anonymous: boolean;

    @IsArray()
    @IsNotEmpty()
    options: string[];
}
