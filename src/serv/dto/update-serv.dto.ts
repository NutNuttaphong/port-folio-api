import { PartialType } from '@nestjs/mapped-types';
import { CreateServDto } from './create-serv.dto';

export class UpdateServDto extends PartialType(CreateServDto) {}
