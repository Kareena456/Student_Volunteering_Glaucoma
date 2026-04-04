
Copy

<!--
  Dashboard.vue — The main student dashboard where everything is displayed
  Shows the student's profile, quiz score, stats (points, hours, tasks),
  overall progress bar, enrolled tasks with evidence submission,
  recent activity feed, and certificate download when all tasks are approved.
  Uses real-time Firebase listeners so everything updates instantly.
-->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6 pt-20">
 
    <div v-if="loading" class="rounded-2xl border border-gray-200 bg-white p-6 text-gray-400 shadow-sm">Loading…</div>
 
    <div v-else class="space-y-5">
 
      <!-- Profile card shows name, quiz status, and certificate download -->
      <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Avatar with initials and a colour based on the user's name -->
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold" :class="avatarClass">
            {{ initials }}
          </div>
          <div class="flex-1">
            <p class="text-xl font-bold text-gray-900">{{ firstName }} {{ lastName }}</p>
            <p class="text-sm text-gray-500">Student volunteer</p>
            <!-- Quiz status badge changes colour based on score -->
            <div class="mt-2">
              <span v-if="quizScore === null" class="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-0.5 text-xs font-semibold text-yellow-700">
                Quiz not completed
              </span>
              <span v-else-if="quizScore >= 75" class="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-0.5 text-xs font-semibold text-green-700">
                Quiz passed — {{ quizScore }}%
              </span>
              <span v-else class="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-0.5 text-xs font-semibold text-red-600">
                Quiz score: {{ quizScore }}% — retake to unlock tasks
              </span>
            </div>
          </div>
          <!-- Certificate download  only enabled when all tasks are approved -->
          <div>
            <button
              class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!canDownloadCertificate"
              :title="canDownloadCertificate ? 'Download your certificate' : 'All tasks must be approved first'"
              @click="downloadCertificate"
            >
              Download certificate
            </button>
          </div>
        </div>
      </section>
 
        <!-- Stats cards points, hours, tasks, quiz score -->
        <section class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div class="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Points</p>
            <p class="mt-2 text-4xl font-bold text-blue-700">{{ points }}</p>
            <p class="mt-1 text-xs text-blue-400">Earned so far</p>
          </div>
          <div class="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Approved hours</p>
            <p class="mt-2 text-4xl font-bold text-blue-700">{{ totalHoursApproved }}</p>
            <p class="mt-1 text-xs text-blue-400">Towards certificate</p>
          </div>
          <div class="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Tasks enrolled</p>
            <p class="mt-2 text-4xl font-bold text-blue-700">{{ assignments.length }}</p>
            <p class="mt-1 text-xs text-blue-400">Total taken on</p>
          </div>
          <div class="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p class="text-xs font-semibold uppercase tracking-wider text-blue-400">Quiz score</p>
            <p class="mt-2 text-4xl font-bold" :class="quizScore !== null ? 'text-blue-700' : 'text-gray-300'">
              {{ quizScore !== null ? quizScore + '%' : '—' }}
            </p>
            <p class="mt-1 text-xs text-blue-400">{{ quizScore !== null ? 'Knowledge assessment' : 'Not taken yet' }}</p>
          </div>
        </section>
 
        <!-- Overall progress bar shows how many tasks have been approved -->
        <section v-if="assignments.length > 0" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div class="mb-3 flex items-center justify-between">
            <p class="font-semibold text-gray-900">Overall progress</p>
            <p class="text-sm text-gray-400">{{ approvedCount }} / {{ assignments.length }} tasks approved</p>
          </div>
          <div class="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div class="h-full rounded-full bg-blue-500 transition-all duration-700" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <p class="mt-2 text-xs text-gray-400">{{ progressPercent }}% complete</p>
          <!-- Certificate ready message only shown when all tasks are approved -->
          <div v-if="canDownloadCertificate" class="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            All tasks approved — your certificate is ready to download!
          </div>
          <div v-else class="mt-2 text-xs text-gray-400">
            Certificate unlocks when all tasks are approved by your hub organisation.
          </div>
        </section>
 
        <!-- Enrolled tasks list with evidence submission -->
        <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 class="mb-4 text-lg font-bold text-gray-900">Your tasks</h2>
 
          <!-- Empty state shown when student hasn't enrolled in anything yet -->
          <div v-if="assignments.length === 0" class="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
            <p class="text-sm text-gray-400">No tasks enrolled yet.</p>
            <button class="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700" @click="$router.push('/hubs')">
              Browse hubs
            </button>
          </div>
 
          <div v-else class="space-y-3">
            <div v-for="item in assignmentItems" :key="item.assignmentId" class="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p class="font-semibold text-gray-900">{{ item.title }}</p>
                  <p class="mt-0.5 text-sm text-gray-400">{{ item.hub }} · {{ item.difficulty }} · {{ item.hours }}h · {{ item.points }} pts</p>
                </div>
                <!-- Status badge colour changes based on current status -->
                <span class="rounded-full border px-2.5 py-0.5 text-xs font-semibold" :class="statusClass(item.status)">{{ item.status }}</span>
              </div>
 
              <!-- Evidence submission form only shown for tasks that are In Progress -->
              <div v-if="item.status === 'In Progress'" class="mt-4 space-y-3 border-t border-gray-100 pt-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700">
                    Evidence description
                    <span class="ml-1 font-normal text-gray-400">(include what you did, date and time — minimum 20 characters)</span>
                  </label>
                  <textarea
                    v-model="evidenceText[item.assignmentId]" rows="3"
                    placeholder="Describe what you did, where, and when (include date and time)."
                    class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  ></textarea>
                  <!-- Requirements checklist shown under the evidence box -->
                  <div class="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                    <p class="font-semibold">Evidence must include:</p>
                    <ul class="mt-1 space-y-0.5 pl-3">
                      <li>• What you did</li>
                      <li>• Date and time</li>
                      <li>• Location</li>
                    </ul>
                  </div>
                </div>
                <!-- Optional feedback field for the student to share their experience -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700">
                    Your feedback
                    <span class="ml-1 font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    v-model="feedbackText[item.assignmentId]" rows="2"
                    placeholder="e.g. Really enjoyed the experience."
                    class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  ></textarea>
                </div>
                <button
                  class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  :disabled="submittingEvidence[item.assignmentId]" @click="submitEvidence(item)"
                >
                  {{ submittingEvidence[item.assignmentId] ? 'Submitting…' : 'Submit evidence' }}
                </button>
              </div>
 
              <!-- Show the submitted evidence text for tasks awaiting approval -->
              <div v-if="item.status === 'Awaiting Approval' && item.evidenceText" class="mt-3 border-t border-gray-100 pt-3">
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Submitted evidence</p>
                <p class="mt-1 text-sm text-gray-600">{{ item.evidenceText }}</p>
              </div>
            </div>
          </div>
        </section>
 
        <!-- Recent activity feed built from the student's assignment statuses and quiz completion -->
        <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 class="mb-4 text-lg font-bold text-gray-900">Recent activity</h2>
          <div v-if="recentActivity.length === 0" class="text-sm text-gray-400">No activity yet — enrol in a task to get started.</div>
          <ul v-else class="space-y-3">
            <li v-for="(event, i) in recentActivity" :key="i" class="flex items-start gap-3">
              <span class="mt-0.5 text-base">{{ event.icon }}</span>
              <div>
                <p class="text-sm text-gray-700">{{ event.label }}</p>
                <p class="text-xs text-gray-400">{{ event.time }}</p>
              </div>
            </li>
          </ul>
        </section>
 
        <!-- Chatbot hint lets students know help is available -->
        <section class="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
          <p class="text-sm text-blue-700">
            Need help? Use the <span class="font-semibold">chat assistant</span> in the bottom right corner for guidance on glaucoma or your volunteering tasks.
          </p>
        </section>
 
    </div>
  </div>
