import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AboutDocument = HydratedDocument<About>;

@Schema()
export class About {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description!: string;

  @Prop({ default: 'In Progress' })
  status!: string;

  @Prop({ default: Date.now })
  date!: Date;

  @Prop()
  imageUrl?: string;
}

export const AboutSchema = SchemaFactory.createForClass(About);
