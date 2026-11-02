import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { SendUserMessageDto, AdminReplyDto } from './dto/chat-message.dto';

// In-memory Rate Limiting Tracker
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // 1. ดึงประวัติข้อความของห้องแชท
  @Get('messages/:sessionId')
  async getMessages(@Param('sessionId') sessionId: string) {
    const messages = await this.contactService.getSessionMessages(sessionId);
    return { success: true, messages };
  }

  // 2. ผู้ใช้จากหน้าเว็บส่งข้อความเข้ามา (Two-way Chat)
  @Post('send')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async sendUserMessage(
    @Body() dto: SendUserMessageDto,
    @Req() req: any,
  ) {
    // 🍯 Honeypot check
    if (dto.honeypot && dto.honeypot.trim().length > 0) {
      return { success: true, messages: [] };
    }

    // ⏱️ Rate Limiting (สูงสุด 5 ข้อความต่อ 1 นาทีต่อ IP เพื่อให้คุยต่อเนื่องได้แต่ไม่โดนฟลัด)
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 10;

    const record = ipRateLimits.get(clientIp);
    if (record) {
      if (now < record.resetTime) {
        if (record.count >= maxRequests) {
          throw new HttpException(
            {
              statusCode: HttpStatus.TOO_MANY_REQUESTS,
              message: 'คุณส่งข้อความถี่เกินไป กรุณารอสักครู่ครับ',
            },
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        record.count += 1;
      } else {
        ipRateLimits.set(clientIp, { count: 1, resetTime: now + windowMs });
      }
    } else {
      ipRateLimits.set(clientIp, { count: 1, resetTime: now + windowMs });
    }

    return this.contactService.sendUserMessage(dto);
  }

  // 3. ตอบกลับข้อความ (ใช้โดย Admin หรือระบบภายใน)
  @Post('reply')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async replyMessage(@Body() dto: AdminReplyDto) {
    return this.contactService.addAdminReply(dto);
  }

  // 4. LINE Webhook Endpoint (เมื่อณัฐพงษ์พิมพ์ตอบใน LINE)
  @Post('line-webhook')
  async lineWebhook(@Body() body: any) {
    await this.contactService.handleLineWebhook(body);
    return { status: 'ok' };
  }
}
