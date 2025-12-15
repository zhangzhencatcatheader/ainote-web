import { MessagePlugin, DialogPlugin, LoadingPlugin } from 'tdesign-vue-next'

// 用于存储loading实例
let loadingInstance: any = null

/**
 * 统一的消息提示
 */
export const showMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  const messageMethod = MessagePlugin[type] || MessagePlugin.info
  messageMethod(message)
}

/**
 * 成功提示
 */
export const showSuccess = (message: string) => {
  showMessage(message, 'success')
}

/**
 * 错误提示
 */
export const showError = (message: string) => {
  showMessage(message, 'error')
}

/**
 * 警告提示
 */
export const showWarning = (message: string) => {
  showMessage(message, 'warning')
}

/**
 * 信息提示
 */
export const showInfo = (message: string) => {
  showMessage(message, 'info')
}

/**
 * 加载提示
 */
export const showLoading = (message: string = '加载中...') => {
  // 保存loading实例以便后续关闭
  loadingInstance = LoadingPlugin({
    text: message,
    fullscreen: false,
    preventScrollThrough: true,
  })
}

/**
 * 关闭加载提示
 */
export const hideLoading = () => {
  // 手动关闭loading
  if (loadingInstance) {
    loadingInstance.hide()
    loadingInstance = null
  }
}

/**
 * 确认对话框
 */
export const showConfirm = (options: {
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
}): Promise<boolean> => {
  return new Promise((resolve) => {
    const instance = DialogPlugin.confirm({
      header: options.title || '提示',
      body: options.content,
      confirmBtn: options.confirmText || '确定',
      cancelBtn: options.cancelText || '取消',
      onConfirm: () => {
        resolve(true)
        instance.hide()
      },
      onCancel: () => {
        resolve(false)
        instance.hide()
      },
      onClose: () => {
        resolve(false)
        instance.hide()
      },
    })
  })
}
