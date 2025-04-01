import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'command-config', timestamps: true })
export class CommandConfig {
  public static readonly NAME = 'command-config';

  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  requireAdmin: boolean;

  @Prop({ default: true })
  requireUser: boolean;

  @Prop({ default: false })
  requireTarget: boolean;

  @Prop()
  description: string;

  @Prop()
  cooldown: number;

  @Prop({ default: true })
  active: boolean;
}
const _schema = SchemaFactory.createForClass(CommandConfig);
_schema.index({ name: 1 }, { unique: true });

export const commandConfigDefinition = {
  name: CommandConfig.NAME,
  schema: _schema,
};
