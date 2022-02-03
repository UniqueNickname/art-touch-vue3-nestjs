import type { Config } from '@jest/types'
import BaseConfig from '../../jest.config.base'
import * as path from 'path'
import * as fs from 'fs'

const name = '@art-touch/client'

const srcDir = path.join(__dirname, 'src')

const moduleNameMapper = (() =>
  fs
    .readdirSync(srcDir)
    .filter(itemName => fs.statSync(`${srcDir}/${itemName}`).isDirectory())
    .reduce((acc, dirName) => {
      acc[`src/${dirName}/(.*)`] = `<rootDir>/src/${dirName}/$1`
      acc[`src/${dirName}`] = `<rootDir>/src/${dirName}/index.ts`

      return acc
    }, {}))()

const config: Config.InitialOptions = {
  ...BaseConfig,
  testEnvironment: 'jsdom',
  name,
  displayName: name,
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  moduleNameMapper,
}

export default config
