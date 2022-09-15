import { accountInfo, databaseInfo, groupId } from './config'
import { createClient, segment } from 'oicq'
import mysql from 'mysql2'
import type { RowDataPacket } from 'mysql2'
interface Question extends RowDataPacket {
  qid: number
  question: string
  isSend: 0 | 1
}
const bot = createClient(accountInfo.account)
const group = bot.pickGroup(groupId)
const connection = mysql.createConnection(databaseInfo)
bot
  .on('system.login.slider', function () {
    console.log('输入ticket：')
    process.stdin.once('data', ticket =>
      this.submitSlider(String(ticket).trim()),
    )
  })
  .login(accountInfo.password)
bot.on('system.online', async () => {
  try {
    await connection.promise().connect()
    const [questions] = await connection
      .promise()
      .query<Question[]>('select * from question where isSend != 1')
    if (questions.length === 0) {
      // 飙泪表情
      const sadEnjoy = segment.face(210)
      await group.sendMsg(['没有面试题了哦,请耐心等待更新面试题哦! ', sadEnjoy])
    } else {
      // at全体
      const atAll = segment.at('all')
      const tip = segment.text('每日一题：\n')
      const invite = segment.text(' 大家快来和小冰一起做题吧!')
      // 花朵脸表情
      const faceEnjoy = segment.face(337)
      await group.sendMsg([tip, questions[0].question])
      await group.sendMsg([atAll, invite, faceEnjoy])
      // 更新为1，表示已经发过了
      await connection
        .promise()
        .query(`update question set isSend=1 where qid=${questions[0].qid}`)
    }
  } catch (error) {
    console.error(error)
  } finally {
    connection.end()
    bot.logout()
    console.warn('已经退出登陆')
  }
})
bot.on('system.offline.kickoff', () => {
  console.error('服务器踢下线')
  connection.end()
})
bot.on('system.offline.network', () => {
  console.error('网络错误导致下线')
  connection.end()
})
