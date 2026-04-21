import "./firebase" // connect to firebase 
import "./style.css"
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

createApp(App)
  .use(router)
  .mount("#app")
// This is the main entry point for the vue application 