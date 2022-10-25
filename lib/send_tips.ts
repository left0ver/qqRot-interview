import { sendMessage } from './utils/sendMessage'
import { serviceType } from './constant'
import type { GroupMessageEvent } from 'oicq'
export async function sendDefaultTips(event: GroupMessageEvent) {
  const serviceTips = `
请发送指定的序号进入对应的服务
1. 获取指定分类的面试题`
  await sendMessage(event, serviceTips)
}

export async function sendServiceTips(
  event: GroupMessageEvent,
  currentType: number,
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
