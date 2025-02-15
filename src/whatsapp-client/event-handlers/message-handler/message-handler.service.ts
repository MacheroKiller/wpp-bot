import { WhatsappEventPayload } from 'src/whatsapp-client/interfaces/command.interfaces';
import { Injectable } from '@nestjs/common';
import {
  isCommandMessage,
  isGroupMessage,
  isOwnMessage,
  isUserMessage,
  parseCommand,
} from './utils/message-handler.utils';
import { OnEvent } from '@nestjs/event-emitter';
import { WhatsappEvents } from 'src/whatsapp-client/constants/whatsapp-client.constants';
import { CommandService } from 'src/command/services/command/command.service';

@Injectable()
export class MessageHandlerService {
  constructor(private _commandService: CommandService) {}

  /**
   * Build the message handler
   * @param event
   * @param clientHandler
   */
  @OnEvent(WhatsappEvents.MESSAGES_UPSERT)
  handleMessage(
    payload: WhatsappEventPayload<WhatsappEvents.MESSAGES_UPSERT>,
  ): void {
    const { event, handler } = payload;
    const { messages } = event;
    messages.forEach((message) => {
      if (
        !isGroupMessage(message) ||
        isOwnMessage(message) ||
        !isUserMessage(message)
      ) {
        return;
      }

      // event.type === 'notify' to avoid the syncronization of the message
      if (isCommandMessage(message) && event.type === 'notify') {
        const { command, args } = parseCommand(message);
        this._commandService.handleCommand(command, {
          args,
          groupJid: message.key.remoteJid!,
          senderJid: message.key.participant!,
          client: handler,
          WaMessage: message,
        });
        return;
      }
    });
  }
}
