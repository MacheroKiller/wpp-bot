import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands, Cooldown } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { GroupMember } from 'src/group/models/group-member.model';
import { GroupService } from 'src/group/services/group.service';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import { attackSuccessMessage } from '../../utils/message-sender.utils';

@Injectable()
export class StealHandlerService {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _messageSender: MessageSenderService,
  ) {}

  @OnEvent(Commands.STEAL)
  private async handleSteal(
    payload: CommandPayload,
    user: GroupMember,
    target: GroupMember,
  ) {
    const { groupJid, WaMessage, client } = payload;

    const userCooldown = Commands.STEAL + Cooldown;

    const userWeapon = (await this._groupService.getStoreItemById(
      user.weapon,
    ))!;

    // Steal logic
    const extraBonus = userWeapon.multiplier / 10;
    const resultSteal =
      Math.random() < userWeapon.multiplier
        ? Math.floor(target.balance * (0.05 + extraBonus))
        : Math.floor(target.balance * (0.01 + extraBonus));

    // Update balances
    await this._groupService.updateBalance(
      user,
      { [userCooldown]: new Date() },
      resultSteal,
    );

    await this._groupService.updateBalance(target, {}, resultSteal * -1);

    await this._messageSender.handleMessage(
      groupJid,
      WaMessage,
      client,
      attackSuccessMessage(resultSteal, target),
    );
  }
}
