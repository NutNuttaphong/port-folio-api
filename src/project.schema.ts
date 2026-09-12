import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description!: string;

  @Prop()
  urlProject!: string;

  @Prop({ default: 'In Progress' })
  status!: string;

  @Prop({ default: Date.now })
  date!: Date;

  @Prop()
  imageUrl?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
