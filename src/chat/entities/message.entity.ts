import { UserEntity } from 'src/auth/entity/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatRoomEntity } from './chatRoom.entity';

@Entity('message')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    content: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => UserEntity, (user) => user.message)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => ChatRoomEntity, (chatRoom) => chatRoom.message)
    @JoinColumn({ name: 'chatRoom_id' })
    chatRoom: ChatRoomEntity;
}