import 'reflect-metadata'
import { createClient, segment } from 'oicq'
import { DataSource } from 'typeorm'
import { Question } from './entity/Question'
import { accountInfo, databaseInfo, groupId, MyNamingStrategy } from './config'

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
// 命令行输入的参数
const finalGroupId = finallyArgs.groupId || groupId
const isRandom = Boolean(finallyArgs.random) || false
const isAtAll = Boolean(finallyArgs.atAll) || false

const bot = createClient(accountInfo.account)
const group = bot.pickGroup(finalGroupId)

// 连接数据库
const AppDataSource = new DataSource({
  ...databaseInfo,
  type: 'mysql',
  entities: [Question],
  synchronize: true,
  logging: false,
  namingStrategy: new MyNamingStrategy(),
})

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
    !AppDataSource.isInitialized && (await AppDataSource.initialize())
    const questionRepository = AppDataSource.getRepository(Question)
    let rowData: Question | undefined | null = undefined
    if (isRandom) {
      const questions = await questionRepository.find()
      rowData = questions[Math.floor(Math.random() * questions.length)]
    } else {
      rowData = await questionRepository.findOne({
        where: { isSend: false },
      })
    }
    // 没有面试题
    if (rowData === undefined || rowData === null) {
      // 飙泪表情
      const sadEnjoy = segment.face(210)
      await group.sendMsg(['没有面试题了哦,请耐心等待更新面试题哦! ', sadEnjoy])
    } else {
      // at全体
      const atAll = segment.at('all')
      const tip = segment.text('每日一题：\n')
      const invite = segment.text(' 大家快来和小冰一起做题吧! ')
      // 加油必胜表情
      const faceEnjoy = segment.face(245)
      await group.sendMsg([tip, rowData.question])
      isAtAll && (await group.getAtAllRemainder()) > 1
        ? await group.sendMsg([atAll, invite, faceEnjoy])
        : await group.sendMsg([invite, faceEnjoy])
      //如果不是随机，则更新为true，表示已经发过了
      if (!isRandom) {
        await questionRepository
          .createQueryBuilder()
          .update()
          .set({ isSend: true })
          .where({ qid: rowData.qid })
          .execute()
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    await AppDataSource.destroy()
    bot.logout()
    console.warn('已经退出登陆')
  }
})
bot.on('system.offline.kickoff', async () => {
  await AppDataSource.destroy()
  console.error('服务器踢下线')
})
bot.on('system.offline.network', async () => {
  await AppDataSource.destroy()
  console.error('网络错误导致下线')
})
