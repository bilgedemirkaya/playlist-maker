<template>
  <div class="p-6">
    <!-- Editable Playlist Name -->
    <div class="mb-6">
      <div
        v-if="!editingName"
        class="flex items-center gap-3 justify-between mb-4"
      >
        <!-- Playlist Name -->
        <h2 class="text-xl font-semibold playlist-name">{{ playlistName }}</h2>
        <button
          class="text-sm text-blue-600 hover:underline"
          @click="editingName = true"
        >
          ✏️ Edit
        </button>
      </div>
      <!-- Playlist Name Input -->
      <div v-else class="flex items-center gap-2">
        <input
          v-model="playlistName"
          class="border rounded px-3 py-2 w-full"
          placeholder="Playlist name"
        />
        <button
          class="bg-blue-600 text-white px-3 py-2 rounded"
          @click="savePlaylistName"
        > Save
        </button>
        <button
          class="text-sm text-gray-500 hover:underline"
          @click="editingName = false"
        >
          Cancel
        </button>
      </div>
    </div>

    <div v-if="loading">Loading...</div>

    <div v-else>
      <!-- Tracks already in Playlist -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-2">Tracks in this Playlist</h2>
        <ul class="space-y-1">
          <li
            v-for="track in playlistTracks"
            :key="track.TrackId"
            class="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <div>
              <span class="font-medium">{{ track.Name }}</span>
              <div class="text-sm text-gray-500">
                {{ track.Composer || "Unknown composer" }}
              </div>
            </div>

            <!-- Remove Track Button -->
            <button
              @click="removeTrack(track.TrackId)"
              class="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        </ul>
      </div>

      <!-- All Tracks -->
      <div>
        <h2 class="text-lg font-semibold mb-2">All Tracks</h2>
        <ul class="space-y-1">
          <li
            v-for="track in allTracks"
            :key="track.TrackId"
            class="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <span class="font-medium">{{ track.Name }}</span>
              <div class="text-sm text-gray-500">
                {{ track.Composer || "Unknown composer" }}
              </div>
            </div>

            <button
              v-if="!isTrackInPlaylist(track.TrackId)"
              @click="addTrack(track.TrackId)"
              class="text-sm text-blue-600 hover:underline"
            >
              Add
            </button>
            <span v-else class="text-green-600 text-sm">✔ Added</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from "~/lib/auth-client";
import type { Track } from "~/types/index.types";

const route = useRoute();
const router = useRouter();
const playlistId = Number(route.params.id);

const loading = ref(true);
const playlistTracks = ref<Track[]>([]);
const allTracks = ref<Track[]>([]);
const playlistName = ref("");
const editingName = ref(false);

// Set title of the page
useHead({
  title: `Playlist #${route.params.id} | Playlist Maker`,
})

onMounted(async () => {
  // Fetch playlist info to get the name
  const { data: playlistInfo } = await useFetch(
    `/api/playlists/${playlistId}`,
    {
      watch: false,
    }
  );

  playlistName.value = playlistInfo.value?.name || "";
  const session = await authClient.getSession();

  if (!session.data?.session) {
    router.push("/login");
  } else {
    await fetchTracks();
    loading.value = false;
  }
});

async function savePlaylistName() {
  editingName.value = true;

  // Update the playlist name
  const { error } = await useFetch(`/api/playlists/${playlistId}`, {
    method: "PUT",
    body: { name: playlistName.value },
    watch: false,
  });

  editingName.value = false;

  if (error.value) {
    alert("Failed to update name");
  }
}

// Fetch tracks in the playlist and all tracks
async function fetchTracks() {
  const [{ data: playlistData }, { data: allTrackData }] = await Promise.all([
    useFetch<Track[]>(`/api/playlists/${playlistId}/tracks`, { watch: false }),
    useFetch<Track[]>(`/api/tracks`, { watch: false }),
  ]);

  playlistTracks.value = playlistData.value || [];
  allTracks.value = allTrackData.value || [];
}

async function addTrack(trackId: number) {
  const { data } = await useFetch(
    `/api/playlists/${playlistId}/add-track`,
    {
      method: "POST",
      body: { playlistId, trackId },
      watch: false,
    }
  );

  if (data.value && data.value.success) {
    await fetchTracks();
  }
}

async function removeTrack(trackId: number) {
  const { data } = await useFetch(
    `/api/playlists/${playlistId}/remove-track`,
    {
      method: "POST",
      body: { playlistId, trackId },
      watch: false,
    }
  );

  if (data.value && data.value?.success) {
    await fetchTracks();
  }
}

function isTrackInPlaylist(trackId: number) {
  return playlistTracks.value.some((t) => t.TrackId === trackId);
}
</script>

<style lang="css" scoped>
.playlist-name::first-letter {
  text-transform: capitalize;
}
</style>
