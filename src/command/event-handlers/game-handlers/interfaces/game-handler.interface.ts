import { GroupMember } from 'src/group/models/group-member.model';

export interface userAndTarget {
  user: GroupMember | undefined;
  target: GroupMember | undefined;
}