</template>
 
<script setup>
import jsPDF from "jspdf"
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useRouter } from "vue-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../firebase"
import { doc, collection, query, where, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore"
 
// All the reactive data the dashboard needs to display and update in real time
// These variables automatically update the UI whenever their values change in Firebase
// ref() makes each variable reactive — Vue watches them and re-renders when they change
const loading = ref(true), firstName = ref(""), lastName = ref(""), points = ref(0)
const totalHoursApproved = ref(0), role = ref(""), quizScore = ref(null)
const assignments = ref([]), taskMap = ref(new Map())
const evidenceText = ref({}), feedbackText = ref({}), submittingEvidence = ref({})
const router = useRouter()
 
//Computed properties
 
//Generate initials from first and last name for the avatar
const initials = computed(() =>
  ((firstName.value || "").trim()[0]?.toUpperCase() || "") +
  ((lastName.value  || "").trim()[0]?.toUpperCase() || "") || "?"
)
 
// Pick a consistent avatar colour based on the user's name
const avatarClass = computed(() => {
  const key = `${firstName.value}${lastName.value}`.trim()
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % 997
  return ["bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700", "bg-purple-100 text-purple-700", "bg-red-100 text-red-700"][key ? hash % 5 : 0]
})
 
// Count how many tasks have been approved
const approvedCount = computed(() => assignments.value.filter(a => a.status === "Approved").length)
 
// Calculate the overall completion percentage
const progressPercent = computed(() =>
  !assignments.value.length ? 0 : Math.round((approvedCount.value / assignments.value.length) * 100)
)
 
// Certificate is only available when every single task is approved
const canDownloadCertificate = computed(() =>
  assignments.value.length > 0 && assignments.value.every(a => a.status === "Approved")
)
 
// Merge assignment data with task details for display
const assignmentItems = computed(() =>
  assignments.value.map(a => {
    const task = taskMap.value.get(a.taskId) || {}
    return {
      assignmentId: a.id,
      taskId:       a.taskId,
      status:       a.status,
      evidenceText: a.evidenceText || "",
      title:        task.title      || "Untitled task",
      hub:          task.hub        || "Unknown hub",
      difficulty:   task.difficulty || "Unknown",
      hours:        task.hours      ?? 0,
      points:       task.points     ?? 0
    }
  })
)
 
// Build a recent activity feed from quiz completion and task statuses
const recentActivity = computed(() => {
  const events = []
  if (quizScore.value !== null) {
    events.push({ icon: "🧠", label: `Completed glaucoma quiz — scored ${quizScore.value}%`, time: "Quiz completed" })
  }
  assignmentItems.value.forEach(item => {
    if (item.status === "Approved")
      events.push({ icon: "✅", label: `Task approved: "${item.title}"`, time: `+${item.hours}h · +${item.points} pts` })
    else if (item.status === "Awaiting Approval")
      events.push({ icon: "⏳", label: `Evidence submitted for "${item.title}"`, time: "Awaiting review" })
    else if (item.status === "In Progress")
      events.push({ icon: "🔄", label: `Enrolled in "${item.title}"`, time: "In progress" })
  })
  return events.slice(0, 6)
})
 
// Return the correct colour classes for each task status badge
const statusClass = (status) => {
  if (status === "In Progress")       return "border-yellow-200 bg-yellow-50 text-yellow-700"
  if (status === "Awaiting Approval") return "border-orange-200 bg-orange-50 text-orange-600"
  if (status === "Approved")          return "border-green-200 bg-green-50 text-green-700"
  return "border-gray-200 bg-gray-50 text-gray-600"
}
 
//  Firebase listeners 
let unsubscribeUser = null, unsubscribeAssignments = null, unsubscribeTasks = null, unsubscribePending = null
 
const subscribe = (uid) => {
  // Listen to the user's Firestore document for real-time profile updates
  unsubscribeUser = onSnapshot(doc(db, "users", uid), async (snap) => {
    const u = snap.data() || {}
    firstName.value          = u.firstName || ""
    lastName.value           = u.lastName  || ""
    role.value               = u.role      || ""
    points.value             = u.points    || 0
    quizScore.value          = u.quizScore ?? null
    totalHoursApproved.value = u.totalHoursApproved ?? u.approvedHours ?? 0
 
 
  })
 
  // Listen to this student's assignments in real time
  unsubscribeAssignments = onSnapshot(
    query(collection(db, "assignments"), where("userId", "==", uid)),
    (snap) => { assignments.value = snap.docs.map(d => ({ id: d.id, ...d.data() })) }
  )
 
  // Listen to all tasks so we can show task details alongside assignments
  unsubscribeTasks = onSnapshot(collection(db, "tasks"), (snap) => {
    const map = new Map()
    snap.docs.forEach(d => map.set(d.id, d.data()))
    taskMap.value = map
  })
}
 
//  Evidence submission 
const submitEvidence = async (task) => {
  const user = getAuth().currentUser
  if (!user) return
 
  const text     = (evidenceText.value[task.assignmentId] || "").trim()
  const feedback = (feedbackText.value[task.assignmentId] || "").trim()
 
  // Validate that evidence is at least 10 characters  prevents meaningless one-word submissions
  if (text.length < 20) {
    alert("Please provide more detailed evidence (at least 20 characters).")
    return
  }
 
  // Check the student has included a date in their evidence
  const hasDate = text.toLowerCase().includes("date") ||
    /\d{1,2}[\/\-]\d{1,2}/.test(text) ||
    /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(text)
  if (!hasDate) {
    alert("Please include the date of your activity in your evidence description.")
    return
  }
 
  submittingEvidence.value = { ...submittingEvidence.value, [task.assignmentId]: true }
 
  try {
    // Use a Firestore transaction to safely update the assignment status
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(doc(db, "assignments", task.assignmentId))
      if (!snap.exists()) throw new Error("Task no longer exists.")
      const data = snap.data()
      if (data.userId !== user.uid) throw new Error("You can only submit evidence for your own tasks.")
      if (data.status !== "In Progress") throw new Error("Task is not in progress.")
 
      // Update the assignment with the evidence and change status to Awaiting Approval
      tx.update(doc(db, "assignments", task.assignmentId), {
        evidenceText:        text,
        feedbackText:        feedback || null,
        evidenceSubmittedAt: serverTimestamp(),
        status:              "Awaiting Approval"
      })
    })
 
    // Clear the form fields after successful submission
    evidenceText.value = { ...evidenceText.value, [task.assignmentId]: "" }
    feedbackText.value = { ...feedbackText.value, [task.assignmentId]: "" }
  } catch (e) {
    alert(e.message || "Unable to submit evidence.")
  } finally {
    submittingEvidence.value = { ...submittingEvidence.value, [task.assignmentId]: false }
  }
}
 
