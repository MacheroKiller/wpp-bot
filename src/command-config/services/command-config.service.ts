import { Injectable } from '@nestjs/common';
import { CommandConfig } from '../models/command.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommandConfigService {
  constructor(
    @InjectModel(CommandConfig.NAME)
    private readonly _commandConfigModel: Model<CommandConfig>,
  ) {}

  getCommandConfig() {
    return this._commandConfigModel.find().exec();
  }

  getCommandConfigByName(name: string) {
    return this._commandConfigModel.findOne({ name }).exec();
  }
}
