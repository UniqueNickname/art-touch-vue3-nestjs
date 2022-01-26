import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory,
} from 'vue-router'
import routes from '~pages'
import { isSSR } from 'src/utils/isSSR'

export function createRouter() {
  return _createRouter({
    history: isSSR() ? createMemoryHistory() : createWebHistory(),
    routes,
  })
}
