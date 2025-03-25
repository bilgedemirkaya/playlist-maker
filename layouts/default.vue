<template>
    <div class="min-h-screen bg-gray-50 text-gray-900">
      <header class="flex justify-between items-center p-4 bg-white shadow">
        <h1 class="text-xl font-bold"><a href="/playlists"> Playlist Maker </a></h1>
        <!-- User Info -->
        <div v-if="user" class="flex items-center space-x-4">
          <p> Hello {{ user.name }} </p>

          <!-- Log Out Button -->
          <button
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Log Out
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter();
const { user, fetchUser, logout } = useAuth();

onMounted(async () => {
  await fetchUser();

  if (!user.value) {
    router.push('/login');
  }
})

async function handleLogout() {
  await logout();
  router.push('/login');
}
</script>
