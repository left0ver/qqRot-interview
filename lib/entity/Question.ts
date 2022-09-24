import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
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
}
