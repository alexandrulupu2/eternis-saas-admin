import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  nume_plan?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pret_simulat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  credite_lunare?: number;
}
