import { createClient, segment, TextElem } from 'oicq'
import { accountInfo, groupId, sendInterviewConfig } from './config'
import sendInterview from './send_interview'
import getQuestionWithTag from './getQuestionWithTag'
import { CronJob } from 'cron'
export default function robot() {
  const { timingSend, cron, isAtAll, isRandom } = sendInterviewConfig
  const bot = createClient(accountInfo.account)
  const group = bot.pickGroup(groupId)

  bot
    .on('system.login.slider', function () {
      console.log('输入ticket：')
      process.stdin.once('data', ticket =>
        this.submitSlider(String(ticket).trim()),
      )
    })
    .login(accountInfo.password)

  bot.on('system.online', async () => {
    if (timingSend) {
      const job = new CronJob(
        cron,
        async () => {
          await sendInterview(group, isRandom, isAtAll)
        },
        null,
        false,
      )
      job.start()
    }
  })
  // 监听群消息
  bot.on('message.group', async event => {
    if (event.atme && event.group_id === groupId) {
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
