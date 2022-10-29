import { DataSource } from 'typeorm'
import { databaseInfo, MyNamingStrategy } from '../config'
import { Question } from '../entity/Question'
import { Tag } from '../entity/Tag'

export async function getAppDataSource(synchronize = false) {
  try {
    const AppDataSource = new DataSource({
      ...databaseInfo,
      type: 'mysql',
      entities: [Question, Tag],
      // 自动创建表结构在每次启动的时候，这在初始化数据库的时候有用，其他的时候应该设置为false
      synchronize,
      logging: false,
      namingStrategy: new MyNamingStrategy(),
      connectorPackage:'mysql2'
    })
    !AppDataSource.isInitialized && (await AppDataSource.initialize())
    return AppDataSource
  } catch (error) {
    console.error(error)
    console.error('数据库初始化失败')
    process.exit(1)
  }
}
