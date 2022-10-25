import { segment, TextElem } from 'oicq'
import getQuestionWithTag from '../getQuestionWithTag'
import type { GroupMessageEvent } from 'oicq'

export async function sendInterviewWithTag(event: GroupMessageEvent) {
  const receiveMessage = (
    event.message[0].type === 'at' ? event.message[1] : event.message[0]
  ) as TextElem
  const tag = receiveMessage.text.trim().toLocaleLowerCase()
  const question: string = await getQuestionWithTag(tag)
  const at = segment.at(
    event.sender.user_id,
    event.sender.card || event.sender.nickname,
  )
  const message = segment.text(` ${question}`)
  event.group.sendMsg([at, message])
}
