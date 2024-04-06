import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString({ each: true })
  @ArrayNotEmpty()
  users: string[];

  @IsNotEmpty()
  @IsString()
  title: string;
}
