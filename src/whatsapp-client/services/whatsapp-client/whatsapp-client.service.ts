import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientHandler } from 'src/whatsapp-client/class/client-handler';
@Injectable()
export class WhatsappClientService {
  constructor(private readonly eventEmitter: EventEmitter2) {
    void this.initializeClient();
  }
  private async initializeClient() {
    const handler = new ClientHandler(this.eventEmitter);
    await handler.createConnection();
  }
}
