import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WhatsappEvents } from 'src/whatsapp-client/constants/whatsapp-client.constants';
import { WhatsappEventPayload } from 'src/whatsapp-client/interfaces/command.interfaces';
import parsePhoneNumberFromString from 'libphonenumber-js';

@Injectable()
export class GroupParticipantHandlerService {
  @OnEvent(WhatsappEvents.GROUP_PARTICIPANTS_UPDATE)
  async handleGroupParticipantUpdate(
    payload: WhatsappEventPayload<WhatsappEvents.GROUP_PARTICIPANTS_UPDATE>,
  ): Promise<void> {
    const { event, handler } = payload;

    const { participants, action, id: groupJid } = event;
  }
}
