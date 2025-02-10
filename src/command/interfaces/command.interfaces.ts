import { WAMessage } from 'baileys';
import { ClientHandler } from 'src/whatsapp-client/class/client-handler';

export interface CommandPayload {
  groupJid: string;
  senderJid: string;
  args: string[];
  client: ClientHandler;
  WaMessage: WAMessage;
}
