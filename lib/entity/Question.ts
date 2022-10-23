import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Tag } from './Tag'
@Entity('question')
export class Question {
  @PrimaryGeneratedColumn()
  qid: number
  @Column({
    length: 2048,
    type: 'varchar',
  })
  question: string
  @Column({
    type: 'bool',
    default: false,
  })
  isSend: boolean
  @ManyToMany(type => Tag, tag => tag.questions)
  @JoinTable()
  tags: Tag[]
}
