import { CommandPayload } from './../../interfaces/command.interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommandConfigService } from 'src/command-config/services/command-config.service';
import { Commands } from 'src/command/constants/command.constants';
import { MessageSenderService } from 'src/command/event-handlers/actions-handlers/message.sender/message.sender.service';
import { AccountHandlerService } from 'src/command/event-handlers/game-handlers/account.handler/account.handler.service';

@Injectable()
export class CommandService {
  private readonly _logger = new Logger(CommandService.name);

  constructor(
    private readonly _eventEmitter: EventEmitter2,
    private readonly _commandConfigService: CommandConfigService,
    private readonly _messageSenderService: MessageSenderService,
    private readonly _accountHandlerService: AccountHandlerService,
  ) {}

  async handleCommand(command: Commands, payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;
    this._logger.log(`Received command: ${command}`);

    // Check if the command exists and is active
    const commandConfig =
      await this._commandConfigService.getCommandConfigByName(command);
    if (!commandConfig || !commandConfig.active) {
      await this._messageSenderService.handleMessage(
        groupJid,
        WaMessage,
        client,
        'Error: The command does not exist or is not active',
      );
      return;
    }

    // Check if the command needs user and target
    if (!commandConfig.requireUser) {
      this._eventEmitter.emit(command, payload);
      return;
    }

    const { user, target } = await this._accountHandlerService.genericVerifier(
      payload,
      commandConfig.cooldown,
      commandConfig.requireTarget,
      commandConfig.name,
    );
    if (!user) return;
    if (commandConfig.requireTarget && !target) return;
    this._eventEmitter.emit(command, payload, user, target);
  }
}
