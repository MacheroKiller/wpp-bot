import whatsappConfig from 'src/config/whatsapp.config';
import {
  waLogger,
  WaClientConfig,
} from '../constants/whatsapp-client.constants';
import makeWASocket, {
  ConnectionState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  WASocket,
} from '@whiskeysockets/baileys';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class ClientHandler {
  private readonly _logger = waLogger;
  _wppSocket: WASocket;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async createConnection(): Promise<WASocket> {
    const { state, saveCreds } = await useMultiFileAuthState(
      whatsappConfig.authPath,
    );

    const { version, isLatest } = await fetchLatestBaileysVersion();

    this._logger.info(`Using WA v${version.join('.')} (latest: ${isLatest})`);

    // Socket configuration
    this._wppSocket = makeWASocket({
      ...WaClientConfig,
      version: version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, this._logger),
      },
    });

    this._wppSocket.ev.on('creds.update', async () => {
      await saveCreds();
    });

    /**
     * Process the events
     */
    this._wppSocket.ev.process((events) => {
      if (!!events && Object.keys(events).length > 0) {
        Object.keys(events).forEach((key) => {
          this.eventEmitter.emit(key, {
            event: events[key] as Partial<ConnectionState>,
            handler: this,
          });
        });
      }
    });

    return this._wppSocket;
  }
}
