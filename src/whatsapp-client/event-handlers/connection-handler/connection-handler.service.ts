import { Boom } from '@hapi/boom';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConnectionState, DisconnectReason } from 'baileys';
import { WhatsappEvents } from 'src/whatsapp-client/constants/whatsapp-client.constants';

@Injectable()
export class ConnectionHandlerService {
  constructor() {}

  /**
   * Create or reconnect connection
   * @param event
   */
  @OnEvent(WhatsappEvents.CONNECTION_UPDATE)
  createConnection(event: Partial<ConnectionState>): boolean {
    const { connection, lastDisconnect } = event;
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        'connection closed due to ',
        lastDisconnect?.error,
        ', reconnecting ',
        shouldReconnect,
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        return true;
      }
    }
    return false;
  }
}
