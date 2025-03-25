
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-semibold mb-4 text-center">Log In</h1>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block mb-1 font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label for="password" class="block mb-1 font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your password"
            required
            minlength="8"
          />
        </div>

        <!-- Helper Message -->
        <div v-if="error" class="text-red-600 text-sm" aria-live="polite">{{ error }}</div>
        <div v-if="loading" class="text-blue-500 text-sm">Logging in...</div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>

      <p class="text-sm text-center text-gray-600 mt-4">
        Don't have an account?
        <NuxtLink to="/signup" class="text-blue-600 hover:underline">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from "~/lib/auth-client"
import { useAuth } from '~/composables/useAuth'

const { fetchUser } = useAuth();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();

async function handleLogin() {
  loading.value = true;
  error.value = "";

  // Calls Better Auth Sign in function
  await authClient.signIn.email(
    {
      email: email.value,
      password: password.value,
    },
    {
      onSuccess: () => {
        fetchUser();

        router.push("/playlists");
      },
      onError: (ctx) => {
        console.error("login error", ctx);
        error.value = ctx.error.message || "Invalid email or password";
      },
    }
  )

  loading.value = false
}
</script>
