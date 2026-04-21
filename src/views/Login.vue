<!-- Login page for both students and organisations -->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6 pt-20">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Login</h1>
      <p class="mt-1 text-sm text-gray-500">Sign in to your account.</p>
    </div>

    <div class="max-w-xl space-y-4">

      <!-- Buttons to switch between student and organisation login -->
      <div v-if="!showForgot" class="flex gap-3">
        <button
          class="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition"
          :class="loginType === 'student' ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300'"
          @click="loginType = 'student'"
        >
          Student Login
        </button>
        <button
          class="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition"
          :class="loginType === 'organisation' ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300'"
          @click="loginType = 'organisation'"
        >
          Organisation Login
        </button>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <!-- Main login form -->
        <template v-if="!showForgot">
          <p class="mb-4 text-sm text-gray-500">
            {{ loginType === 'student' ? 'Sign in as a student volunteer.' : 'Sign in as a volunteering hub organisation.' }}
          </p>

          <label class="block text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email" v-model="email" placeholder="name@email.com"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            @keydown.enter="login"
          />

          <label class="mt-4 block text-sm font-semibold text-gray-700">Password</label>
          <input
            type="password" v-model="password" placeholder="Password"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            @keydown.enter="login"
          />

          <div class="mt-5 flex flex-wrap gap-3">
            <button
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              :disabled="loading" @click="login"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
            <!-- Register only available for students and organisations need to email for account details -->
            <router-link
              v-if="loginType === 'student'" to="/register"
              class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Register
            </router-link>
          </div>

          <button class="mt-3 text-sm text-blue-600 hover:text-blue-800" @click="openForgot">
            Forgot password?
          </button>

          <!-- Message shown to organisations who dont have an account yet -->
          <div v-if="loginType === 'organisation'" class="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
            Don't have an account? If you are a volunteering organisation email us at
            <a href="mailto:karinkg1924@icloud.com" class="font-semibold underline hover:text-blue-900">karinkg1924@icloud.com</a>
            to apply for access.
          </div>
        </template>

        <!-- Forgot password section -->
        <template v-else>
          <button class="mb-4 text-sm text-gray-500 hover:text-gray-700" @click="closeForgot">← Back to login</button>
          <h2 class="text-base font-semibold text-gray-900">Reset your password</h2>
          <p class="mt-1 text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>

          <label class="mt-4 block text-sm font-semibold text-gray-700">Email address</label>
          <input
            type="email" v-model="resetEmail" placeholder="name@email.com"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            @keydown.enter="sendReset"
          />

          <button
            class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            :disabled="sendingReset" @click="sendReset"
          >
            {{ sendingReset ? 'Sending...' : 'Send reset email' }}
          </button>

          <div v-if="resetSuccess" class="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            Reset email sent! Check your inbox.
            <br /><button class="mt-1 text-green-700 underline" @click="closeForgot">Back to login</button>
          </div>
          <div v-if="resetError" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{{ resetError }}</div>
        </template>

        <!-- Error and success messages -->
        <template v-if="!showForgot">
          <div v-if="error" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{{ error }}</div>
          <div v-if="success" class="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{{ success }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth"
import { db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"

export default {
  data() {
    return {
      loginType: "student",
      email: "", password: "", error: "", success: "", loading: false,
      showForgot: false, resetEmail: "", resetError: "", resetSuccess: false, sendingReset: false
    }
  },

  mounted() {
    // Show success message if the student just registered
    const msg = sessionStorage.getItem("registerSuccess")
    if (msg) {
      this.success = msg
      sessionStorage.removeItem("registerSuccess")
      setTimeout(() => { this.success = "" }, 4000)
    }
  },

  methods: {
    async login() {
      this.error = ""; this.success = ""; this.loading = true
      try {
        const auth = getAuth()
        const cred = await signInWithEmailAndPassword(auth, this.email, this.password)
        const user = cred.user

        // Read the user's role from Firestore to decide where to redirect them
        const snap = await getDoc(doc(db, "users", user.uid))
        const role = (snap.data() || {}).role || "student"

        // Students must verify their email before logging in 
        if (role === "student" && !user.emailVerified) {
          this.error = "Please verify your email before logging in. Check your inbox for a verification link."
          await signOut(auth)
          return
        }

        // Redirect to the correct dashboard based on role
        this.$router.push(role === "organisation" ? "/organisation" : "/dashboard")
      } catch (err) {
        if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
          this.error = "Incorrect password. Please try again."
        } else if (err.code === "auth/user-not-found") {
          this.error = "No account found with that email."
        } else {
          this.error = err.message
        }
      } finally { this.loading = false }
    },

    openForgot() {
      this.resetEmail = this.email; this.resetError = ""; this.resetSuccess = false; this.showForgot = true
    },

    closeForgot() {
      this.showForgot = false; this.resetEmail = ""; this.resetError = ""; this.resetSuccess = false
    },

    // Send a password reset email using Firebase Authentication
    async sendReset() {
      this.resetError = ""; this.resetSuccess = false
      if (!this.resetEmail.trim()) { this.resetError = "Please enter your email."; return }
      this.sendingReset = true
      try {
        await sendPasswordResetEmail(getAuth(), this.resetEmail.trim())
        this.resetSuccess = true
      } catch (err) {
        this.resetError = err.code === "auth/user-not-found" ? "No account found." : err.message
      } finally { this.sendingReset = false }
    }
  }
}
</script>