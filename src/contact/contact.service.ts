import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import {
  ChatSession,
  ChatSessionDocument,
  ChatMessageItem,
} from './schemas/chat-session.schema';
import { SendUserMessageDto, AdminReplyDto } from './dto/chat-message.dto';

function getEnvValue(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.substring(0, idx).trim();
          const v = trimmed.substring(idx + 1).trim();
          if (k === key) return v;
        }
      }
    }
  } catch {
    /* ignore fallback */
  }
  return undefined;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  // In-memory session fallback for instantaneous access
  private readonly inMemorySessions = new Map<string, ChatMessageItem[]>();

  constructor(
    @InjectModel(ChatSession.name)
    private chatSessionModel: Model<ChatSessionDocument>,
  ) {}

  // 1. ดึงประวัติข้อความของห้องแชท
  async getSessionMessages(sessionId: string): Promise<ChatMessageItem[]> {
    try {
      const session = await this.chatSessionModel.findOne({ sessionId }).exec();
      if (session && session.messages) {
        return session.messages;
      }
    } catch (e) {
      this.logger.warn(
        `Could not read session from DB, using memory fallback: ${e}`,
      );
    }

    return this.inMemorySessions.get(sessionId) || [];
  }

  // 2. ผู้ใช้จากหน้าเว็บส่งข้อความเข้ามา
  async sendUserMessage(
    dto: SendUserMessageDto,
  ): Promise<{ success: boolean; messages: ChatMessageItem[] }> {
    const now = new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: 'user',
      text: dto.message,
      createdAt: now,
    };

    // บันทึกลง Memory
    const currentMemory = this.inMemorySessions.get(dto.sessionId) || [];
    currentMemory.push(newMsg);
    this.inMemorySessions.set(dto.sessionId, currentMemory);

    // บันทึกลง MongoDB
    try {
      await this.chatSessionModel.findOneAndUpdate(
        { sessionId: dto.sessionId },
        {
          $push: { messages: newMsg },
          $set: { lastActive: new Date() },
        },
        { upsert: true, new: true },
      );
    } catch (e) {
      this.logger.warn(`MongoDB session save warning: ${e}`);
    }

    // ยิง Push Notification ไปยัง LINE ของณัฐพงษ์
    await this.notifyLineNewMessage(dto.sessionId, dto.message);

    return {
      success: true,
      messages: currentMemory,
    };
  }

  // 3. แอดมิน (ณัฐพงษ์) ตอบกลับข้อความ
  async addAdminReply(
    dto: AdminReplyDto,
  ): Promise<{ success: boolean; messages: ChatMessageItem[] }> {
    const now = new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const replyMsg: ChatMessageItem = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: 'nuttaphong',
      text: dto.message,
      createdAt: now,
    };

    // บันทึกลง Memory
    const currentMemory = this.inMemorySessions.get(dto.sessionId) || [];
    currentMemory.push(replyMsg);
    this.inMemorySessions.set(dto.sessionId, currentMemory);

    // บันทึกลง MongoDB
    try {
      await this.chatSessionModel.findOneAndUpdate(
        { sessionId: dto.sessionId },
        {
          $push: { messages: replyMsg },
          $set: { lastActive: new Date() },
        },
        { upsert: true, new: true },
      );
    } catch (e) {
      this.logger.warn(`MongoDB admin reply save warning: ${e}`);
    }

    this.logger.log(
      `Nuttaphong replied to session ${dto.sessionId}: ${dto.message}`,
    );

    return {
      success: true,
      messages: currentMemory,
    };
  }

  // 4. ส่งแจ้งเตือนเข้า LINE เมื่อมีข้อความใหม่จากเว็บ
  private async notifyLineNewMessage(sessionId: string, message: string) {
    const channelAccessToken = getEnvValue('LINE_CHANNEL_ACCESS_TOKEN');
    const lineUserId = getEnvValue('LINE_USER_ID');

    if (!channelAccessToken || !lineUserId) {
      this.logger.warn(
        `LINE Token not configured. Simulated message: ${message}`,
      );
      return;
    }

    const formattedTime = new Date().toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      hour12: false,
    });

    const lineApiUrl = 'https://api.line.me/v2/bot/message/push';

    const isLead =
      message.includes('📋 [แบบฟอร์มฝากข้อมูลติดต่อกลับ]') ||
      message.includes('📋 [Contact Request Form]');
    const cardAltText = isLead
      ? `📋 New Contact Request! (#${sessionId})`
      : `💬 New Web Message (#${sessionId})`;

    const flexCard = {
      type: 'flex',
      altText: cardAltText,
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: isLead ? '#0f766e' : '#091124',
          contents: [
            {
              type: 'text',
              text: isLead
                ? '🔥 LEAD • NEW CONTACT REQUEST'
                : 'LIVE CHAT • MY-PROFILE',
              weight: 'bold',
              color: isLead ? '#ccfbf1' : '#2dd4bf',
              size: 'xs',
            },
            {
              type: 'text',
              text: isLead
                ? `New inquiry from session #${sessionId}`
                : `Message from session #${sessionId}`,
              weight: 'bold',
              color: '#ffffff',
              size: 'md',
              margin: 'xs',
            },
          ],
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: isLead
                ? '📋 Contact Request Details:'
                : '💬 Visitor Message:',
              size: 'xs',
              color: '#64748b',
              weight: 'bold',
            },
            {
              type: 'text',
              text: message,
              size: 'sm',
              color: '#0f172a',
              weight: isLead ? 'regular' : 'bold',
              wrap: true,
            },
            {
              type: 'separator',
              margin: 'md',
            },
            {
              type: 'box',
              layout: 'vertical',
              backgroundColor: '#f1f5f9',
              cornerRadius: 'md',
              paddingAll: 'sm',
              contents: [
                {
                  type: 'text',
                  text: '💡 How to reply to this chat room:',
                  size: 'xxs',
                  color: '#475569',
                  weight: 'bold',
                },
                {
                  type: 'text',
                  text: `Type: #${sessionId} followed by your message`,
                  size: 'xs',
                  color: '#0f766e',
                  weight: 'bold',
                  wrap: true,
                },
              ],
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: `⏰ ${formattedTime} • Two-Way Live Chat`,
              size: 'xxs',
              color: '#94a3b8',
              align: 'center',
            },
          ],
        },
      },
    };

    try {
      await fetch(lineApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${channelAccessToken}`,
        },
        body: JSON.stringify({
          to: lineUserId,
          messages: [flexCard],
        }),
        signal: AbortSignal.timeout(15000),
      });
      this.logger.log(`Pushed message for session #${sessionId} to LINE`);
    } catch (e: any) {
      this.logger.error(`Failed to push to LINE: ${e.message}`);
    }
  }

  // 5. จัดการ LINE Webhook เมื่อณัฐพงษ์พิมพ์ตอบในห้องแชท LINE
  async handleLineWebhook(body: any): Promise<void> {
    const channelAccessToken = getEnvValue('LINE_CHANNEL_ACCESS_TOKEN');
    const events = body?.events || [];

    for (const event of events) {
      if (event.type === 'message' && event.message?.type === 'text') {
        const text = (event.message.text || '').trim();

        // ตรวจสอบว่าขึ้นต้นด้วย #sessionId หรือไม่ เช่น "#hr-123 สวัสดีครับ"
        const match = text.match(/^#([a-zA-Z0-9_-]+)\s+([\s\S]+)$/);
        if (match) {
          const targetSessionId = match[1];
          const replyText = match[2].trim();

          // บันทึกข้อความตอบกลับ
          await this.addAdminReply({
            sessionId: targetSessionId,
            message: replyText,
          });

          // ส่งข้อความยืนยันกลับไปยัง LINE ของณัฐพงษ์
          if (event.replyToken && channelAccessToken) {
            try {
              await fetch('https://api.line.me/v2/bot/message/reply', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${channelAccessToken}`,
                },
                body: JSON.stringify({
                  replyToken: event.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: `✅ Reply sent to session #${targetSessionId} on the website successfully!`,
                    },
                  ],
                }),
                signal: AbortSignal.timeout(10000),
              });
            } catch (err: any) {
              this.logger.error(
                `Error sending reply confirmation: ${err.message}`,
              );
            }
          }
        }
      }
    }
  }
}
