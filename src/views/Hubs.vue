<!-- Volunteering hubs and the students need 75% on the quiz to unlock and enroll in tasks -->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6 pt-20">

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Volunteering Hubs</h1>
      <p class="mt-1 text-sm text-gray-500">Select a task to enrol and start volunteering with glaucoma patients.</p>
    </div>

    <!-- Quiz status banners shows different message depending on whether student has passed, failed or not taken the quiz -->
    <div v-if="!loading && quizScore === null" class="mb-5 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4">
      <p class="text-sm font-semibold text-yellow-800">You need to complete the quiz before enrolling in any tasks.</p>
      <button class="mt-2 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700" @click="$router.push('/quiz')">Take quiz</button>
    </div>

    <div v-else-if="!loading && quizScore !== null && !hasPassed" class="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
      <p class="text-sm font-semibold text-red-700">Your quiz score: {{ quizScore }}% — you need 75% to unlock tasks.</p>
      <p class="mt-0.5 text-sm text-red-500">Don't worry, you can retake the quiz as many times as you need!</p>
      <button class="mt-2 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700" @click="$router.push('/quiz')">Retake quiz</button>
    </div>

    <div v-else-if="!loading && hasPassed" class="mb-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
      <p class="text-sm font-semibold text-green-700">Quiz passed with <span class="text-green-800">{{ quizScore }}%</span> — all tasks are unlocked!</p>
    </div>

    <div v-if="loading" class="rounded-2xl border border-gray-200 bg-white p-6 text-gray-400 shadow-sm">Loading hubs…</div>

    <div v-else class="space-y-4">
      <div v-for="hub in hubs" :key="hub.id" class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <!-- Each hub can be clicked to show or hide the details  -->
        <button class="flex w-full items-start justify-between gap-4 p-5 text-left transition hover:bg-gray-50" @click="toggleHub(hub.id)">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl border border-blue-100">
              {{ hub.icon }}
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900">{{ hub.name }}</h2>
              <p class="mt-0.5 text-xs text-gray-400">{{ hub.address }}</p>
              <p class="mt-1 text-sm text-gray-500">{{ hub.tagline }}</p>
            </div>
          </div>
          <span class="shrink-0 mt-1 text-xs text-gray-400">{{ openHubs.has(hub.id) ? '▲ Hide' : '▼ Details' }}</span>
        </button>

        <div v-if="openHubs.has(hub.id)" class="border-t border-gray-100">

          <!-- Hub information and an embedded Google map-->
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div class="space-y-4 p-5">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">About</p>
                <p class="mt-1 text-sm leading-relaxed text-gray-600">{{ hub.description }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Contact</p>
                <p class="mt-1 text-sm text-gray-600">{{ hub.phone }}</p>
                <p class="text-sm text-gray-600">{{ hub.email }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Opening hours</p>
                <p class="mt-1 text-sm text-gray-600">{{ hub.hours }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Getting there</p>
                <p class="mt-1 text-sm text-gray-600">{{ hub.transport }}</p>
              </div>
            </div>
            <div class="h-64 w-full overflow-hidden border-t border-gray-100 md:border-l md:border-t-0">
              <iframe :src="hub.mapSrc" class="h-full w-full" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" :title="'Map of ' + hub.name"></iframe>
            </div>
          </div>

          <!-- Tasks for this hub are loaded from Firestore and filtered by hub name -->
          <div class="border-t border-gray-100 p-5">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Tasks at this hub</p>
            <div class="space-y-3">
              <div v-for="task in tasksForHub(hub.name)" :key="task.id" class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p class="font-semibold text-gray-900">{{ task.title }}</p>
                    <p class="mt-0.5 text-xs text-gray-400">{{ task.hours }}h · {{ task.points }} pts</p>
                    <p v-if="task.description" class="mt-1 text-sm text-gray-500">{{ task.description }}</p>
                  </div>
                  <span class="rounded-full border px-2.5 py-0.5 text-xs font-semibold" :class="statusClass(getAssignment(task.id)?.status || 'Available')">
                    {{ getAssignment(task.id)?.status || 'Available' }}
                  </span>
                </div>

                <div class="mt-3">
                  <!-- Locked message is  shown when student hasn't passed the quiz yet -->
                  <div v-if="!hasPassed" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-500">
                    Locked — complete the quiz with 75%+ to unlock
                    <button class="text-blue-600 underline hover:text-blue-800" @click="$router.push('/quiz')">
                      {{ quizScore !== null ? 'retake quiz' : 'take quiz' }}
                    </button>
                  </div>

                  <!-- Enroll button is only shown when student has passed and hasn't enrolled yet -->
                  <button
                    v-else-if="!getAssignment(task.id)"
                    class="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    :disabled="enrolling[task.id]" @click="enroll(task.id)"
                  >
                    {{ enrolling[task.id] ? 'Enrolling...' : 'Enrol' }}
                  </button>

                  <p v-else-if="getAssignment(task.id)?.status === 'In Progress'" class="text-sm text-yellow-600">
                    In progress — <button class="underline" @click="$router.push('/dashboard')">submit evidence on dashboard</button>
                  </p>
                  <p v-else-if="getAssignment(task.id)?.status === 'Awaiting Approval'" class="text-sm text-orange-500">Submitted — awaiting approval.</p>
                  <p v-else-if="getAssignment(task.id)?.status === 'Approved'" class="text-sm font-semibold text-green-600">Approved</p>
                </div>
              </div>

              <div v-if="tasksForHub(hub.name).length === 0" class="text-sm text-gray-400">No tasks currently listed for this hub.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../firebase"
import { collection, getDocs, doc, getDoc, runTransaction, query, where } from "firebase/firestore"

// The minimum quiz score required to unlock tasks
const PASS_MARK = 75


const loading = ref(true), error = ref(""), tasks = ref([]), assignments = ref([])
const quizScore = ref(null), openHubs = ref(new Set()), enrolling = ref({})
const auth = getAuth()

// Hub details are hardcoded since they are fixed real world locations that don't change
// Tasks for each hub are loaded dynamically from Firestore
const hubs = [
  { id: "moorfields", name: "Moorfields Eye Hospital", icon: "🏥", address: "162 City Road, London EC1V 2PD", tagline: "The world's oldest and largest eye hospital — supporting patients with glaucoma care.", description: "Moorfields Eye Hospital NHS Foundation Trust is a world-leading centre for the treatment and research of eye disease. Volunteers here assist glaucoma patients with pre-appointment guidance, waiting room support, and educational leaflet distribution.", phone: "020 7253 3411", email: "volunteering@moorfields.nhs.uk", hours: "Mon–Fri 08:00–18:00  ·  Sat 09:00–13:00", transport: "Old Street (Northern line) — 5 min walk  ·  Angel (Northern line) — 10 min walk", mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.065!2d-0.09240!3d51.52680!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ca5b12e4a01%3A0xe7ac44f1a491f1e4!2sMoorfields%20Eye%20Hospital!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk" },
  { id: "sunrise", name: "Sunrise Care Home", icon: "🏡", address: "45 Maple Avenue, Islington, London N1 2RH", tagline: "A warm residential care home supporting elderly residents, many living with glaucoma.", description: "Sunrise Care Home provides 24-hour residential and nursing care for 60 elderly residents. Volunteers assist with companionship visits, reading assistance, guided walks, and helping residents manage their eye drop schedules alongside nursing staff.", phone: "020 7359 1122", email: "volunteers@sunrisecarehome.co.uk", hours: "Mon–Sun 09:00–20:00  (volunteer shifts arranged in advance)", transport: "Highbury & Islington (Victoria/Overground) — 8 min walk  ·  Bus 271, 263", mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.500!2d-0.10390!3d51.53900!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b3c5d6e7f80%3A0x112233445566778!2sIslington%2C%20London%20N1!5e0!3m2!1sen!2suk!4v1700000000001!5m2!1sen!2suk" },
  { id: "hackney", name: "Hackney Community Vision Centre", icon: "🏘️", address: "78 Dalston Lane, Hackney, London E8 3AH", tagline: "A community hub empowering visually impaired residents through education and peer support.", description: "The Hackney Community Vision Centre works with over 300 local residents affected by sight loss. Volunteers take on mentoring roles, run awareness stalls, and help coordinate community outreach events in partnership with local GPs.", phone: "020 8985 4477", email: "info@hackneyvisioncentre.org.uk", hours: "Tue, Wed, Thu 10:00–16:00  ·  Sat 10:00–14:00", transport: "Dalston Junction (London Overground) — 3 min walk  ·  Bus 30, 56, 277", mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.200!2d-0.07450!3d51.54650!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761c7a9b8d0e1f%3A0xaabbccdd11223344!2sDalston%20Lane%2C%20Hackney!5e0!3m2!1sen!2suk!4v1700000000002!5m2!1sen!2suk" }
]


const hasPassed = computed(() => quizScore.value !== null && quizScore.value >= PASS_MARK)

// Filter tasks from Firestore to only show those belonging to a specific hub
const tasksForHub = (hubName) => tasks.value.filter(t => t.hub === hubName)

// Find if the student is already enrolled in a specific task
const getAssignment = (taskId) => assignments.value.find(a => a.taskId === taskId)


const toggleHub = (id) => {
  const next = new Set(openHubs.value)
  next.has(id) ? next.delete(id) : next.add(id)
  openHubs.value = next
}


const statusClass = (status) => {
  if (status === "In Progress")       return "border-yellow-200 bg-yellow-50 text-yellow-700"
  if (status === "Awaiting Approval") return "border-orange-200 bg-orange-50 text-orange-600"
  if (status === "Approved")          return "border-green-200 bg-green-50 text-green-700"
  return "border-gray-200 bg-gray-100 text-gray-600"
}


onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) { error.value = "Not logged in."; loading.value = false; return }
    try {
      // Get the student's quiz score to check if tasks should be locked or unlocked
      const userSnap = await getDoc(doc(db, "users", user.uid))
      quizScore.value = (userSnap.data() || {}).quizScore ?? null

      // Load all tasks and this student's assignments at the same time for efficiency
      const [allSnap, assignmentSnap] = await Promise.all([
        getDocs(collection(db, "tasks")),
        getDocs(query(collection(db, "assignments"), where("userId", "==", user.uid)))
      ])
      tasks.value       = allSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      assignments.value = assignmentSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    } catch (e) { error.value = e.message }
    finally { loading.value = false }
  })
})

// Enroll the student in a task and creates an assignment document in Firestore
// Uses a transaction to prevent the same student enrolling in the same task twice
const enroll = async (taskId) => {
  const user = auth.currentUser
  if (!user || !hasPassed.value) return

  enrolling.value = { ...enrolling.value, [taskId]: true }
  error.value = ""

  // Combine the student's UID and task ID to create a unique assignment ID thisprevents duplicate enrollements 
  const assignmentId  = `${user.uid}_${taskId}`
  const assignmentRef = doc(db, "assignments", assignmentId)

  try {
    await runTransaction(db, async (tx) => {
      const existing = await tx.get(assignmentRef)
      if (existing.exists()) throw new Error("Already enrolled.")
      tx.set(assignmentRef, { taskId, userId: user.uid, status: "In Progress", createdAt: new Date() })
    })
    // Add the new assignment to local state so the UI updates instantly without reloading
    assignments.value = [...assignments.value, { id: assignmentId, taskId, userId: user.uid, status: "In Progress" }]
  } catch (e) {
    error.value = e.message || "Unable to enrol."
  } finally {
    enrolling.value = { ...enrolling.value, [taskId]: false }
  }
}
</script>