import { Browsers, UserFacingSocketConfig } from '@whiskeysockets/baileys';
import * as NodeCache from 'node-cache';
import P from 'pino';
import whatsappConfig from 'src/config/whatsapp.config';

const _msgRetryCounterCachce = new NodeCache();

export const waLogger = P(
  { timestamp: () => `,"time":"${new Date().toJSON()}"` },
  P.destination(whatsappConfig.loggerPath),
);

export const WaClientConfig: Partial<UserFacingSocketConfig> = {
  connectTimeoutMs: 60 * 1000,
  qrTimeout: 120 * 1000,
  markOnlineOnConnect: true,
  msgRetryCounterCache: _msgRetryCounterCachce,
  browser: Browsers.macOS('Edge'),
  generateHighQualityLinkPreview: true,
  logger: waLogger,
  printQRInTerminal: true,
  syncFullHistory: false,
  linkPreviewImageThumbnailWidth: 200,
};

// Create a const object to simulate an enum dynamically
export enum WhatsappEvents {
  CONNECTION_UPDATE = 'connection.update',
  MESSAGES_UPSERT = 'messages.upsert',
  GROUPS_UPSERT = 'groups.upsert',
  GROUP_PARTICIPANTS_UPDATE = 'group-participants.update',
}
