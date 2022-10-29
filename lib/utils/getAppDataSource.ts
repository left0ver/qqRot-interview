import { DataSource } from 'typeorm'
import { databaseInfo, MyNamingStrategy } from '../config'
import { Question } from '../entity/Question'
import { Tag } from '../entity/Tag'

export async function getAppDataSource() {
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
    return AppDataSource
  } catch (error) {
    console.error(error)
    console.error('数据库初始化失败')
    process.exit(1)
  }
}
