import { isSSR } from 'src/constants'
import { ref, onMounted, onUnmounted } from 'vue'

export const useScreenSize = () => {
  const screenWidth = ref(320)

  const updateClientWidth = () => {
    screenWidth.value = isSSR ? 320 : document.documentElement.clientWidth
  }

  onMounted(() => {
    window.addEventListener('resize', updateClientWidth)
    window.addEventListener('orientationchange', updateClientWidth)
    updateClientWidth()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateClientWidth)
    window.removeEventListener('orientationchange', updateClientWidth)
  })

  return {
    screenWidth,
  }
}
