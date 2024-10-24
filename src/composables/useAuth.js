import {useTerminalStore} from "stores/terminal-store";
import {ref} from "vue";
import {LocalStorage} from "quasar";
import {createSignalRConnection} from "src/utils/signalrConnection";

export function useAuth() {
  const terminalStore = useTerminalStore()
  const latestTerminalUid = LocalStorage.getItem('latestTerminalUid') || ''
  const formValues = ref({uid: latestTerminalUid})

  const signInByUUid = async () => {
    await terminalStore.fetchTerminalByUuId(formValues.value.uid)
   // await createSignalRConnection()
  }

  return {
    formValues,
    signInByUUid,
  }
}
