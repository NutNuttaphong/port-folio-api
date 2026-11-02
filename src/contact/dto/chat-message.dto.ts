import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendUserMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  sessionId!: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกข้อความ' })
  @MaxLength(500, { message: 'ข้อความมีความยาวเกิน 500 ตัวอักษร' })
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
  @IsNotEmpty({ message: 'กรุณากรอกข้อความตอบกลับ' })
  @MaxLength(500, { message: 'ข้อความมีความยาวเกิน 500 ตัวอักษร' })
  message!: string;
}
