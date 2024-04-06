import { Friend } from './entities/Friend';
import { FriendRequest } from './entities/FriendRequest';
import { Profile } from './entities/Profile';
import { User } from './entities/User';
import { UserPresence } from './entities/UserPresence';

const entities = [User, Profile, UserPresence, FriendRequest, Friend];

export default entities;
export { User, Profile, UserPresence, FriendRequest, Friend };
