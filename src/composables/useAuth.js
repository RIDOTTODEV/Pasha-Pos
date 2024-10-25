import {useTerminalStore} from "stores/terminal-store";
import {onMounted, ref} from "vue";
import {LocalStorage} from "quasar";
import {storeToRefs} from "pinia";

export function useAuth() {
  const terminalStore = useTerminalStore()
  const {terminals} = storeToRefs(terminalStore)
  const latestTerminalUid = LocalStorage.getItem('latestTerminalUid') || 'kI3kIg'
  const formValues = ref({uid: latestTerminalUid})
  onMounted(async () => {
    if (terminals.value.length === 0) {
      await terminalStore.fetchTerminals()
    }
  })
  const showTerminals = ref(false)
  const signInByUUid = async () => {
    await terminalStore.fetchTerminalByUuId(formValues.value.uid)
  }

  return {
    terminals,
    formValues,
    signInByUUid,
    showTerminals
  }
}
