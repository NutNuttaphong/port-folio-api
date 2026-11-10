import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendUserMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  sessionId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @MaxLength(500, { message: 'Message exceeds 500 characters' })
  message!: string;

  @IsOptional()
  @IsString()
  honeypot?: string;
}

export class AdminReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  sessionId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Reply message is required' })
  @MaxLength(500, { message: 'Reply exceeds 500 characters' })
  message!: string;
}
