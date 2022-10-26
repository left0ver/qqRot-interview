import type { Service } from './type'
export enum serviceType {
  SEND_INTERVIEW_WITH_TAG = 1,
}
// 定义对应的服务id，以及其描述，用户是否需要继续进入该服务里面
export const service: Service[] = [
  {
    serviceId: serviceType.SEND_INTERVIEW_WITH_TAG,
    description: `${serviceType.SEND_INTERVIEW_WITH_TAG}. 获取指定分类的面试题`,
    needEnter: true,
  },
]

export const EXITCODE = 0
