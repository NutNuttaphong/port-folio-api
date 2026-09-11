import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAboutDto {
  @IsString()
  @IsNotEmpty()
  title?: string; // บังคับว่าต้องเป็นตัวหนังสือ และห้ามส่งค่าว่างมา

  @IsString()
  @IsOptional()
  description?: string; // ใส่ ? เพื่อบอกว่าเป็นค่าว่างได้ (ถ้าไม่ได้กรอก)

  // @IsString()
  // @IsNotEmpty()
  // date?: string; // บังคับกรอกวันที่

  @IsString()
  @IsOptional()
  status?: string; // สถานะโปรเจกต์

  @IsOptional() // เพิ่มบรรทัดนี้ เพื่อบอกว่าไม่ใส่วันที่ก็ไม่เป็นไร
  @IsString()
  date?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
