import type { Config } from '@jest/types'
import BaseConfig from './jest.config.base'

const config: Config.InitialOptions = {
  ...BaseConfig,
  roots: ['<rootDir>'],
  projects: ['<rootDir>/apps/client', '<rootDir>/apps/backend'],
}

export default config
