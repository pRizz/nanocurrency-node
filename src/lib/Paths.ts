import * as envPaths from 'env-paths'
import * as path from 'path'

export const defaultAppName = `nano-node-js` // FIXME: create unique app name
export const defaultDataPaths = envPaths(defaultAppName)
export const defaultDBFileName = `ledger.sqlite`
export const dbPath = path.join(defaultDataPaths.data, defaultDBFileName)
