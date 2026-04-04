<!--
  NavBar.vue — navigation bar shown at the top of every page.
  It watches Firebase Authentication in real time and shows different
  links depending on whether the user is logged out, a student, or an organisation it also Shows the logged in user's first name when authenticated.-->
<template>
  <nav class="fixed left-0 right-0 top-0 z-40 border-b border-blue-100 bg-white shadow-sm">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">

      <!-- Logo,clicking this always takes you back to the home page -->
      <router-link
        to="/"
        class="flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-600"
      >
        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">G</span>
        Glaucoma Care
      </router-link>

      <!-- Navigation links, change based on who is logged in -->
      <div class="flex items-center gap-2">

        <!-- Shown when nobody is logged in -->
        <template v-if="!user">
          <router-link to="/login" class="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50">
            Login
          </router-link>
          <router-link to="/register" class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
            Register
          </router-link>
        </template>

        <!-- Shown when a student is logged in -->
        <template v-else-if="role === 'student'">
          <!-- Show the student's first name as a friendly greeting -->
          <span v-if="firstName" class="hidden text-xs text-gray-400 sm:inline">Hi, {{ firstName }}</span>
          <router-link
            to="/dashboard"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="$route.path === '/dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-blue-700'"
          >
            Dashboard
          </router-link>
          <router-link
            to="/hubs"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="$route.path === '/hubs' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-blue-700'"
          >
            Hubs
          </router-link>
          <router-link
            to="/quiz"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="$route.path === '/quiz' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-blue-700'"
          >
            Quiz
          </router-link>
          <button
            class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
            @click="logout"
          >
            Logout
          </button>
        </template>

        <!-- Shown when an organisation is logged in -->
        <template v-else-if="role === 'organisation'">
          <!-- Show the organisation/hub name -->
          <span v-if="firstName" class="hidden text-xs text-gray-400 sm:inline">{{ firstName }}</span>
          <router-link
            to="/organisation"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="$route.path === '/organisation' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-blue-700'"
          >
            Dashboard
          </router-link>
          <button
            class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
            @click="logout"
          >
            Logout
          </button>
        </template>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "vue-router"

const router    = useRouter()
const user      = ref(null)   // stores the currently logged in user
const role      = ref("")     // stores their role: "student" or "organisation"
const firstName = ref("")     // stores their first name or hub name for display

let unsubscribe = null

// Watch Firebase Authentication in real time updates the navbar instantly when login state changes
onMounted(() => {
  unsubscribe = onAuthStateChanged(getAuth(), async (u) => {
    user.value = u
    if (u) {
      // Fetch the user's role and name from Firestore
      const snap = await getDoc(doc(db, "users", u.uid))
      const data  = snap.data() || {}
      role.value      = data.role      || "student"
      // For students show first name, for organisations show hub name
      firstName.value = role.value === "organisation" ? data.hub : data.firstName || ""
    } else {
      role.value      = ""
      firstName.value = ""
    }
  })
})

// Clean up the Firebase listener when the component is destroyed
onUnmounted(() => unsubscribe?.())

// Logs the user out and redirect to the home page
const logout = async () => {
  await signOut(getAuth())
  router.push("/")
}
</script>