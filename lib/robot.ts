import { createClient, segment, TextElem } from 'oicq'
import { accountInfo, groupId } from './config'
import sendInterview from './send_interview'
import parseInput from './parse_input'
import getQuestionWithTag from './getQuestionWithTag'
import { CronJob } from 'cron'
export default function robot() {
  // 解析用户输入的命令行参数
  const finallyArgs = parseInput(process.argv.slice(2))

  // 命令行输入的参数
  const finalGroupId = finallyArgs.groupId || groupId
  const isRandom = Boolean(finallyArgs.random) || false
  const isAtAll = Boolean(finallyArgs.atAll) || false

  const bot = createClient(accountInfo.account)
  const group = bot.pickGroup(finalGroupId)

  bot
    .on('system.login.slider', function () {
      console.log('输入ticket：')
      process.stdin.once('data', ticket =>
        this.submitSlider(String(ticket).trim()),
      )
    })
    .login(accountInfo.password)

  bot.on('system.online', async () => {
    const job = new CronJob(
      '00 00 10 * * *',
      async () => {
        await sendInterview(group, isRandom, isAtAll)
      },
      null,
      false,
    )
    job.start()
    // await bot.logout()
    // console.warn('已经退出登陆')
  })
  // 监听群消息
  bot.on('message.group', async event => {
    if (event.atme && event.group_id === finalGroupId) {
      const originMessage = (
        event.message[0].type === 'at' ? event.message[1] : event.message[0]
      ) as TextElem
      const tag = originMessage.text.trim().toLocaleLowerCase()
      const question: string = await getQuestionWithTag(tag)
      const at = segment.at(
        event.sender.user_id,
        event.sender.card || event.sender.nickname,
      )
      const message = segment.text(` ${question}`)
      event.group.sendMsg([at, message])
    }
  })
  bot.on('system.offline.kickoff', async () => {
    // await AppDataSource.destroy()
    console.error('服务器踢下线')
  })
  bot.on('system.offline.network', async () => {
    // await AppDataSource.destroy()
    console.error('网络错误导致下线')
  })
}
