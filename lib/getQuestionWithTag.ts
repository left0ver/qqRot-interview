import { Question } from './entity/Question'
import {getAppDataSource} from './utils/index'

export default async function getQuestionWithTag(
  tagName: string,
): Promise<string> {
  try {
    const AppDataSource =await getAppDataSource()
    const questionRepository = AppDataSource.getRepository(Question)
    const questions =
     (
      await questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tag')
      .select('question.question')
      .where('tag.tagName = :tagName', { tagName })
      .getMany()
      ) as { question: string }[]
    await  AppDataSource.destroy()

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
