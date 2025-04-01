import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Commands } from 'src/command/constants/command.constants';
import { CommandPayload } from 'src/command/interfaces/command.interfaces';
import { MessageSenderService } from '../../actions-handlers/message.sender/message.sender.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MusicHandlerService {
  constructor(
    private readonly _messageSender: MessageSenderService,
    private readonly httpService: HttpService,
  ) {}

  @OnEvent(Commands.MUSIC)
  private async handleMusic(payload: CommandPayload) {
    const { groupJid, args, WaMessage, client } = payload;

    // Check if the user has provided a link
    if (args.length === 0) {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        'I need a link to play music.',
      );
      return;
    }

    // Building the params
    const url = 'http://127.0.0.1:5000/download';
    const params = { link: args[0] };

    // Sending the request to the music server
    try {
      const response = (
        await firstValueFrom(
          this.httpService.post(url, params, {
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        )
      ).data as string;

      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        'Wait a moment, I am fighting with the police to get the music.',
      );

      await this._messageSender.handleAudio(
        groupJid,
        WaMessage,
        client,
        response,
      );
    } catch {
      await this._messageSender.handleMessage(
        groupJid,
        WaMessage,
        client,
        'An error occurred while trying to download the music.',
      );
      return;
    }
  }
}
