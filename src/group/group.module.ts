import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { groupMemberDefinition } from './models/group-member.model';

@Module({
  imports: [MongooseModule.forFeature([groupMemberDefinition])],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
