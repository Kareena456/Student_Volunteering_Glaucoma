<!-- Quiz page 16 question glaucoma awareness quiz, 75% pass mark -->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6 pt-20">

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Glaucoma Awareness Quiz</h1>
      <p class="mt-1 text-sm text-gray-500">
        Score <span class="font-semibold text-blue-600">75% or above</span> to unlock all volunteering tasks.
        You can retake as many times as you need.
      </p>
    </div>

    <!-- Progress -->
    <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div class="mb-2 flex items-center justify-between text-xs text-gray-400">
        <span>{{ answeredCount }} of {{ questions.length }} answered</span>
        <span>{{ Math.round((answeredCount / questions.length) * 100) }}% complete</span>
      </div>
      <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div class="h-full rounded-full bg-blue-500 transition-all duration-300" :style="{ width: (answeredCount / questions.length) * 100 + '%' }"></div>
      </div>
    </div>

    <!-- Questions -->
    <div class="space-y-3">
      <div
        v-for="(q, i) in questions" :key="i"
        class="rounded-2xl border bg-white p-5 shadow-sm transition"
        :class="showErrors && answers[i] === null ? 'border-red-300' : 'border-gray-200'"
      >
        <p class="font-semibold text-gray-900">
          <span class="mr-2 text-sm text-gray-400">Q{{ i + 1 }}.</span>{{ q.text }}
        </p>
        <div class="mt-3 space-y-2">
          <label
            v-for="(opt, j) in q.options" :key="j"
            class="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition"
            :class="answers[i] === j ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-blue-200 hover:bg-blue-50/50'"
          >
            <input type="radio" :name="'q' + i" :value="j" v-model.number="answers[i]" class="h-4 w-4 accent-blue-600 shrink-0" />
            {{ opt }}
          </label>
        </div>
        <p v-if="showErrors && answers[i] === null" class="mt-2 text-xs text-red-500">Please select an answer.</p>
      </div>
    </div>

    <div class="mt-6">
      <button class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700" @click="submit">
        Submit quiz
      </button>
    </div>

    <!-- Passed -->
    <div v-if="resultReady && passed" class="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
      <p class="text-xl font-bold text-green-700">You passed! — {{ score }}%</p>
      <p class="mt-1 text-sm text-green-600">{{ correctCount }} out of {{ questions.length }} correct. All volunteering tasks are now unlocked!</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700" @click="$router.push('/hubs')">Go to hubs</button>
        <button class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50" @click="$router.push('/dashboard')">Back to dashboard</button>
      </div>
    </div>

    <!-- Failed -->
    <div v-if="resultReady && !passed" class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
      <p class="text-xl font-bold text-red-600">{{ score }}% — not quite!</p>
      <p class="mt-1 text-sm text-red-500">You got {{ correctCount }} out of {{ questions.length }} correct. You need <span class="font-semibold">75% ({{ passingScore }} correct)</span> to unlock all tasks.</p>
      <p class="mt-1 text-sm text-red-400">Review the training videos on the home page and try again!</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700" @click="retake">Retake quiz</button>
        <button class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50" @click="$router.push('/dashboard')">Back to dashboard</button>
      </div>
    </div>

    <div v-if="serverError" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{{ serverError }}</div>
  </div>
</template>

<script>
import { ref, computed } from "vue"
import { getAuth } from "firebase/auth"
import { db } from "../firebase"
import { doc, updateDoc } from "firebase/firestore"

