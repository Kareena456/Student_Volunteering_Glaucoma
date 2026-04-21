/*
  router/index.js defines all the URL routes 
  Each route maps a URL path to a Vue component and 
  Vue Router handles navigation between pages without reloading the browser and a 
  A route guard is added to prevent unauthenticated users from accessing
  protected pages directly by typing the URL
*/

import { createRouter, createWebHistory } from "vue-router"
import { getAuth } from "firebase/auth"
import Home         from "../views/Home.vue"
import Login        from "../views/Login.vue"
import Register     from "../views/Register.vue"
import Dashboard    from "../views/Dashboard.vue"
import Hubs         from "../views/Hubs.vue"
import Quiz         from "../views/Quiz.vue"
import Organisation from "../views/Organisation.vue"

const routes = [
  { path: "/",             component: Home,         meta: { public: true }  }, // Public landing page
  { path: "/login",        component: Login,        meta: { public: true }  }, 
  { path: "/register",     component: Register,     meta: { public: true }  }, 
  { path: "/dashboard",    component: Dashboard    }, // Protected — students only
  { path: "/hubs",         component: Hubs         },
  { path: "/quiz",         component: Quiz         }, 
  { path: "/organisation", component: Organisation } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/*
  Route guard this runs before every page navigation and 
  If the user is not logged in and tries to access a protected page,
  they are redirected to the login page automatically.
  This prevents anyone from manually typing a URL to bypass the login.
*/
router.beforeEach((to, from, next) => {
  const user = getAuth().currentUser

  // Allow access to public pages without being logged in
  if (to.meta.public) return next()

  // Redirect to login if not authenticated
  if (!user) return next("/login")

  next()
})

export default router