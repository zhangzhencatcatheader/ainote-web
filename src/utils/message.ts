import { MessagePlugin, DialogPlugin, LoadingPlugin } from 'tdesign-vue-next'
import { Toast, Dialog } from 'tdesign-mobile-vue'
import { isMobileDevice } from './device'

/**
 * 统一的消息提示
 */
export const showMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  if (isMobileDevice()) {
    // 移动端使用 Toast
    let theme: 'success' | 'error' | 'warning' | 'loading' = 'success'
    if (type === 'error') {
      theme = 'error'
    } else if (type === 'warning') {
      theme = 'warning'
    } else {
      theme = 'success'
    }
    
    Toast({
      message,
      theme,
      duration: 2000,
    })
  } else {
    // 桌面端使用 Message
    const messageMethod = MessagePlugin[type] || MessagePlugin.info
    messageMethod(message)
  }
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
  if (isMobileDevice()) {
    Toast.loading({
      message,
      duration: 0,
    })
  } else {
    LoadingPlugin({
      text: message,
      fullscreen: false,
    })
  }
}

/**
 * 关闭加载提示
 */
export const hideLoading = () => {
  if (isMobileDevice()) {
    Toast.clear()
  } else {
    // TDesign Vue Next 的 Loading 会自动关闭，这里不需要手动关闭
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
    if (isMobileDevice()) {
      Dialog.confirm({
        title: options.title || '提示',
        content: options.content,
        confirmBtn: options.confirmText || '确定',
        cancelBtn: options.cancelText || '取消',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      })
    } else {
      DialogPlugin.confirm({
        header: options.title || '提示',
        body: options.content,
        confirmBtn: options.confirmText || '确定',
        cancelBtn: options.cancelText || '取消',
        onConfirm: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        },
      })
    }
  })
}
