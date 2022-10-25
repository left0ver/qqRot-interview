import { DefaultNamingStrategy } from 'typeorm'
import { config } from './utils/parse_env'
import type { Account, DataBaseInfo, SendInterviewCOnfig } from './type'

const {
  ACCOUNT,
  PASSWORD,
  DATA_BASE_HOST,
  DATA_BASE_NAME,
  DATA_BASE_PASSWORD,
  DATA_BASE_PORT,
  DATA_BASE_USERNAME,
  GROUP_ID,
  TIMING_SEND,
  CRON,
  ATAll,
  RANDOM,
} = config
// 修改默认的连接表的表名命名方式
class MyNamingStrategy extends DefaultNamingStrategy {
  joinTableName(firstTableName: string, secondTableName: string): string {
    return `link_${firstTableName}_${secondTableName}`
  }
}

const databaseInfo: DataBaseInfo = {
  host: DATA_BASE_HOST, //ip地址
  username: DATA_BASE_USERNAME, //数据库用户名，默认root
  port: DATA_BASE_PORT, // 端口号 ，默认3306
  password: DATA_BASE_PASSWORD, //数据库密码
  database: DATA_BASE_NAME, //数据库名
}

const accountInfo: Account = {
  account: ACCOUNT, //qq账号
  password: PASSWORD, //qq密码
}
const groupId: number = GROUP_ID //qq群号

const sendInterviewConfig: SendInterviewCOnfig = {
  timingSend: TIMING_SEND, //是否每日定时发送面试题
  cron: CRON, //每日定时发送面试题的时间,遵循cron表达式，详情查看https://juejin.cn/post/6844904047237955592
  isAtAll: ATAll, //定时发送面试题时是否at全体成员
  isRandom: RANDOM, //定时发送面试题时是否随机发送一个面试题,如果为false，则会发送数据库中第一个从来没有被发送过的面试题
}

export {
  accountInfo,
  databaseInfo,
  groupId,
  MyNamingStrategy,
  sendInterviewConfig,
}
