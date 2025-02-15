import { Boom } from '@hapi/boom';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DisconnectReason } from 'baileys';
import { WhatsappEvents } from 'src/whatsapp-client/constants/whatsapp-client.constants';
import { WhatsappEventPayload } from 'src/whatsapp-client/interfaces/command.interfaces';

@Injectable()
export class ConnectionHandlerService {
  private readonly _logger = new Logger(ConnectionHandlerService.name);
  constructor() {}

  /**
   * Create or reconnect connection
   * @param event
   */
  @OnEvent(WhatsappEvents.CONNECTION_UPDATE)
  async createConnection(
    payload: WhatsappEventPayload<WhatsappEvents.CONNECTION_UPDATE>,
  ): Promise<void> {
    const { event, handler } = payload;
    const { connection, lastDisconnect, qr } = event;
    const disconnectionError = lastDisconnect?.error as Boom;

    if (qr) {
      this._logger.log('QR code received');
      return;
    }

    if (connection === 'close') {
      if (
        disconnectionError?.output?.statusCode !== DisconnectReason.loggedOut &&
        disconnectionError?.output?.statusCode !==
          DisconnectReason.connectionReplaced
      ) {
        this._logger.log('Reconnecting');
        await handler.createConnection();
        return;
      }

      if (
        disconnectionError?.output?.statusCode === DisconnectReason.loggedOut
      ) {
        this._logger.log('Logged out');
        return;
      }
    }

    if (connection === 'open') {
      this._logger.log('Connected');
    }
  }
}
