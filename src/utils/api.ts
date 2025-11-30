import { Api } from '@/api'
import { httpExecutor } from './http'

/**
 * API 实例
 * 全局单例，在整个应用中使用
 */
export const api = new Api(httpExecutor)
