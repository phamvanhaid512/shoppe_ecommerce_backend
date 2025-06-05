import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/auth/entity/user.entity';
import { ChatRoomEntity } from './chatRoom.entity';

@Entity('chatRoomMember')
export class ChatRoomMemberEntity {
    @PrimaryGeneratedColumn()
    id: string;


    @ManyToOne(() => UserEntity, (user) => user.message)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
    @ManyToOne(() => ChatRoomEntity, (chatRoom) => chatRoom.message)
    @JoinColumn({ name: 'chatRoom_id' })
    chatRoom: ChatRoomEntity;
    @Column()
    joinedAt: Date;
}