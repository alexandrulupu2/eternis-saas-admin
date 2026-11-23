import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Adresa de email nu este validă.' })
  @IsNotEmpty({ message: 'Emailul este obligatoriu.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Parola este obligatorie.' })
  parola: string;
}