export default {
  setup() {
    const PASS_MARK = 75
    const questions = ref([
      { text: "Glaucoma mainly affects which part of the eye?", options: ["Cornea", "Optic nerve", "Lens", "Retina"], correct: 1 },
      { text: "Glaucoma can develop without any early symptoms.", options: ["True", "False"], correct: 0 },
      { text: "What is the most important factor in the early detection of glaucoma?", options: ["Regular eye tests", "Drinking more water", "Avoiding screens", "Wearing sunglasses only"], correct: 0 },
      { text: "Which group has a higher risk of developing glaucoma?", options: ["People with a family history of glaucoma", "Teenagers", "People with perfect vision", "People who wear hats"], correct: 0 },
      { text: "Which symptom is most commonly linked to glaucoma?", options: ["Gradual loss of peripheral (side) vision", "Sudden fever", "Back pain", "Ear infection"], correct: 0 },
      { text: "How often should adults get eye tests for early glaucoma detection?", options: ["Regularly, as advised by an optometrist", "Only when vision feels blurry", "Once in childhood only", "Never"], correct: 0 },
      { text: "Glaucoma-related vision loss is typically:", options: ["Irreversible but can be slowed with treatment", "Always temporary", "Easily corrected with glasses", "Only present at night"], correct: 0 },
      { text: "Which of the following is a common method used to manage glaucoma?", options: ["Prescription eye drops to reduce eye pressure", "Aspirin for headaches", "Antibiotics only", "No treatment exists"], correct: 0 },
      { text: "What is the most common cause of glaucoma?", options: ["Increased pressure inside the eye", "Too much screen time", "Lack of sleep", "High blood sugar only"], correct: 0 },
      { text: "Which type of glaucoma is the most common worldwide?", options: ["Primary open-angle glaucoma", "Acute angle-closure glaucoma", "Secondary glaucoma", "Congenital glaucoma"], correct: 0 },
      { text: "Glaucoma can eventually lead to blindness if left untreated.", options: ["True", "False"], correct: 0 },
      { text: "Which of the following is NOT a known risk factor for glaucoma?", options: ["Eating spicy food", "Being over the age of 60", "Having elevated eye pressure", "Being of African or Caribbean descent"], correct: 0 },
      { text: "As a volunteer supporting glaucoma patients, which of the following is most important?", options: ["Being patient, empathetic and respectful of the patient's visual limitations", "Talking as fast as possible to save time", "Avoiding eye contact at all times", "Telling patients not to worry about their condition"], correct: 0 },
      { text: "Eye pressure is measured during a glaucoma check using a test called:", options: ["Tonometry", "Spirometry", "Audiometry", "Dermoscopy"], correct: 0 },
      { text: "Which of the following best describes how glaucoma affects daily life?", options: ["It can make it difficult to navigate environments, read, and recognise faces", "It only affects colour vision", "It causes complete blindness overnight", "It has no impact on daily activities"], correct: 0 },
      { text: "When volunteering with visually impaired glaucoma patients, you should:", options: ["Always ask before offering help and follow the patient's lead", "Grab their arm immediately to guide them", "Speak loudly as they may have hearing difficulties too", "Avoid speaking directly to them"], correct: 0 }
    ])
// These variables track everything needed to run the quiz and display results
// answers stores what the student selected for each question  null means not answered yet
// showErrors triggers validation messages if they try to submit without answering everything
// score and correctCount are calculated when the student submits
// passed, answeredCount and passingScore are computed automatically from the other values
const answers = ref(Array(questions.value.length).fill(null))
    const answers = ref(Array(questions.value.length).fill(null))
    const showErrors = ref(false), resultReady = ref(false), serverError = ref(""), score = ref(0), correctCount = ref(0)
    const passed = computed(() => score.value >= PASS_MARK)
    const answeredCount = computed(() => answers.value.filter(a => a !== null).length)
    const passingScore = computed(() => Math.ceil((PASS_MARK / 100) * questions.value.length))

    const submit = async () => {
      showErrors.value = true; serverError.value = ""
      if (answers.value.includes(null)) return
      let correct = 0
      answers.value.forEach((a, i) => { if (a === questions.value[i].correct) correct++ })
      correctCount.value = correct; score.value = Math.round((correct / questions.value.length) * 100)
      try {
        const user = getAuth().currentUser
        if (!user) throw new Error("Not logged in")
        await updateDoc(doc(db, "users", user.uid), { quizScore: score.value })
        resultReady.value = true
      } catch (err) { serverError.value = err.message }
    }

    const retake = () => {
      answers.value = Array(questions.value.length).fill(null)
      showErrors.value = false; resultReady.value = false; serverError.value = ""; score.value = 0; correctCount.value = 0
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return { questions, answers, showErrors, resultReady, score, correctCount, passed, answeredCount, passingScore, submit, retake, serverError }
  }
}
</script>
