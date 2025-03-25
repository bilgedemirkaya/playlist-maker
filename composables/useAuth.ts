import { authClient } from '~/lib/auth-client'
import type { User } from 'better-auth/types'

/**
 *
 * Composable function to handle authentication state
 * And user data fetching so any component can update UI when user logs in/out
 * @returns {Object} { user, fetchUser, logout }
 *
 */
export function useAuth() {
  const user = useState<User | null>('auth-user', () => null); // useState creates a reactive and SSR-friendly shared state

  async function fetchUser() {
    const session = await authClient.getSession();

    if (!session.data?.session) {
      user.value = null;

      return;
    }

    // Get user based on the session
    const { data } = await useFetch('/api/user', { watch: false });

    if (data && data.value) {
      user.value = {
        ...data.value,
        createdAt: new Date(data.value?.createdAt || ''),
        updatedAt: new Date(data.value?.updatedAt || ''),
      } as User;
    }
  }

  async function logout() {
    // Deletes the user from the shared state and logs out the user
    user.value = null;
    await authClient.signOut()
  }

  return {
    user,
    fetchUser,
    logout
  }
}
