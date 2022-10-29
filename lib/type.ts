export interface Args {
  random?: boolean
  groupId?: number
  atAll?: boolean
}
export interface Config {
  ACCOUNT: number
  PASSWORD: string
  ROBOT_NAME:string
  DATA_BASE_HOST: string
  DATA_BASE_USERNAME: string
  DATA_BASE_PASSWORD: string
  DATA_BASE_PORT: number
  DATA_BASE_NAME: string
  GROUP_ID: number
  TIMING_SEND: boolean
  CRON: string
  ATAll: boolean
  RANDOM: boolean
}

export interface Account {
  account: number
  password: string
}

export interface DataBaseInfo {
  host: string
  username: string
  port: number
  password: string
  database: string
}
export interface SendInterviewCOnfig {
  robotName:string
  cron: string
  timingSend: boolean
  isAtAll: boolean
  isRandom: boolean
}

export interface Service {
  serviceId: number
  description: string
  needEnter: boolean
  usage: string
}