//Certificate generation 
const downloadCertificate = () => {
  // Generate a PDF certificate using jsPDF
  const pdf = new jsPDF()
  pdf.setFontSize(22); pdf.setFont("helvetica", "bold")
  pdf.text("Certificate of Volunteering", 105, 30, { align: "center" })
  pdf.setFontSize(13); pdf.setFont("helvetica", "normal")
  pdf.text("This certifies that", 105, 50, { align: "center" })
  pdf.setFontSize(18); pdf.setFont("helvetica", "bold")
  pdf.text(`${firstName.value} ${lastName.value}`, 105, 62, { align: "center" })
  pdf.setFontSize(13); pdf.setFont("helvetica", "normal")
  pdf.text("has successfully completed all volunteering tasks in the", 105, 76, { align: "center" })
  pdf.text("Glaucoma Awareness Student Volunteering Programme.", 105, 86, { align: "center" })
  pdf.setFontSize(12)
  pdf.text(`Approved hours: ${totalHoursApproved.value}`, 40, 106)
  pdf.text(`Points earned: ${points.value}`, 40, 116)
  pdf.text(`Quiz score: ${quizScore.value ?? "N/A"}%`, 40, 126)
  pdf.text(`Date issued: ${new Date().toLocaleDateString("en-GB")}`, 40, 136)
  pdf.setFontSize(10); pdf.setTextColor(120)
  pdf.text("Issued by the Glaucoma Care Volunteering Platform", 105, 160, { align: "center" })
  pdf.save("volunteering-certificate.pdf")
}
 
// Auth and lifecycle
onMounted(() => {
  // Check if a user is logged in redirect to login if not
  onAuthStateChanged(getAuth(), (user) => {
    if (!user) { loading.value = false; router.push("/login"); return }
    subscribe(user.uid)
    loading.value = false
  })
})
 
// Clean up all Firebase listeners when the component is destroyed
onUnmounted(() => {
  unsubscribeUser?.()
  unsubscribeAssignments?.()
  unsubscribeTasks?.()
  unsubscribePending?.()
})
</script>