import { segment } from 'oicq'
import type { GroupMessageEvent, MessageElem } from 'oicq'
// at某人回复一个消息
export async function sendMessage(
  event: GroupMessageEvent,
  originMessage: (string | MessageElem)[] | string,
) {
  const at = segment.at(
    event.sender.user_id,
    event.sender.card || event.sender.nickname,
  )
  const sendMessage: MessageElem = segment.text(` ${originMessage}`)
  await event.group.sendMsg([at, sendMessage])
}
