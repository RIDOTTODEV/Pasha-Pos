import { boot } from 'quasar/wrappers'
//  import { Keyboard ,OnScreenKeyboard} from 'vue3-touch-keyboard';
// import '../../node_modules/vue3-touch-keyboard/dist/style.css';
import AppTable from "components/common/AppTable.vue";
import DateTimePicker from "components/common/DateTimePicker.vue";
import QCurrencyInput from "components/common/QCurrencyInput.vue";
import KioskBoardInput from "components/common/KioskBoardInput.vue";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({app}) => {
  app.component('AppTable', AppTable)
  app.component('DateTimePicker', DateTimePicker)
  app.component('QCurrencyInput', QCurrencyInput)
  app.component('KioskBoardInput', KioskBoardInput)
  // app.component('Keyboard',Keyboard)
  // app.component('OnScreenKeyboard',OnScreenKeyboard)
})
