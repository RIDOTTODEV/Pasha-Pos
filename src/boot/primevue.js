import {boot} from 'quasar/wrappers'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'
export default boot(async ({app}) => {
  app.use(PrimeVue,{
    theme: {
      preset: Aura,
      options: {
        prefix: 'prime',
        darkModeSelector: 'system',
        cssLayer: true
      }
    }
  })
})
