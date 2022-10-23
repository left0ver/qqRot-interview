import { DataSource } from 'typeorm'
import { databaseInfo, MyNamingStrategy } from './config'
import { Question } from './entity/Question'
import { Tag } from './entity/Tag'
export default async function getQuestionWithTag(
  tagName: string,
): Promise<string> {
  try {
    const AppDataSource = new DataSource({
      ...databaseInfo,
      type: 'mysql',
      entities: [Question, Tag],
      synchronize: true,
      logging: false,
      namingStrategy: new MyNamingStrategy(),
    })
    !AppDataSource.isInitialized && (await AppDataSource.initialize())
    const questionRepository = AppDataSource.getRepository(Question)
    const questions = (await questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tag')
      .select('question.question', 'question')
      .where('tag.tagName = :tagName', { tagName })
      .execute()) as { question: string }[]

    const idx = Math.floor(Math.random() * questions.length)
    const question =
      questions.length === 0
        ? '没有这种类型的面试题哦'
        : questions[idx].question
    return question
  } catch (error) {
    console.log(error)
    return '查询错误'
  }
}
