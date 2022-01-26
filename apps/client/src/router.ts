import { createRouter as _createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

export function createRouter() {
  return _createRouter({
    history: createWebHistory(),
    routes,
  })
}
