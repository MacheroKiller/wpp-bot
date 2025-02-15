import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import { MessageSenderService } from '../message.sender/message.sender.service';
import {
  errorStoreMessage,
  storeSide,
  toolStoreMessage,
  weaponStoreMessage,
} from '../../utils/message-sender.utils';

@Injectable()
export class StoreHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.STORE)
  private async handleStore(payload: CommandPayload) {
    const { groupJid, senderJid, args, WaMessage, client } = payload;

    if (!args.length || !storeSide.includes(args[0])) {
      return this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorStoreMessage,
      );
    }

    const storeToFind = args[0].toLowerCase();

    if (storeToFind === storeSide[0]) {
      await this._messageSender.handleMessage(
        senderJid,
        WaMessage,
        client,
        toolStoreMessage,
      );
      return;
    }

    await this._messageSender.handleMessage(
      senderJid,
      WaMessage,
      client,
      weaponStoreMessage,
    );
  }
}
