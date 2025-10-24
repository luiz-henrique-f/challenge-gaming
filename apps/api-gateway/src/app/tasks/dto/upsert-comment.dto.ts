import { IsNotEmpty, IsString } from "class-validator";

export class UpsertCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}