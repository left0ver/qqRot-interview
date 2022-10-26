import { sendMessage } from './utils/sendMessage'
import { serviceType, service } from './constant'
import type { GroupMessageEvent } from 'oicq'
export async function sendDefaultTips(event: GroupMessageEvent) {
  let serviceDescription: string = ''
  for (let i = 0; i < service.length; i++) {
    serviceDescription +=
      i === service.length - 1
        ? service[i].description
        : `${service[i].description} \n`
  }
  const serviceTips = `
请发送指定的序号进入对应的服务
${serviceDescription}`
  await sendMessage(event, serviceTips)
}

export async function sendServiceTips(
  currentType: number,
  event: GroupMessageEvent,
) {
  let message: string = ''
  switch (currentType) {
    case serviceType.SEND_INTERVIEW_WITH_TAG:
      message = `
艾特我并发送指定分类，有以下分类：js,webpack,css
发送0回到上一级`
      break
    default:
      message = '该服务不存在'
  }
  await sendMessage(event, message)
}
