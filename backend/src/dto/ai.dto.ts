import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateAiDto {
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @IsString()
  @IsNotEmpty()
  tip_text: string;

  @IsString()
  @IsNotEmpty({ message: 'Tema nu poate fi goală.' })
  tema: string;
}
