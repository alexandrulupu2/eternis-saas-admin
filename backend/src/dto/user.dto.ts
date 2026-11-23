import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail({}, { message: 'Adresa de email nu este validă.' })
  @IsNotEmpty()
  email_utilizator: string;

  @IsString()
  @IsNotEmpty()
  parola_hash: string;

  @IsOptional()
  @IsString()
  rol_utilizator?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  credite_disponibile?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_abonament?: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email_utilizator?: string;

  @IsOptional()
  @IsString()
  parola_hash?: string;

  @IsOptional()
  @IsString()
  rol_utilizator?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  credite_disponibile?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_abonament?: number;
}

export class AddCreditsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount?: number;
}

export class UpgradeUserDto {
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_abonament?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  crediteExtra: number;
}
