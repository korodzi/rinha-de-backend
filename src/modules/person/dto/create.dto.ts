import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 32)
  apelido: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nome: string;

  @IsDateString()
  @IsNotEmpty()
  nascimento: Date;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Length(1, 32, { each: true })
  stack: string[];
}
