import { sendMessage } from './utils/index'
import { serviceType, getServiceDetail } from './constant'
import type { GroupMessageEvent } from 'oicq'
export async function sendDefaultTips(event: GroupMessageEvent) {
  let serviceDescription: string = ''
  const serviceDetail =await getServiceDetail()
  for (let i = 0; i < serviceDetail.length; i++) {
    serviceDescription +=
      i === serviceDetail.length - 1
        ? serviceDetail[i].description
        : `${serviceDetail[i].description} \n`
  }

  const serviceTips = `请发送指定的序号进入对应的服务\n${serviceDescription}`
  await sendMessage(event, serviceTips)
}

export async function sendServiceTips(
  currentType: number,
  event: GroupMessageEvent,
) {
  let message: string = ''
  const serviceDetail =await getServiceDetail()
  const idx = serviceDetail.findIndex(detail=>detail.serviceId===currentType)
  switch (currentType) {
    case serviceType.SEND_INTERVIEW_WITH_TAG:
      message = `
${serviceDetail[idx].usage}`
      break
    default:
      message = '该服务不存在'
  }
  await sendMessage(event, message)
}
