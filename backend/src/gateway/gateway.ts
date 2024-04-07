import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { IConversationsService } from 'src/conversations/conversations';
import { IGroupService } from 'src/groups/interfaces/group';
import { IFriendsService } from 'src/friends/friends';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    // @Inject(Services.GATEWAY_SESSION_MANAGER)
    // readonly sessions: IGatewaySessionManager,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
    @Inject(Services.GROUPS)
    private readonly groupsService: IGroupService,
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendsService: IFriendsService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket,...args: any[]) {
    console.log('Incoming Connection');
    console.log(socket.user);
    //console.log(`${socket.user.username} disconnected.`);
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('handleDisconnect');
  }
}
