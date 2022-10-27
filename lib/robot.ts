import { createClient, TextElem } from 'oicq'
import { accountInfo, groupId, sendInterviewConfig } from './config'
import sendInterview from './send_interview'
import { CronJob } from 'cron'
import { serviceType, getServiceDetail, EXITCODE } from './constant'
import { sendDefaultTips, sendServiceTips } from './send_tips'
import { handleService } from './handleService'
import { isInGroup } from './utils/index'

export default async function robot() {
  const { timingSend, cron, isAtAll, isRandom } = sendInterviewConfig
  const bot = createClient(accountInfo.account)
  const group = bot.pickGroup(groupId)
  // 是否进去了某个service里面
  let status: boolean = false
  let currentType: number = -1

  bot
    .on('system.login.slider', function () {
      console.log('输入ticket：')
      process.stdin.once('data', ticket =>
        this.submitSlider(String(ticket).trim()),
      )
    })
    .login(accountInfo.password)

  bot.on('system.online', async () => {
    // 机器人不在群里
    if (!(await isInGroup(group))) {
      console.error('您的机器人🤖️不在该群,请加入该群之后重试')
      process.exit(1)
    }
    // 如果timingSend，每天定时向群里发送面试题
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
      const receiveMessage = (
        event.message[0].type === 'at' ? event.message[1] : event.message[0]
      ) as TextElem
      const content: string = receiveMessage.text.trim().toLocaleLowerCase()
      // 没有进入某个服务
      if (currentType === -1 && !status) {
        // 这里用户只要发送了对应的序号就会进入某个服务，不管他原先有没有进入别的服务
        const type = parseInt(content) || -1
        for (const key in serviceType) {
          if (type === serviceType[key]) {
            currentType = type
            break
          }
        }
      }
      // 用户返回上一级
      if (parseInt(content) === EXITCODE) {
        currentType = -1
        status = false
      }
      // 用户第一次发送某个服务的序号，比如1，这时候给用户发送一个关于该服务的一些描述以及提示
      if (!status && currentType !== -1) {
        await sendServiceTips(currentType, event)
      }
      // status 为true时，currentType一定不为-1
      if (status) {
        // 执行某个服务
        handleService(currentType, event)
        // 某些不用进入的服务可以在这里执行自动退出
        const serviceDetail =await getServiceDetail()
        const isNeedEnter = serviceDetail.find(item => {
          return item.serviceId === currentType
        })?.needEnter
        if (!isNeedEnter) {
          currentType = -1
          status = false
        }
      }
    }
    status = currentType === -1 ? false : true
    // 发送了错误的消息导致没有进入service || 回到上一级的时候
    if (currentType === -1) {
      await sendDefaultTips(event)
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
