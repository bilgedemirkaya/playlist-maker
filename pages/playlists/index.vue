<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold mb-4">Your Playlists</h1>

      <!-- Create Playlist Button -->
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        @click="showModal = true"
      >
        + Create Playlist
      </button>
    </div>

    <!-- Helper Texts -->
    <div v-if="loading">Loading playlists...</div>
    <div v-else-if="playlists.length === 0" class="text-gray-600">
      You haven't created any playlists yet.
    </div>
    <div v-else-if="playlistFetchError" class="text-red-500">
      Failed to fetch playlists. Please try again later.
    </div>

    <!-- Playlists -->
    <ul v-else class="space-y-2">
      <li v-for="playlist in playlists" :key="playlist.id">
        <div
          class="flex items-center justify-between p-4 bg-white border rounded shadow hover:bg-gray-50 transition"
        >
          <NuxtLink
            :to="`/playlists/${playlist.id}`"
            class="text-lg font-medium text-blue-700 hover:underline"
          >
            {{ playlist.name }}
          </NuxtLink>

          <button
            class="text-sm text-red-500 hover:text-red-700"
            @click="deletePlaylist(playlist.id)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>

  <!-- Create Playlist Modal -->
  <CreatePlaylistModal
    v-if="showModal"
    @created="handleNewPlaylist"
    @closed="showModal = false"
  />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { authClient } from "~/lib/auth-client";
import { onMounted, ref } from "vue";
import type { Playlist } from "~/types/index.types";
import CreatePlaylistModal from "~/components/CreatePlaylistModal.vue";

const PLAYLIST_LIMIT = 10;
const router = useRouter();
const playlists = ref<Playlist[]>([]);
const loading = ref(false);
const playlistFetchError = ref<boolean>(false);

const showModal = ref(false);

onMounted(async () => {
  loading.value = true;

  const session = await authClient.getSession();
  if (!session.data?.session) {
    router.push("/login");

    return;
  }

  await fetchPlaylists();
  loading.value = false;
});

async function fetchPlaylists() {
  try {
    const { data } = await useFetch("/api/playlists", {
      params: { limit: PLAYLIST_LIMIT, offset: 0 }, // Improvement: Add pagination
    });

    // If the data is available, set the playlists
    // Otherwise, set the error flag to true
    if (data && data.value) {
      playlists.value = data.value;
    }
  } catch (error) {
    playlistFetchError.value = true;
  }
}

async function deletePlaylist(playlistId: number) {
  const confirmed = confirm("Are you sure you want to delete this playlist?");
  if (!confirmed) {
    return;
  }

  try {
    const { data } = await useFetch("/api/playlists/delete-playlist", {
      method: "POST",
      body: { playlistId },
    });

    if (data && data.value) {
      // Fetch the playlists again to update the list
      await fetchPlaylists();
    }
  } catch (error) {
    alert("Failed to delete playlist, please try again.");
  }
}

function handleNewPlaylist() {
  fetchPlaylists();
  showModal.value = false;
}
</script>
