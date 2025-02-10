import { BaileysEventMap } from 'baileys';
import { ClientHandler } from '../class/client-handler';

export interface WhatsappEventPayload<
  K extends keyof BaileysEventMap = keyof BaileysEventMap,
> {
  event: BaileysEventMap[K];
  handler: ClientHandler;
}
