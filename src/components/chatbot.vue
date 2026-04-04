<!-- Floating AI chatbot powered by OpenAI it helps students with glaucoma questions and platform guidance -->
<!-- Add <GlaucomaChat/> in App.vue to show it on every page -->
<template>
  <!-- Floating button in the bottom right corner toggles the chat panel open and closed -->
  <button
    class="fixed bottom-5 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full border border-indigo-500/60 bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 focus:outline-none"
    style="height:52px;width:52px;"
    :aria-label="open ? 'Close chat' : 'Open glaucoma assistant'"
    @click="open = !open"
  >
    <!-- Chat icon shown when closed, X icon shown when open -->
    <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Chat panel slides in when open is true -->
  <Transition name="chat">
    <div
      v-if="open"
      class="fixed bottom-20 right-5 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/60 sm:w-96"
      style="max-height: 520px;"
    >
      <!-- Chat header -->
      <div class="flex items-center gap-2.5 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/15 text-base">
          👁️
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-100">Glaucoma Assistant</p>
          <p class="text-xs text-slate-500">Ask about glaucoma or volunteering</p>
        </div>
      </div>

      <!--Message history, scrolls automatically when new messages arrive-->
      <div
        ref="messagesEl"
        class="flex-1 space-y-3 overflow-y-auto px-4 py-3"
        style="min-height:0;"
      >
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- User messages appear on the right in blue, assistant messages on the left in dark grey -->
          <div
            class="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
            :class="
              msg.role === 'user'
                ? 'rounded-br-sm bg-indigo-600 text-white'
                : 'rounded-bl-sm border border-slate-700 bg-slate-800 text-slate-200'
            "
          >
            {{ msg.content }}
          </div>
        </div>

        <!-- Bouncing dots shown while waiting for OpenAI to respond -->
        <div v-if="thinking" class="flex justify-start">
          <div class="rounded-2xl rounded-bl-sm border border-slate-700 bg-slate-800 px-3 py-2">
            <span class="flex gap-1">
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style="animation-delay:0ms"></span>
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style="animation-delay:150ms"></span>
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style="animation-delay:300ms"></span>
            </span>
          </div>
        </div>
      </div>

      <!-- Suggested questions,  only shown before the student has sent their first message -->
      <div v-if="messages.length === 1" class="border-t border-slate-800 px-4 py-2">
        <p class="mb-1.5 text-xs text-slate-500">Suggested questions</p>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="prompt in suggestions"
            :key="prompt"
            class="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 transition hover:border-indigo-500/60 hover:bg-slate-700"
            @click="sendSuggestion(prompt)"
          >
            {{ prompt }}
          </button>
        </div>
      </div>

      <!-- Error message shown if the OpenAI API call fails -->
      <div v-if="apiError" class="border-t border-slate-800 px-4 py-2 text-xs text-rose-300">
        {{ apiError }}
      </div>

      <!-- Message input — pressing Enter sends the message -->
      <div class="border-t border-slate-800 bg-slate-900 px-3 py-2.5">
        <div class="flex items-end gap-2">
          <textarea
            v-model="input"
            rows="1"
            placeholder="Ask a question…"
            class="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            style="max-height:96px;"
            @keydown.enter.prevent="send"
          ></textarea>
          <button
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-50"
            :disabled="thinking || !input.trim()"
            @click="send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        <p class="mt-1.5 text-center text-xs text-slate-600">
          Powered by OpenAI · Not a substitute for medical advice
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick, watch } from "vue"

// API key and system prompt

// API key is stored in the .env file as VITE_OPENAI_API_KEY — never hardcoded directly
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ""

// System prompt tells OpenAI what role the assistant should play
// This keeps all responses focused on glaucoma and volunteering
const SYSTEM_PROMPT = `You are a friendly and knowledgeable assistant for a student volunteering platform focused on glaucoma awareness. Your role is to:
1. Answer questions about glaucoma (symptoms, causes, treatment, prevention, detection).
2. Help students understand their volunteering tasks and what to expect at each hub (Moorfields Eye Hospital, Sunrise Care Home, Hackney Community Vision Centre).
3. Guide students through the platform: how to complete the quiz, enrol in tasks, submit evidence, and earn their certificate.
4. Offer encouragement and support throughout the volunteering journey.

Keep responses concise (2–4 sentences max), warm, and accessible. Do not provide personal medical diagnoses. Always recommend consulting a qualified eye care professional for personal health concerns.`

// Reactive state 
const open       = ref(false)   // controls whether the chat panel is visible
const input      = ref("")      // the student's current typed message
const thinking   = ref(false)   // true while waiting for OpenAI to respond
const apiError   = ref("")      // stores any error message from the API
const messagesEl = ref(null)    // reference to the messages container for auto-scrolling

// Suggested questions shown before the student sends their first message
const suggestions = [
  "What is glaucoma?",
  "How is glaucoma treated?",
  "What tasks can I do at Moorfields?",
  "How do I earn my certificate?",
  "What does the quiz unlock?"
]

// The chat messages displayed in the UI — starts with the assistant's greeting
const messages = ref([
  {
    role: "assistant",
    content: "Hi! I'm your Glaucoma Assistant 👁️ I can help with questions about glaucoma, your volunteering tasks, or how the platform works. What would you like to know?"
  }
])

// Separate history array sent to OpenAI — keeps track of the full conversation for context
const history = ref([])

// Auto scroll 

// Scrolls the message container to the bottom whenever new messages arrive
const scrollToBottom = async () => {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

// Watch for new messages and scroll down automatically
watch(messages, scrollToBottom, { deep: true })

// Also scroll when the chat panel is opened
watch(open, (val) => { if (val) scrollToBottom() })

// Send message 

const send = async () => {
  const text = input.value.trim()
  if (!text || thinking.value) return

  apiError.value = ""
  input.value    = ""

  // Add the student's message to the chat display
  messages.value.push({ role: "user", content: text })

  // Add to the history sent to OpenAI so it remembers the conversation
  history.value.push({ role: "user", content: text })

  thinking.value = true

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file.")
    }

    // Send the conversation history to OpenAI and get a response
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",   // cost-effective model that's fast and accurate
        max_tokens: 300,         // keeps responses short and readable
        temperature: 0.7,        // slightly creative but still accurate
        messages: [
          { role: "system", content: SYSTEM_PROMPT },  // sets the assistant's behaviour
          ...history.value                              // full conversation history for context
        ]
      })
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `API error ${response.status}`)
    }

    const data  = await response.json()
    const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response."

    // Add the assistant's reply to the chat display and history
    messages.value.push({ role: "assistant", content: reply })
    history.value.push({ role: "assistant", content: reply })

    // Keep history to last 20 messages to avoid sending too many tokens to OpenAI
    if (history.value.length > 20) {
      history.value = history.value.slice(history.value.length - 20)
    }
  } catch (e) {
    apiError.value = e.message || "Something went wrong. Please try again."
    messages.value.push({
      role: "assistant",
      content: "Sorry, I ran into an issue. Please check your API key configuration or try again in a moment."
    })
  } finally {
    thinking.value = false
  }
}

// Fills the input with a suggested question and sends it immediately
const sendSuggestion = (prompt) => {
  input.value = prompt
  send()
}
</script>

<style scoped>
/* Smooth slide up and fade animation when the chat panel opens and closes */
.chat-enter-active,
.chat-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
</style>