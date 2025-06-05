import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from './message.entity';
import { ChatRoomMemberEntity } from './chatRoomMember.entity';

@Entity('chatRoom')
export class ChatRoomEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    isGroup: boolean;

    @OneToMany(() => MessageEntity, (message) => message.chatRoom)
    message: MessageEntity[];


    @OneToMany(() => ChatRoomMemberEntity, (chatRoomMember) => chatRoomMember.chatRoom)
    chatRoomMember: ChatRoomMemberEntity[];
}