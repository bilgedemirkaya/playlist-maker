<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded p-6 w-[90%] max-w-md shadow-xl">
      <h2 class="text-xl font-semibold mb-4">Create New Playlist</h2>

      <!-- Create Form -->
      <form @submit.prevent="handleSubmit">
        <input
          v-model="playlistName"
          type="text"
          placeholder="Playlist"
          class="w-full border px-3 py-2 rounded mb-4"
          required
        />

        <div class="flex justify-end gap-2">
          <button type="button" class="text-gray-600" @click="emit('closed')">
            Cancel
          </button>

          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded"
          >
           Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "closed"): void;
  (e: "created"): void;
}>();

const playlistName = ref("");

async function handleSubmit() {
  if (!playlistName.value) {
    return;
  };

  // Create a new playlist in the database
  const { data, error } = await useFetch("/api/playlists", {
    method: "POST",
    body: { playlistName: playlistName.value },
  });

  if (error.value) {
    alert("Failed to create playlist, please try again.");
  }
  else if (data.value?.success) {
    playlistName.value = "";
    emit("created");
  }
}
</script>
