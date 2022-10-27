import type { Service } from './type'
import { getAppDataSource } from './utils/getAppDataSource'
import { Tag } from './entity/Tag'
export enum serviceType {
  SEND_INTERVIEW_WITH_TAG = 1,
}
 async function getTag(): Promise<string[]> {
  const AppDataSource= await getAppDataSource()
  const tagRepository = AppDataSource.getRepository(Tag)
  const data =await tagRepository
    .createQueryBuilder('tag')
    .select(['tag.tagName'])
    .getMany()
    const tagArr =data.map(value=>{
      return value.tagName
    })
    return tagArr
}
// 定义对应的服务id，以及其描述，用户是否需要继续进入该服务里面
export async function  getServiceDetail():Promise<Service[]> {
  const tagArr=await getTag()
  return [
    {
    serviceId: serviceType.SEND_INTERVIEW_WITH_TAG,
    description: `${serviceType.SEND_INTERVIEW_WITH_TAG}. 获取指定分类的面试题`,
    needEnter: true,
    usage: tagArr.length===0 ? '面试题暂时没有进行分类，请联系管理员进行分类\n发送 0 回到上一级': `艾特我并发送指定分类，有以下分类:${tagArr.join('，')}\n发送 0 回到上一级`,
    }
  ]
}

// 退出
export const EXITCODE = 0
