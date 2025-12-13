import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/utils/api'
import type { AccountDto } from '@/api/model/dto/AccountDto'

export type UserProfile = AccountDto['AccountService/SIMPLE_ACCOUNT'] | null

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile>(null)
  const loaded = ref(false)

  const syncLocalProfile = (data: UserProfile) => {
    if (data?.username) {
      localStorage.setItem('user_name', data.username)
    }
    if (data?.role) {
      localStorage.setItem('user_role', data.role as string)
    }
    if (data?.id) {
      localStorage.setItem('user_id', data.id)
    }
  }

  const setProfile = (data: UserProfile) => {
    profile.value = data
    syncLocalProfile(data)
  }

  const clearProfile = () => {
    profile.value = null
    loaded.value = false
    localStorage.removeItem('user_name')
  }

  const fetchProfile = async (force = false): Promise<UserProfile> => {
    const hasToken = !!localStorage.getItem('auth_token')
    if (!hasToken) {
      clearProfile()
      loaded.value = true
      return null
    }

    if (!force && loaded.value && profile.value) {
      return profile.value
    }

    try {
      const data = await api.accountService.me()
      setProfile(data || null)
      return profile.value
    } catch (error) {
      // 保持已有数据，抛出以便调用方处理
      throw error
    } finally {
      loaded.value = true
    }
  }

  return {
    profile,
    loaded,
    setProfile,
    clearProfile,
    fetchProfile,
  }
})
