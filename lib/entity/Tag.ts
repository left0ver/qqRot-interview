import { Entity, Column, ManyToMany, PrimaryColumn } from 'typeorm'
import { Question } from './Question'

@Entity('tag')
export class Tag {
  @PrimaryColumn({ type: 'integer' })
  tagId: number

  @Column({ type: 'varchar', length: 1024 })
  tagName: string

  @ManyToMany(type => Question, question => question.tags)
  questions: Question[]
}
