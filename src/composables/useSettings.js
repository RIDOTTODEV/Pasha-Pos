import { ref} from "vue";
import {Loading, useQuasar} from "quasar";
import {useThemeStore} from "stores/theme-store";
import {useTerminalStore} from "stores/terminal-store";
import {storeToRefs} from "pinia";
const module = import('src/../package.json')

export function useSettings() {

  const AppVersion = ref('1.0.0')
  const $q = useQuasar()
  const terminalStore = useTerminalStore()
  const {terminal, tags, sections, getTerminalMenuNames} = storeToRefs(terminalStore)
  const themeStore = useThemeStore()
  const {settings} = storeToRefs(themeStore)
  const settingTab = ref('security')
  const settingTabs = ref(['security', 'waitingOrders', 'newOrder', 'environments', 'info'])
  const isPwd = ref(true)
  const updateSecuritySettings = () => {
    let body = {
      uid: terminal.value.uid,
      autoLogIn: terminal.value.autoLogIn,
      saveTerminalSettings: terminal.value.saveTerminalSettings,
    }
    Loading.show()
    terminalStore.updateTerminalSettings('UpdateSecuritySettings', body).then(() => {
    }).finally(() => {
      Loading.hide()
    })
  }
  const updateEnvironmentSettings = () => {
    let body = {
      uid: terminal.value.uid,
      playersLastOrderCount: terminal.value.playersLastOrderCount,
      ridottoApiUrl: terminal.value.ridottoApiUrl,
      assistApiUrl: terminal.value.assistApiUrl,
    }
    Loading.show()
    terminalStore.updateTerminalSettings('UpdateEnvironmentSettings', body).then(() => {
    }).finally(() => {
      Loading.hide()
    })
  }

  const updateWaitingOrderSettings = async () => {
    let body = {
      uid: terminal.value.uid,
      sortByState: terminal.value.sortByState,
      password: terminal.value.password,
      tags: [...terminal.value.tags],
      sections: [...terminal.value.sections],
      askPasswordRestoring: [...terminal.value.askPasswordRestoring],
      restore: [...terminal.value.restore],
    }
    Loading.show()
    await terminalStore.updateTerminalSettings('UpdateWaitingOrderSettings', body).then(() => {
    }).finally(() => {
      Loading.hide()
    })
  }
  const saveThemeLocalSettings = () => {
    themeStore.saveThemeSettings()

  }
  module.then((module) => {
    AppVersion.value = module.default.version
  })
  return {
    $q,
    settingTabs,
    settingTab,
    settings,
    terminal,
    tags,
    sections,
    isPwd,
    getTerminalMenuNames,
    updateWaitingOrderSettings,
    saveThemeLocalSettings,
    updateEnvironmentSettings,
    updateSecuritySettings,
    AppVersion
  }
}
