import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatSessionDocument = HydratedDocument<ChatSession>;

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'nuttaphong';
  text: string;
  createdAt: string;
}

@Schema({ timestamps: true })
export class ChatSession {
  @Prop({ required: true, unique: true })
  sessionId!: string;

  @Prop({ type: Array, default: [] })
  messages!: ChatMessageItem[];

  @Prop({ default: Date.now })
  lastActive!: Date;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
