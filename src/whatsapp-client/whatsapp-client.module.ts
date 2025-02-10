import { Module } from '@nestjs/common';
import { WhatsappClientService } from './services/whatsapp-client/whatsapp-client.service';
import { ConnectionHandlerService } from './event-handlers/connection-handler/connection-handler.service';
import { MessageHandlerService } from './event-handlers/message-handler/message-handler.service';
import { CommandService } from 'src/command/services/command/command.service';

@Module({
  providers: [
    ConnectionHandlerService,
    WhatsappClientService,
    MessageHandlerService,
    CommandService,
  ],
})
export class WhatsappClientModule {}
