import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupService } from 'src/group/services/group.service';
import { AccountHandlerService } from '../account.handler/account.handler.service';
import {
  attackFailMessage,
  attackSuccessMessage,
} from '../../utils/message-sender.utils';
import { MessageSenderService } from '../message.sender/message.sender.service';

@Injectable()
export class AttackHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _accountHandler: AccountHandlerService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.ATTACK)
  private async handleAttack(payload: CommandPayload) {
    const { groupJid, WaMessage, client } = payload;

    const { user, target } =
      await this._accountHandler.genericVerifyUserColdownAndTarget(
        payload,
        true,
        true,
      );

    // No user or target found
    if (!user || !target) return;

    const userWeapon = (await this._groupService.getStoreItemById(
      user.weapon,
    ))!;

    // Attack logic
    const resultAttack =
      Math.random() < 0.65
        ? Math.floor(target.balance * userWeapon.multiplier) / 2
        : Math.floor(-user.balance * userWeapon.multiplier) / 2;

    const finalMessage =
      resultAttack <= 0
        ? attackFailMessage(resultAttack, target)
        : attackSuccessMessage(resultAttack, target);

    // Update balances
    user.balance += resultAttack;
    await this._groupService.newBalanceMember(user);

    // if (resultAttack > 0) {
    //   target.balance -= resultAttack;
    //   await this._groupService.newBalanceMember(target, false);
    // }

    target.balance += resultAttack > 0 ? -resultAttack : -resultAttack;
    await this._groupService.newBalanceMember(target, false);

    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      finalMessage,
    );
  }
}
