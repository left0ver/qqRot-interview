import { accountInfo, databaseInfo, groupId } from './config'
import { createClient, segment } from 'oicq'
import mysql from 'mysql2'
import type { RowDataPacket } from 'mysql2'
interface Question extends RowDataPacket {
  qid: number
  question: string
  isSend: 0 | 1
}
interface Args {
  random?: boolean
  groupId?: number
  atAll?: boolean
}

// 解析用户输入的命令行参数
const args = process.argv.slice(2)
const finallyArgs: Args = {}
for (const arg of args) {
  const value = arg.split('=')
  if (value[0].toLocaleLowerCase() === 'random') {
    finallyArgs.random = value[1] === 'true' ? true : false
  }
  if (value[0].toLocaleLowerCase() === 'groupid') {
    finallyArgs.groupId = Number(value[1])
  }
  if (value[0].toLocaleLowerCase() === 'atall') {
    finallyArgs.atAll = value[1] === 'true' ? true : false
  }
}

const finalGroupId = finallyArgs.groupId || groupId
const isRandom = Boolean(finallyArgs.random) || false
const isAtAll = Boolean(finallyArgs.atAll) || false

const bot = createClient(accountInfo.account)
const group = bot.pickGroup(finalGroupId)
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
    let question: Question | undefined = undefined
    if (isRandom) {
      const [questions] = await connection
        .promise()
        .query<Question[]>('select * from question')
      question = questions[Math.floor(Math.random() * questions.length)]
    } else {
      const [questions] = await connection
        .promise()
        .query<Question[]>('select * from question where isSend != 1')
      question = questions[0]
    }

    if (question === undefined) {
      // 飙泪表情
      const sadEnjoy = segment.face(210)
      await group.sendMsg(['没有面试题了哦,请耐心等待更新面试题哦! ', sadEnjoy])
    } else {
      // at全体
      await group.getAtAllRemainder()
      const atAll = segment.at('all')
      const tip = segment.text('每日一题：\n')
      const invite = segment.text(' 大家快来和小冰一起做题吧! ')
      // 加油必胜表情
      const faceEnjoy = segment.face(245)
      await group.sendMsg([tip, question.question])
      isAtAll && (await group.getAtAllRemainder()) > 1
        ? await group.sendMsg([atAll, invite, faceEnjoy])
        : await group.sendMsg([invite, faceEnjoy])
      //如果不是随机，则更新为1，表示已经发过了
      if (!isRandom) {
        await connection
          .promise()
          .query(`update question set isSend=1 where qid=${question.qid}`)
      }
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
