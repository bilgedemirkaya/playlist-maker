<script setup lang="ts">
import { authClient } from '~/lib/auth-client'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  const session = await authClient.getSession()

  // Redirect User to relevant routes
  if (session.data?.session) {
    router.replace('/playlists')
  } else {
    router.replace('/login')
  }
})
</script>

<template>
  <div class="text-center mt-10 text-gray-600">
    Redirecting...
  </div>
</template>
