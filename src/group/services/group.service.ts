import { jidToNumber } from './../../whatsapp-client/event-handlers/message-handler/utils/message-handler.utils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupMember } from '../models/group-member.model';
import { Model } from 'mongoose';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupMember.NAME)
    private readonly _groupMemberModel: Model<GroupMember>,
  ) {}

  getGroupMembers() {
    return this._groupMemberModel.find().exec();
  }

  async newBalanceMember(groupMember: GroupMember, newBalance: number) {
    return await this._groupMemberModel.findOneAndUpdate(
      { jid: groupMember.jid },
      { $set: { balance: newBalance } },
      { new: true },
    );
  }

  async createGroupMember(groupMember: GroupMember): Promise<GroupMember> {
    return await this._groupMemberModel.create({ ...groupMember });
  }

  async getGroupMemberByJid(jidMember: string) {
    const jid = jidToNumber(jidMember);
    return await this._groupMemberModel.findOne({ jid }).exec();
  }
}
