import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InspirationDocument = HydratedDocument<Inspiration>;

@Schema()
export class Inspiration {
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

export const InspirationSchema = SchemaFactory.createForClass(Inspiration);
