import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  title!: string;

  @Prop()
  username!: string;

  @Prop()
  password!: string;

  @Prop()
  role!: string;

  @Prop({ default: 'In Progress' })
  status!: string;

  @Prop({ default: Date.now })
  date!: Date;

  @Prop()
  imageUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
