import { DataSource } from 'typeorm'
import { Question } from './entity/Question'
import { Tag } from './entity/Tag'
import { databaseInfo, MyNamingStrategy } from './config'
async function init() {
  try {
    const AppDataSource = new DataSource({
      ...databaseInfo,
      type: 'mysql',
      entities: [Question, Tag],
      synchronize: true,
      logging: false,
      namingStrategy: new MyNamingStrategy(),
    })
    await AppDataSource.initialize()
    await AppDataSource.destroy()
  } catch (error: any) {
    throw new Error(error.message)
  }
}
init()
  .then(() => {
    console.log('成功初始化表结构')
  })
  .catch(err => {
    console.error(err)
    console.error('初始化表结构失败')
  })
