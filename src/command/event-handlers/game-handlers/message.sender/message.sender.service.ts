import { Injectable } from '@nestjs/common';
import { WAMessage } from 'baileys';

@Injectable()
/**
 * Service to send messages to the target
 */
export class MessageSenderService {
  async handleMessage(target: string, quoted: WAMessage, client, text: string) {
    await client._wppSocket.sendMessage(target, { text }, { quoted });
  }
}
