<!--
  Organisation.vue is the the organisation dashboard
  Shown to hub organisations after they log in
  Allows them to add and delete tasks, review student submissions and approve or reject evidence
  The dashboard only shows data for the hub that is currently logged in
-->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6 pt-20">

    <div v-if="loading" class="rounded-2xl border border-gray-200 bg-white p-6 text-gray-400 shadow-sm">Loading...</div>

    <div v-else class="space-y-5">

      <!-- Hub header showing the organisation name -->
      <section class="rounded-2xl border border-blue-100 bg-blue-600 p-6 text-white shadow-sm">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl">🏥</div>
          <div>
            <p class="text-xl font-bold">{{ hubName }}</p>
            <p class="text-sm text-blue-100">Organisation account</p>
          </div>
        </div>
      </section>

      <!-- Stats cards showing tasks listed, pending approvals, approved count and hours given -->
      <section class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Our tasks</p>
          <p class="mt-2 text-4xl font-bold text-gray-900">{{ myTasks.length }}</p>
          <p class="mt-1 text-xs text-gray-400">Listed activities</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Pending</p>
          <p class="mt-2 text-4xl font-bold text-gray-900">{{ pendingSubmissions.length }}</p>
          <p class="mt-1 text-xs text-gray-400">Awaiting approval</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Approved</p>
          <p class="mt-2 text-4xl font-bold text-gray-900">{{ approvedCount }}</p>
          <p class="mt-1 text-xs text-gray-400">Total submissions</p>
        </div>
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Hours given</p>
          <p class="mt-2 text-4xl font-bold text-gray-900">{{ totalHoursGiven }}</p>
          <p class="mt-1 text-xs text-gray-400">Across all students</p>
        </div>
      </section>

      <!-- Add new tvolunteering tasks and this saves to Firestore and appears on the Hubs page instantly -->
      <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-bold text-gray-900">Add new activity</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700">Activity title</label>
            <input v-model="newTask.title" type="text" placeholder="e.g. Waiting room support"
              class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700">Description</label>
            <textarea v-model="newTask.description" rows="2" placeholder="e.g. Assist patients in the waiting area"
              class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700">Hours</label>
              <input v-model.number="newTask.hours" type="number" min="1" max="20" placeholder="e.g. 2"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700">Points</label>
              <input v-model.number="newTask.points" type="number" min="1" placeholder="e.g. 50"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>

          <!-- Difficulty selector using styled buttons instead of a dropdown -->
          <div>
            <label class="block text-sm font-semibold text-gray-700">Difficulty</label>
            <div class="mt-1 flex gap-2">
              <button v-for="level in ['Easy', 'Medium', 'Hard']" :key="level"
                class="flex-1 rounded-lg border py-2 text-sm font-semibold transition"
                :class="newTask.difficulty === level ? difficultyActiveClass(level) : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-blue-300'"
                @click="newTask.difficulty = level"
              >{{ level }}</button>
            </div>
          </div>

          <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60" :disabled="addingTask" @click="addTask">
            {{ addingTask ? 'Adding...' : '+ Add activity' }}
          </button>
          <div v-if="addTaskError" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{{ addTaskError }}</div>
          <div v-if="addTaskSuccess" class="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            Activity added! It is now visible to students on the Hubs page.
          </div>
        </div>
      </section>

      <!-- List of this organisation's existing activities with delete option -->
      <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-bold text-gray-900">Our activities</h2>
        <div v-if="myTasks.length === 0" class="text-sm text-gray-400">No activities added yet.</div>
        <div v-else class="space-y-2">
          <div v-for="task in myTasks" :key="task.id" class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ task.title }}</p>
              <p class="mt-0.5 text-xs text-gray-400">
                {{ task.hours }}h · {{ task.points }} pts ·
                <span class="rounded-full border px-1.5 py-0.5 font-semibold" :class="difficultyClass(task.difficulty)">{{ task.difficulty }}</span>
              </p>
              <p v-if="task.description" class="mt-0.5 text-xs text-gray-400">{{ task.description }}</p>
            </div>
            <!-- Delete button removes the task from Firestore -->
            <button class="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-100" @click="deleteTask(task.id)">Delete</button>
          </div>
        </div>
      </section>

      <!-- Pending submissions from students waiting to be reviewed -->
      <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-bold text-gray-900">
          Pending submissions
          <!-- Badge showing how many submissions are waiting -->
          <span v-if="pendingSubmissions.length > 0" class="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">{{ pendingSubmissions.length }}</span>
        </h2>
        <div v-if="pendingSubmissions.length === 0" class="text-sm text-gray-400">No pending submissions — all caught up!</div>
        <div v-else class="space-y-4">
          <div v-for="r in pendingSubmissions" :key="r.assignmentId" class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p class="font-semibold text-gray-900">{{ r.title }}</p>
                <p class="mt-0.5 text-xs text-gray-400">{{ r.hours }}h · {{ r.points }} pts</p>
              </div>
              <span class="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">Awaiting Approval</span>
            </div>

            <!-- Student name loaded from their Firestore document -->
            <div class="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
              <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Student</p>
              <p class="mt-0.5 text-sm font-semibold text-gray-900">{{ r.studentName || 'Unknown student' }}</p>
            </div>

            <!-- Evidence the student submitted -->
            <div v-if="r.evidenceText" class="mt-3">
              <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Evidence submitted</p>
              <p class="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">{{ r.evidenceText }}</p>
            </div>

            <!-- Optional feedback the student left about their experience -->
            <div v-if="r.feedbackText" class="mt-2">
              <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Student feedback</p>
              <p class="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm italic text-gray-500">"{{ r.feedbackText }}"</p>
            </div>

            <!-- Optional rejection reason the organisation can fill in before rejecting -->
            <div class="mt-3">
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">Rejection reason (optional)</label>
              <input
                v-model="r.rejectionReason"
                type="text"
                placeholder="e.g. Please include the date and location of your activity"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div class="mt-4 flex gap-2">
              <!-- Approve marks the task as Approved and adds hours and points to the student -->
              <button class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60" :disabled="r.approving || r.rejecting" @click="approve(r)">
                {{ r.approving ? 'Approving...' : 'Approve' }}
              </button>
              <!-- Reject sends the task back to In Progress so the student can resubmit -->
              <button class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60" :disabled="r.approving || r.rejecting" @click="reject(r)">
                {{ r.rejecting ? 'Rejecting...' : 'Reject' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db } from "../firebase"
import {
  collection, doc, getDoc, getDocs, addDoc, deleteDoc,
  query, where, onSnapshot, runTransaction, increment, serverTimestamp
} from "firebase/firestore"

const router = useRouter(), loading = ref(true), error = ref(""), hubName = ref("")
const myTasks = ref([]), pendingSubmissions = ref([])
const addingTask = ref(false), addTaskError = ref(""), addTaskSuccess = ref(false)
const approvedCount = ref(0), totalHoursGiven = ref(0)


const newTask = ref({ title: "", description: "", hours: "", points: "", difficulty: "Easy" })


const difficultyClass = (d) => {
  const l = (d || "").toLowerCase()
  if (l === "easy")   return "border-green-200 bg-green-50 text-green-700"
  if (l === "medium") return "border-yellow-200 bg-yellow-50 text-yellow-700"
  if (l === "hard")   return "border-red-200 bg-red-50 text-red-600"
  return "border-gray-200 bg-gray-100 text-gray-600"
}


const difficultyActiveClass = (level) => {
  if (level === "Easy")   return "border-green-400 bg-green-100 text-green-800"
  if (level === "Medium") return "border-yellow-400 bg-yellow-100 text-yellow-800"
  return "border-red-400 bg-red-100 text-red-700"
}

// Save Firestore listeners so they can be stopped when the page closes
let unsubscribeTasks = null, unsubscribePending = null

const setupListeners = (hub) => {
  // Real time listener for tasks belonging to this hub
  unsubscribeTasks = onSnapshot(
    query(collection(db, "tasks"), where("hub", "==", hub)),
    (snap) => { myTasks.value = snap.docs.map(d => ({ id: d.id, ...d.data() })) }
  )

  // Real time listener for submissions awaiting approval filtered to this hub's tasks
  unsubscribePending = onSnapshot(
    query(collection(db, "assignments"), where("status", "==", "Awaiting Approval")),
    async (snap) => {
      const taskIds    = myTasks.value.map(t => t.id)
      const hubPending = snap.docs.map(d => ({ assignmentId: d.id, ...d.data() })).filter(a => taskIds.includes(a.taskId))

      // Load each student's name from their Firestore document
      const userMap = new Map()
      await Promise.all(hubPending.map(async (a) => {
        if (!userMap.has(a.userId)) {
          try {
            const s = await getDoc(doc(db, "users", a.userId))
            const u = s.data() || {}
            userMap.set(a.userId, [u.firstName, u.lastName].filter(Boolean).join(" ") || null)
          } catch (_) { userMap.set(a.userId, null) }
        }
      }))

      pendingSubmissions.value = hubPending.map(a => {
        const task = myTasks.value.find(t => t.id === a.taskId) || {}
        return { ...a, title: task.title || "Untitled", hours: task.hours ?? 0, points: task.points ?? 0, studentName: userMap.get(a.userId) || null, approving: false, rejecting: false, rejectionReason: "" }
      })
    }
  )

  loadStats(hub)
}

// Get the number of approved count and total hours for the stats cards
const loadStats = async (hub) => {
  try {
    const taskSnap     = await getDocs(query(collection(db, "tasks"), where("hub", "==", hub)))
    const taskIds      = taskSnap.docs.map(d => d.id)
    const approvedSnap = await getDocs(query(collection(db, "assignments"), where("status", "==", "Approved")))
    const hubApproved  = approvedSnap.docs.map(d => d.data()).filter(a => taskIds.includes(a.taskId))
    approvedCount.value   = hubApproved.length
    totalHoursGiven.value = hubApproved.reduce((sum, a) => {
      const task = myTasks.value.find(t => t.id === a.taskId)
      return sum + (task?.hours ? Number(task.hours) : 0)
    }, 0)
  } catch (_) {}
}

// Check authentication and load the organisation's hub name when the page loads
onMounted(() => {
  onAuthStateChanged(getAuth(), async (user) => {
    if (!user) { router.push("/login"); loading.value = false; return }
    try {
      const snap = await getDoc(doc(db, "users", user.uid))
      const data  = snap.data() || {}
      // Redirect non organisation accounts away from this page
      if (data.role !== "organisation") { router.push("/dashboard"); return }
      hubName.value = data.hub || "Your Hub"
      setupListeners(hubName.value)
    } catch (e) { error.value = e.message }
    finally { loading.value = false }
  })
})

/
onUnmounted(() => { unsubscribeTasks?.(); unsubscribePending?.() })

// Add a new task to Firestore for this hub
const addTask = async () => {
  addTaskError.value = ""; addTaskSuccess.value = false
  if (!newTask.value.title.trim()) { addTaskError.value = "Please enter an activity title."; return }
  if (!newTask.value.hours || newTask.value.hours < 1) { addTaskError.value = "Please enter valid hours."; return }
  if (!newTask.value.points || newTask.value.points < 1) { addTaskError.value = "Please enter valid points."; return }
  addingTask.value = true
  try {
    await addDoc(collection(db, "tasks"), {
      title:       newTask.value.title.trim(),
      description: newTask.value.description.trim() || "",
      hours:       Number(newTask.value.hours),
      points:      Number(newTask.value.points),
      difficulty:  newTask.value.difficulty,
      hub:         hubName.value, 
      createdAt:   serverTimestamp()
    })
    newTask.value = { title: "", description: "", hours: "", points: "", difficulty: "Easy" }
    addTaskSuccess.value = true
    setTimeout(() => { addTaskSuccess.value = false }, 4000)
  } catch (e) { addTaskError.value = e.message || "Failed to add activity." }
  finally { addingTask.value = false }
}

// Delete a task from Firestore
const deleteTask = async (taskId) => {
  if (!confirm("Delete this activity?")) return
  try { await deleteDoc(doc(db, "tasks", taskId)) }
  catch (e) { error.value = e.message }
}

// Approve a submission this  uses a transaction to update the assignment and student points together
const approve = async (r) => {
  if (!confirm("Approve this submission?")) return
  error.value = ""; r.approving = true
  try {
    // Transaction ensures the approval and points update happen at the same time
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(doc(db, "assignments", r.assignmentId))
      if (!snap.exists()) throw new Error("Assignment no longer exists.")
      const data = snap.data()
      if (data.status !== "Awaiting Approval") throw new Error("Already processed.")
      tx.update(doc(db, "assignments", r.assignmentId), { status: "Approved" })
      tx.update(doc(db, "users", data.userId), {
        totalHoursApproved: increment(Number(r.hours ?? 0)),
        points:             increment(Number(r.points ?? 0))
      })
    })
    pendingSubmissions.value = pendingSubmissions.value.filter(x => x.assignmentId !== r.assignmentId)
    approvedCount.value++
    totalHoursGiven.value += Number(r.hours ?? 0)
  } catch (e) { error.value = e.message || "Unable to approve."; r.approving = false }
}

// Reject a submission this resets status to In Progress so the student can resubmit
const reject = async (r) => {
  error.value = ""; r.rejecting = true
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(doc(db, "assignments", r.assignmentId))
      if (!snap.exists()) throw new Error("Assignment no longer exists.")
      if (snap.data().status !== "Awaiting Approval") throw new Error("Already processed.")
      tx.update(doc(db, "assignments", r.assignmentId), {
        status:          "In Progress",
        evidenceText:    null, 
        feedbackText:    null,
        rejectionReason: r.rejectionReason || null, 
        rejectedAt:      serverTimestamp()
      })
    })
    pendingSubmissions.value = pendingSubmissions.value.filter(x => x.assignmentId !== r.assignmentId)
  } catch (e) { error.value = e.message || "Unable to reject."; r.rejecting = false }
}
</script>