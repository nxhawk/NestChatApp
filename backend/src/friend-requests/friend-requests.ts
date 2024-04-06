import { FriendRequest } from '../utils/typeorm';
import {
  AcceptFriendRequestResponse,
  CreateFriendParams,
  FriendRequestParams,
} from '../utils/types';

export interface IFriendRequestService {
  create(params: CreateFriendParams);
  accept(params: FriendRequestParams): Promise<AcceptFriendRequestResponse>;
  // cancel(params: CancelFriendRequestParams): Promise<FriendRequest>;
  // reject(params: CancelFriendRequestParams): Promise<FriendRequest>;
  getFriendRequests(userId: number): Promise<FriendRequest[]>;
  isPending(userOneId: number, userTwoId: number);
  // findById(id: number): Promise<FriendRequest>;
}
