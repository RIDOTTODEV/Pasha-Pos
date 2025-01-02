import { boot } from 'quasar/wrappers'
import AppTable from "components/common/AppTable.vue";
import DateTimePicker from "components/common/DateTimePicker.vue";
import QCurrencyInput from "components/common/QCurrencyInput.vue";
import SimpleKeyboard from "components/common/SimpleKeyboard.vue";
import SimpleKeyBoardNew from "components/common/SimpleKeyBoardNew.vue";
export default boot(async ({app}) => {
  app.component('AppTable', AppTable)
  app.component('DateTimePicker', DateTimePicker)
  app.component('QCurrencyInput', QCurrencyInput)
  app.component('SimpleKeyboard', SimpleKeyboard)
  app.component('SimpleKeyboardNew', SimpleKeyBoardNew)
})
