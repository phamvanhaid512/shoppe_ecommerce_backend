import { ChatRoomMemberEntity } from 'src/chat/entities/chatRoomMember.entity';
import { MessageEntity } from 'src/chat/entities/message.entity';
import { OrdersEntity } from 'src/orders/entity/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name?: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive?: boolean;

  @OneToMany(() => OrdersEntity, (order) => order.user)
  order: OrdersEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  message: MessageEntity[];

  @OneToMany(() => ChatRoomMemberEntity, (chatRoomMember) => chatRoomMember.user)
  chatRoomMember: ChatRoomMemberEntity[];
}
