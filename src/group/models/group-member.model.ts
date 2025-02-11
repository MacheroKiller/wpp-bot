import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class GroupMember {
  public static readonly NAME = 'group-member';

  @Prop()
  id: string;

  @Prop()
  jid: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 0 })
  balance: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
const _schema = SchemaFactory.createForClass(GroupMember);
_schema.index({ jid: 1 }, { unique: true });

export const groupMemberDefinition = {
  name: GroupMember.NAME,
  schema: _schema,
};
