import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupMember } from 'src/group/models/group-member.model';
import { GroupService } from 'src/group/services/group.service';
import {
  getMentionedJids,
  jidToNumber,
} from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';
import { userAndTarget } from '../interfaces/game-handler.interface';
import { MessageSenderService } from '../message.sender/message.sender.service';
import {
  accountAlreadyExists,
  antiSpamMessage,
  needMentionSomeone,
  newAccountCreated,
  noAccountCreated,
  noUserFound,
} from '../../utils/message-sender.utils';

@Injectable()
export class AccountHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.CREATE_ACCOUNT)
  private async handleCreateAccount(payload: CommandPayload) {
    const { groupJid, senderJid, WaMessage, client } = payload;

    const response = await this._groupService.getGroupMemberByJidAndGroup(
      senderJid,
      groupJid,
    );

    if (response) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        accountAlreadyExists,
      );
      return;
    }

    const groupMember = {
      jid: jidToNumber(senderJid),
      name: WaMessage.pushName,
      groupJid,
      balance: 250,
    } as GroupMember;
    await this._groupService.createGroupMember(groupMember);

    // Sendind message
    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      newAccountCreated(groupMember.balance),
    );
  }

  async genericVerifyUserColdownAndTarget(
    payload: CommandPayload,
    isColdown: boolean,
    needTarget: boolean,
  ) {
    const { groupJid, senderJid, WaMessage, client } = payload;

    const user = await this._groupService.getGroupMemberByJidAndGroup(
      senderJid,
      groupJid,
    );

    let target: GroupMember = {} as GroupMember;

    const errorCase = {} as userAndTarget;

    if (!user) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        noAccountCreated,
      );
      return errorCase;
    }

    if (isColdown && !(await this.handleCommandColdown(payload, user))) {
      return errorCase;
    }

    if (needTarget) {
      const mentionedJid = getMentionedJids(WaMessage);
      if (!mentionedJid.length) {
        await this._messageSender.handleMessage(
          groupJid,
          WaMessage,
          client,
          needMentionSomeone,
        );
        return errorCase;
      }
      target = (await this._groupService.getGroupMemberByJidAndGroup(
        mentionedJid[0],
        groupJid,
      )) as GroupMember;

      if (!target) {
        await this._messageSender.handleMessage(
          groupJid,
          WaMessage,
          client,
          noUserFound,
        );
        return errorCase;
      }
    }

    return { user, target } as userAndTarget;
  }

  private async handleCommandColdown(
    payload: CommandPayload,
    user: GroupMember,
  ): Promise<boolean> {
    const { groupJid, WaMessage, client } = payload;

    if (user.updatedAt.getTime() === user.createdAt.getTime()) {
      return true;
    }

    const timeToWait = 0.75;
    const date = new Date().getTime();
    const time = date - user.updatedAt.getTime();
    const minutes = time / 60000;
    const timeToWaitInSeconds = Math.floor((timeToWait - minutes) * 60);

    if (timeToWait > minutes) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        antiSpamMessage(timeToWaitInSeconds),
      );
      return false;
    }
    return true;
  }
}
