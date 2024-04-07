import { AddGroupRecipientParams, AddGroupUserResponse } from 'src/utils/types';
import { Group } from '../../utils/typeorm';

export interface IGroupRecipientService {
  addGroupRecipient(
    params: AddGroupRecipientParams,
  ): Promise<AddGroupUserResponse>;
  // removeGroupRecipient(
  //   params: RemoveGroupRecipientParams,
  // ): Promise<RemoveGroupUserResponse>;
  // leaveGroup(params: LeaveGroupParams);
  // isUserInGroup(params: CheckUserGroupParams): Promise<Group>;
}
