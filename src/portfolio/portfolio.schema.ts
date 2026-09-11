import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PortfolioDocument = HydratedDocument<Portfolio>;

@Schema()
export class Portfolio {
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

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
