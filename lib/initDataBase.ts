import {getAppDataSource} from './utils/index'
async function init() {
  try {
    const AppDataSource = await getAppDataSource()
    await AppDataSource.destroy()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message)
  }
}
init()
  .then(() => {
    console.log('成功初始化表结构')
  })
  .catch(err => {
    console.error(err)
    console.error('初始化表结构失败')
  })
