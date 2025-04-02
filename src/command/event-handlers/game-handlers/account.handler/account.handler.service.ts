import { Injectable } from '@nestjs/common';
import { Cooldown } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupMember } from 'src/group/models/group-member.model';
import { GroupService } from 'src/group/services/group.service';
import { getMentionedJids } from 'src/whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';
import { userAndTarget } from '../interfaces/game-handler.interface';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import {
  antiSpamMessage,
  needMentionSomeone,
  noAccountCreated,
  noUserFound,
} from '../../utils/message-sender.utils';

@Injectable()
export class AccountHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  async genericVerifyUserCooldownAndTarget(
    payload: CommandPayload,
    isColdown: boolean,
    needTarget: boolean,
  ): Promise<userAndTarget> {
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

    if (isColdown) {
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

  async genericVerifier(
    payload: CommandPayload,
    cooldown: number,
    needTarget: boolean,
    command: string,
  ): Promise<userAndTarget> {
    const { groupJid, senderJid, WaMessage, client } = payload;

    const user = await this._groupService.getGroupMemberByJidAndGroup(
      senderJid,
      groupJid,
    );

    const errorCase = {} as userAndTarget;

    // User verifier
    if (!user) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        noAccountCreated,
      );
      return errorCase;
    }

    // Command Cooldown verifier
    if (
      cooldown !== 0 &&
      !(await this.handleCommandCooldown(payload, user, cooldown, command))
    ) {
      return errorCase;
    }

    const mentionedJid = getMentionedJids(WaMessage);

    // Si hay una mención, buscar al miembro del grupo
    const target = mentionedJid.length
      ? await this._groupService.getGroupMemberByJidAndGroup(
          mentionedJid[0],
          groupJid,
        )
      : ({} as GroupMember);

    if (needTarget) {
      // Si se necesita un target, pero no se mencionó a nadie
      if (!mentionedJid.length) {
        await this._messageSender.handleMessage(
          groupJid,
          WaMessage,
          client,
          needMentionSomeone,
        );
        return errorCase;
      }

      // Si se mencionó a alguien pero no existe en la base de datos
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

  private async handleCommandCooldown(
    payload: CommandPayload,
    user: GroupMember,
    commandCooldown: number, // command cooldown
    command: string,
  ): Promise<boolean> {
    const { groupJid, WaMessage, client } = payload;

    if (commandCooldown === 0) {
      return false;
    }

    const identifyCooldown = command + Cooldown;

    const lastTimeUserCommand = user[identifyCooldown];
    console.log(identifyCooldown);
    console.log(lastTimeUserCommand);

    const date = new Date().getTime();
    const time = date - lastTimeUserCommand.getTime();
    const seconds = time / 1000;
    const timeToWaitInSeconds = Math.floor(commandCooldown - seconds);

    if (commandCooldown > seconds) {
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
