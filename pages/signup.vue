<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold mb-4 text-center">Create an Account</h1>

        <!-- Signup Form -->
        <form @submit.prevent="handleSignup" class="space-y-4">
          <div class="form-group">
            <label for="email" class="block mb-1 font-medium">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              placeholder="Enter your email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="block mb-1 font-medium">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Enter your password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              minlength="8"
            />
          </div>

          <div class="form-group">
            <label for="name" class="block mb-1 font-medium">Display Name</label>
            <input
              v-model="name"
              type="text"
              id="name"
              placeholder="Enter your display name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <!-- Helper Message -->
          <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
          <div v-if="loading" class="text-blue-500 text-sm">Creating your account...</div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <!-- Login Link -->
        <p class="text-sm text-center text-gray-600 mt-4">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-600 hover:underline">Log in</NuxtLink>
        </p>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { authClient } from "~/lib/auth-client";
import { useAuth } from '~/composables/useAuth'

const { fetchUser } = useAuth();
const email = ref("");
const password = ref("");
const name = ref("");

const loading = ref(false);
const error = ref("");
const router = useRouter();

async function handleSignup() {
  loading.value = true;
  error.value = ""; // Clear any previous errors

  // Calls Better Auth Sign up function
  await authClient.signUp.email(
    {
      email: email.value,
      password: password.value,
      name: name.value },
    {
      onSuccess: () => {
        fetchUser();
        router.push("/playlists");
      },
      onError: (_) => {
        error.value = _.error.message || "Something went wrong";
      },
    }
  );

  loading.value = false;
}
</script>
