import process from 'process'
const __DEV__ = process.env.NODE_ENV !== 'production'
interface Account {
  account: number
  password: string
}

interface DataBaseInfo {
  host: string
  user: string
  password: string
  database: string
  port: number
}
// 生产环境下的数据库配置
const productionDataBaseInfo: DataBaseInfo = {
  host: '0.0.0.0',
  user: 'root',
  password: '',
  database: '',
  port: 3306,
}
// 开发环境下的数据库配置
const developmentDataBaseInfo: DataBaseInfo = {
  host: 'localhost', //ip地址
  user: 'root', //用户名
  password: '', //密码
  database: '', //对应的数据库的名称
  port: 3306, //数据库对应的端口号
}
const databaseInfo = __DEV__ ? developmentDataBaseInfo : productionDataBaseInfo

const accountInfo: Account = {
  account: 123456, //qq账号
  password: '', // qq密码
}
const groupId: number = 123456 //qq群群号
exports = {
  accountInfo,
  databaseInfo,
  groupId,
}
