import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WAMessage } from 'baileys';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';

@Injectable()
export class CommandService {
  private readonly _logger = new Logger(CommandService.name);
  constructor(private readonly _eventEmitter: EventEmitter2) {}
  handleCommand(command: Commands, payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;
    this._logger.log(`Received command: ${command}`);

    let error: string = '';
    if (!this.existCommnad(command)) {
      error = 'Command not found';
    }

    if (error) {
      this.replyCommandError(client, groupJid, WaMessage, error);
      return;
    }

    this._eventEmitter.emit(command, payload);
  }

  private replyCommandError(client, groupJid, WaMessage: WAMessage, error) {
    client._wppSocket.sendMessage(groupJid, {
      text: `Error: ${error}`,
      quoted: WaMessage,
    });
  }
  private existCommnad(command: Commands) {
    return Object.values(Commands).includes(command);
  }
}
