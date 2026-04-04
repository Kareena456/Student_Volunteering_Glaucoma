<!-- Public landing page visible to everyone without logging in -->
<template>
  <div>
    <!-- Scrolling ticker banner fixed just below the navbar -->
    <div class="fixed left-0 right-0 top-[52px] z-30 overflow-hidden border-b border-teal-200 bg-teal-600 py-1.5">
      <div class="ticker-track whitespace-nowrap">
        <span class="inline-flex items-center gap-0 text-xs font-semibold text-white">
          <span class="px-6">Welcome to Glaucoma Care — currently accepting new student volunteers across selected partner hubs in London!</span>
          <span class="inline-block h-4 w-1.5 rounded-sm bg-teal-300"></span>
          <span class="px-6">Score 75% on the quiz to unlock volunteering tasks at our hubs</span>
          <span class="inline-block h-4 w-1.5 rounded-sm bg-teal-300"></span>
          <span class="px-6">New tasks available at Moorfields Eye Hospital, Sunrise Care Home and Hackney Community Vision Centre</span>
          <span class="inline-block h-4 w-1.5 rounded-sm bg-teal-300"></span>
          <!-- Duplicated for seamless loop -->
          <span class="px-6">Welcome to Glaucoma Care — currently accepting new student volunteers across selected partner hubs in London!</span>
          <span class="inline-block h-4 w-1.5 rounded-sm bg-teal-300"></span>
          <span class="px-6">Score 75% on the quiz to unlock volunteering tasks at our hubs</span>
          <span class="inline-block h-4 w-1.5 rounded-sm bg-teal-300"></span>
          <span class="px-6">New tasks available at Moorfields Eye Hospital, Sunrise Care Home and Hackney Community Vision Centre</span>
          <span class="inline-block h-4 w-1.5 rounded-sm bg-teal-300"></span>
        </span>
      </div>
    </div>

    <!-- Page content pt-28 accounts for navbar + ticker height -->
    <div class="mx-auto max-w-5xl px-4 pb-6 pt-28">

      <!-- Main banner at the top of the page, it shows the platform title and login register buttons -->
      <section class="mb-6 rounded-2xl bg-blue-600 px-6 py-10 text-white shadow-lg">
        <h1 class="text-3xl font-bold md:text-4xl">Student Volunteering &amp; Glaucoma Awareness</h1>
        <p class="mt-3 max-w-2xl text-blue-100">
          Welcome to Glaucoma Care — a student volunteering platform connecting students with meaningful opportunities to support glaucoma patients across London.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <router-link to="/register" class="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">Get started</router-link>
          <router-link to="/login" class="rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">Login</router-link>
        </div>
      </section>

      <div class="space-y-5">

        <!-- How it works each step card is clickable and navigates to the relevant page -->
        <section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900">How this platform works</h2>
          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">

            <!-- Step 1 links to register page -->
            <router-link to="/register" class="rounded-xl border border-blue-100 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-blue-100">
              <p class="text-2xl">📝</p>
              <p class="mt-2 font-semibold text-blue-900">1. Register</p>
              <p class="mt-1 text-sm text-blue-700">Create your student account and log in.</p>
            </router-link>

            <!-- Step 2 links to quiz page -->
            <router-link to="/quiz" class="rounded-xl border border-blue-100 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-blue-100">
              <p class="text-2xl">🧠</p>
              <p class="mt-2 font-semibold text-blue-900">2. Take the quiz</p>
              <p class="mt-1 text-sm text-blue-700">Score 75% or above to unlock volunteering tasks and ensure you understand how to support glaucoma patients safely. You can retake as many times as needed.</p>
            </router-link>

            <!-- Step 3 links to hubs page -->
            <router-link to="/hubs" class="rounded-xl border border-blue-100 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-blue-100">
              <p class="text-2xl">🏥</p>
              <p class="mt-2 font-semibold text-blue-900">3. Choose a hub</p>
              <p class="mt-1 text-sm text-blue-700">Browse hubs and enrol in available tasks.</p>
            </router-link>

            <!-- Step 4 links to dashboard -->
            <router-link to="/dashboard" class="rounded-xl border border-blue-100 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-blue-100">
              <p class="text-2xl">📋</p>
              <p class="mt-2 font-semibold text-blue-900">4. Submit evidence</p>
              <p class="mt-1 text-sm text-blue-700">Complete your task and submit evidence for approval.</p>
            </router-link>

            <!-- Step 5 links to dashboard -->
            <router-link to="/dashboard" class="rounded-xl border border-blue-100 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-blue-100">
              <p class="text-2xl">⭐</p>
              <p class="mt-2 font-semibold text-blue-900">5. Earn points</p>
              <p class="mt-1 text-sm text-blue-700">Track your hours and points on your dashboard.</p>
            </router-link>

            <!-- Step 6 links to dashboard -->
            <router-link to="/dashboard" class="rounded-xl border border-blue-100 bg-blue-50 p-4 transition hover:border-blue-300 hover:bg-blue-100">
              <p class="text-2xl">🎓</p>
              <p class="mt-2 font-semibold text-blue-900">6. Get certified</p>
              <p class="mt-1 text-sm text-blue-700">Download your certificate once all tasks are approved.</p>
            </router-link>

          </div>

          <div class="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <span class="font-semibold">Quiz pass mark: 75%</span> — watch the training videos below and read the resources to prepare. You can retake as many times as you need!
          </div>
          <p class="mt-3 text-xs text-gray-400">We can only accept applications from those over 18 years old.</p>
          <p class="mt-1 text-xs text-gray-400">Organisation accounts are manually verified by the platform administrator to ensure legitimacy and safeguarding.</p>
        </section>

        <!-- What is glaucoma -->
        <section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900">What is glaucoma?</h2>
          <p class="mt-3 text-gray-600">
            Glaucoma is a group of eye conditions that damage the optic nerve, often linked to increased pressure in the eye.
            Vision loss from glaucoma is permanent, but early detection can slow or prevent further damage.
          </p>
          <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">Glaucoma can develop <strong>without early symptoms</strong>.</div>
            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"><strong>Regular eye tests</strong> are the best way to detect it early.</div>
            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">Higher risk groups include <strong>older adults</strong> and those with a family history.</div>
          </div>
          <img src="https://doctorkerr.com.au/wp-content/uploads/2021/06/diagram-normal-glaucoma-eye.png" alt="Normal eye vs glaucoma diagram" class="mt-5 w-full rounded-xl border border-blue-100 bg-white object-contain md:h-56" />
        </section>

        <!-- Why volunteer -->
        <section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900">Why student volunteering matters</h2>
          <p class="mt-2 text-gray-600">Student volunteering strengthens communities, improves mental health, and bridges education with careers.</p>
          <img src="https://imageio.forbes.com/specials-images/imageserve/65ad49201b8a4682439df59f/Happy-group-of-volunteer-people-showing-importance-of-volunteering-/0x0.jpg?width=960" alt="Volunteers working together" class="mt-4 w-full rounded-xl border border-blue-100 object-cover md:h-56" />
          <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"><strong>Enhances employability:</strong> 40% of hiring managers consider volunteer work on par with paid employment.</div>
            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"><strong>Improves wellbeing:</strong> Volunteering provides a sense of purpose and can reduce stress.</div>
            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"><strong>Networking:</strong> Meet professionals, community leaders, and like-minded peers.</div>
            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"><strong>Community impact:</strong> Contribute directly to glaucoma patients who need support.</div>
          </div>
        </section>

        <!-- Resources -->
        <section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900">Resources and further reading</h2>
          <div class="mt-3 flex flex-col gap-2 text-sm">
            <a class="text-blue-600 hover:text-blue-800 hover:underline" href="https://www.nhs.uk/conditions/glaucoma/" target="_blank" rel="noreferrer">NHS: Glaucoma</a>
            <a class="text-blue-600 hover:text-blue-800 hover:underline" href="https://www.rnib.org.uk/your-eyes/eye-conditions-az/glaucoma/" target="_blank" rel="noreferrer">RNIB: Glaucoma</a>
            <a class="text-blue-600 hover:text-blue-800 hover:underline" href="https://www.voluntarynorfolk.org.uk/unlocking-potential-students-volunteering/" target="_blank" rel="noreferrer">Voluntary Norfolk: Unlocking the potential of students through volunteering</a>
            <a class="text-blue-600 hover:text-blue-800 hover:underline" href="https://lifecharity.org.uk/news-and-views/why-volunteering-is-a-must-do-for-students/" target="_blank" rel="noreferrer">Life Charity: Why volunteering is a must-do for students</a>
            <a class="text-blue-600 hover:text-blue-800 hover:underline" href="https://d1wqtxts1xzle7.cloudfront.net/89670033/10.11648.j.ijovs.20180302.13-libre.pdf?1660544824=&response-content-disposition=inline%3B+filename%3DApproaches_To_Assessing_Students_Learnin.pdf&Expires=1769708722&Signature=ZDvMsYG~ftA6GxVoMa-Vi~18X5tRaCOhktAmFUOoc3yB5sCO~gPmRfhCpLeZBKr3dW~UtxQCmCNjG2QeuSj2TPNZ7bVdkNOtaMcu~5n6oFdcwE3XlJe~AjbT1YqE8dGhqsfUGVxPq47lEjimVLt-qLH7bg93za27rgSynsHyYAD~U4pEgERDd6ZA9XN31AiT61I28u-1RAI893u1GH6szplxpEvrw6H7lUD5IAwsGY~ADvVuiAVO5XFf7zdoah4GenKZ9bHEY0-cFIXaAySWGHxdGJFkO7NToIzLbcXmrO8rJ9EoN28j~HmvIDhkrgMT4lP4JZPWx0089Iw8ObhNlA__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA" target="_blank" rel="noreferrer">Supporting PDF: Approaches to Assessing Students' Learning</a>
          </div>
        </section>

        <!-- Training videos this is for students and they should watch before taking the quiz -->
        <section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900">Training videos</h2>
          <p class="mt-2 text-sm text-gray-500">Watch these before taking the quiz to build your knowledge.</p>
          <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="aspect-video overflow-hidden rounded-xl border border-blue-100 bg-gray-100">
              <iframe class="h-full w-full" src="https://www.youtube.com/embed/cVFzDrmAY78" title="Training video 1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="aspect-video overflow-hidden rounded-xl border border-blue-100 bg-gray-100">
              <iframe class="h-full w-full" src="https://www.youtube.com/embed/8X1NqEIOy08" title="Training video 2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="aspect-video overflow-hidden rounded-xl border border-blue-100 bg-gray-100">
              <iframe class="h-full w-full" src="https://www.youtube.com/embed/STz5Xa3ghsU" title="Training video 3" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="aspect-video overflow-hidden rounded-xl border border-blue-100 bg-gray-100">
              <iframe class="h-full w-full" src="https://www.youtube.com/embed/hz7MKn3Gwig" title="Training video 4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </section>

        <!-- Bottom login/register buttons -->
        <section class="flex flex-wrap gap-3 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <router-link to="/login" class="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">Login</router-link>
          <router-link to="/register" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Register</router-link>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
/* Ticker animation this moves the text continuously from right to left across the screen
   The content is duplicated in the HTML so when the first copy finishes scrolling
   the second copy seamlessly takes over with no gap or jump */
.ticker-track {
  display: inline-block;
  animation: ticker 35s linear infinite;
}

@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
