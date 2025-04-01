import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import {
  errorIdItemNotFoundMessage,
  itemProfile,
  userProfile,
} from '../../utils/message-sender.utils';
import { GroupMember } from 'src/group/models/group-member.model';

@Injectable()
export class InfoHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.PROFILE)
  private async handleProfile(
    payload: CommandPayload,
    user: GroupMember,
    target: GroupMember,
  ) {
    const { groupJid, WaMessage, client } = payload;

    const response = target.name ? target : user;

    const userTool = await this._groupService.getStoreItemById(response.tool);
    const userWeapon = await this._groupService.getStoreItemById(
      response.weapon,
    );

    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      userProfile(response, userTool!, userWeapon!),
    );
  }

  @OnEvent(Commands.INFO)
  private async handleInfo(payload: CommandPayload) {
    const { groupJid, args, WaMessage, client } = payload;

    const itemToFind = args[0] ? args[0].toUpperCase() : '';

    const item = await this._groupService.getStoreItemById(itemToFind);

    if (!item) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        errorIdItemNotFoundMessage,
      );
      return;
    }

    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      itemProfile(item),
    );
  }
}
