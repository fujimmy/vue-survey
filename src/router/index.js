// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import SurveyList from '../Views/SurveyList.vue'
import SurveyFill from '../Views/SurveyFill.vue'
import SurveyCreate from '../Views/SurveyForm.vue'

const routes = [
  { path: '/', name: 'SurveyList', component: SurveyList },
  { path: '/survey/:id', name: 'SurveyFill', component: SurveyFill },
  { path: '/create', name: 'SurveyCreate ', component: SurveyCreate  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
