import { serviceType } from './constant'
import { sendInterviewWithTag } from './robot_service/send_question_with_tag'
import type { GroupMessageEvent } from 'oicq'
export function handleService(currentType: number, event: GroupMessageEvent) {
  switch (currentType) {
    case serviceType.SEND_INTERVIEW_WITH_TAG:
      sendInterviewWithTag(event)
      break
  }
}
