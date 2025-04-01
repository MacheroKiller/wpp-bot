import { Module } from '@nestjs/common';
import { WhatsappClientService } from './services/whatsapp-client/whatsapp-client.service';
import { ConnectionHandlerService } from './event-handlers/connection-handler/connection-handler.service';
import { MessageHandlerService } from './event-handlers/message-handler/message-handler.service';
import { CommandService } from 'src/command/services/command/command.service';
import { GroupParticipantHandlerService } from './event-handlers/group-participant-handler/group-participant-handler.service';
import { CommandConfigModule } from 'src/command-config/command-config.module';
import { MessageSenderService } from 'src/command/event-handlers/actions-handlers/message.sender/message.sender.service';
import { GroupModule } from 'src/group/group.module';
import { AccountHandlerService } from 'src/command/event-handlers/game-handlers/account.handler/account.handler.service';

@Module({
  providers: [
    ConnectionHandlerService,
    WhatsappClientService,
    MessageHandlerService,
    GroupParticipantHandlerService,
    CommandService,
    MessageSenderService,
    AccountHandlerService,
  ],
  imports: [CommandConfigModule, GroupModule],
})
export class WhatsappClientModule {}
