import dotenv from 'dotenv'
import { Config } from '../type'

dotenv.config()
const {
  ACCOUNT = '',
  PASSWORD = '',
  DATA_BASE_HOST = 'localhost',
  DATA_BASE_USERNAME = 'root',
  DATA_BASE_PASSWORD = '',
  DATA_BASE_PORT = '3306',
  DATA_BASE_NAME = 'qqRot',
  GROUP_ID = '',
  TIMING_SEND = 'true',
  CRON = '00 00 10 * * *',
  ATAll = 'false',
  RANDOM = 'false',
} = process.env

export const config: Config = {
  ACCOUNT: parseInt(ACCOUNT),
  PASSWORD,
  DATA_BASE_HOST,
  DATA_BASE_USERNAME,
  DATA_BASE_PASSWORD,
  DATA_BASE_PORT: parseInt(DATA_BASE_PORT),
  DATA_BASE_NAME,
  GROUP_ID: parseInt(GROUP_ID),
  TIMING_SEND: TIMING_SEND === 'true' ? true : false,
  CRON,
  ATAll: ATAll === 'true' ? true : false,
  RANDOM: RANDOM === 'true' ? true : false,
}
