import type { Group } from 'oicq'
import { accountInfo } from '../config'
export async function isInGroup(group: Group): Promise<boolean> {
  const groupMemberMap = await group.getMemberMap()
  return groupMemberMap.has(accountInfo.account)
}
