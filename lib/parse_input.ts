import type { Args } from './type'
export default function parseInput(args: string[]): Args {
  const finallyArgs: Args = {}
  for (const arg of args) {
    const value = arg.split('=')
    if (value[0].toLocaleLowerCase() === 'random') {
      finallyArgs.random = value[1] === 'true' ? true : false
    }
    if (value[0].toLocaleLowerCase() === 'groupid') {
      finallyArgs.groupId = Number(value[1])
    }
    if (value[0].toLocaleLowerCase() === 'atall') {
      finallyArgs.atAll = value[1] === 'true' ? true : false
    }
  }
  return finallyArgs
}
