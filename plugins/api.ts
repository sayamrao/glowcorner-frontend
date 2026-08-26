import { apiClient } from '~/services/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  apiClient.initialize(config.public.apiBase as string)
})
