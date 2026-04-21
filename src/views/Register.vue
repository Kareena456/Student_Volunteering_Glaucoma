<!--
  This is the student registration page when a student fills in this form and clicks Create account then 
  1. Firebase Authentication creates their login account
  2. A Firestore document is saved with their details automatically
  3. A verification email is sent to them
  4. They are redirected to the login page
-->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6 pt-20">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Student Registration</h1>
      <p class="mt-1 text-sm text-gray-500">Create your account to start volunteering. Must be 18 or older.</p>
    </div>

    <div class="max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="space-y-4">

        <div>
          <label class="block text-sm font-semibold text-gray-700">First name</label>
          <input v-model="firstName" type="text" placeholder="e.g. Jane"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700">Last name</label>
          <input v-model="lastName" type="text" placeholder="e.g. Smith"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700">Email</label>
          <input v-model="email" type="email" placeholder="e.g. name@gmail.com"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          <p class="mt-1 text-xs text-gray-400">Enter a valid email address e.g. name@gmail.com</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700">Confirm email</label>
          <input v-model="confirmEmail" type="email" placeholder="Re-enter your email"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          <!--  Turns green if emails match, red if they don't -->
          <p v-if="confirmEmail && email" class="mt-1 text-xs" :class="email === confirmEmail ? 'text-green-600' : 'text-red-500'">
            {{ email === confirmEmail ? 'Emails match' : 'Emails do not match' }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700">Date of birth</label>
          <input v-model="dob" type="date"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          <p class="mt-1 text-xs text-gray-400">You must be at least 18 years old to register.</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700">Password</label>
          <input v-model="password" type="password" placeholder="Create a password"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />

          <!-- Password rules tick green as each requirement is met -->
          <div class="mt-2 space-y-1">
            <p class="flex items-center gap-1.5 text-xs" :class="password.length >= 6 ? 'text-green-600' : 'text-gray-400'">
              <span>{{ password.length >= 6 ? '✓' : '○' }}</span> At least 6 characters
            </p>
            <p class="flex items-center gap-1.5 text-xs" :class="hasSpecialChar ? 'text-green-600' : 'text-gray-400'">
              <span>{{ hasSpecialChar ? '✓' : '○' }}</span> At least 1 special character (e.g. ! @ # $)
            </p>
          </div>

          <!-- Password strength bar updates as the student types -->
          <div v-if="password.length > 0" class="mt-2">
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div class="h-full rounded-full transition-all duration-300" :class="strengthBarColor" :style="{ width: strengthPercent + '%' }"></div>
            </div>
            <p class="mt-1 text-xs" :class="strengthTextColor">{{ strengthLabel }}</p>
          </div>
        </div>

        <!-- Validation errors and success messages -->
        <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{{ error }}</div>
        <div v-if="success" class="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{{ success }}</div>

        <button
          class="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          :disabled="loading" @click="register"
        >
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>

        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <router-link to="/login" class="font-semibold text-blue-600 hover:text-blue-800">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth"
import { db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"

export default {
  setup() {
    // Form fields
    const firstName = ref(""), lastName = ref(""), email = ref(""), confirmEmail = ref("")
    const dob = ref(""), password = ref(""), error = ref(""), success = ref(""), loading = ref(false)

    // Check if the password contains at least one special character
    const hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password.value))

    // Calculate password strength score out of 4
    const strengthScore = computed(() => {
      let s = 0
      if (password.value.length >= 6)   s++
      if (password.value.length >= 10)  s++
      if (hasSpecialChar.value)         s++
      if (/[A-Z]/.test(password.value)) s++
      return s
    })

    // Convert strength score to a percentage for the strength bar
    const strengthPercent   = computed(() => !password.value.length ? 0 : Math.min((strengthScore.value / 4) * 100, 100))
    const strengthLabel     = computed(() => ["Weak", "Fair", "Good", "Strong"][Math.min(strengthScore.value - 1, 3)] || "Weak")
    const strengthBarColor  = computed(() => ["bg-red-400", "bg-yellow-400", "bg-blue-500", "bg-green-500"][Math.min(strengthScore.value - 1, 3)] || "bg-red-400")
    const strengthTextColor = computed(() => ["text-red-500", "text-yellow-600", "text-blue-600", "text-green-600"][Math.min(strengthScore.value - 1, 3)] || "text-red-500")

    const register = async () => {
      error.value = ""; success.value = ""

      // Validate all fields before sending anything to Firebase
      if (!firstName.value || !lastName.value) { error.value = "Please enter your first and last name."; return }
      if (!email.value) { error.value = "Please enter your email."; return }
      if (!email.value.includes("@") || !email.value.includes(".")) { error.value = "Please enter a valid email address"; return }
      if (email.value !== confirmEmail.value) { error.value = "Email addresses do not match."; return }
      if (!dob.value) { error.value = "Please enter your date of birth."; return }

      // Block registration if the student is under 18
      const today = new Date(), b = new Date(dob.value)
      const age = today.getFullYear() - b.getFullYear()
      const under18 = age < 18 || (age === 18 && (today.getMonth() < b.getMonth() || (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())))
      if (under18) { error.value = "You must be at least 18 years old to register."; return }

      // Block registration if password requirements are not met
      if (password.value.length < 6) { error.value = "Password must be at least 6 characters."; return }
      if (!hasSpecialChar.value) { error.value = "Password must include at least one special character."; return }

      loading.value = true
      try {
        // Create the Firebase Authentication account
        const cred = await createUserWithEmailAndPassword(getAuth(), email.value, password.value)

        // Save the student's profile to Firestore with starting values
        await setDoc(doc(db, "users", cred.user.uid), {
          firstName:          firstName.value,
          lastName:           lastName.value,
          dob:                dob.value,
          role:               "student",   
          points:             0,
          quizScore:          null,        // null means quiz not taken yet
          totalHoursApproved: 0
        })

        // Send verification email then sign out and the student must verify before logging in
        await sendEmailVerification(cred.user)
        await signOut(getAuth())

        // Send a  success message to the login page using sessionStorage
        sessionStorage.setItem("registerSuccess", "Account created! Please verify your email then log in.")
        setTimeout(() => { window.location.href = "/login" }, 1500)
      } catch (err) {
        error.value = err.code === "auth/email-already-in-use"
          ? "An account with this email already exists."
          : err.message
      } finally { loading.value = false }
    }

    return { firstName, lastName, email, confirmEmail, dob, password, error, success, loading, hasSpecialChar, strengthPercent, strengthLabel, strengthBarColor, strengthTextColor, register }
  }
}
</script>
