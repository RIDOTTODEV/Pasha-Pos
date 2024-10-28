import {boot} from 'quasar/wrappers'
import {useThemeStore} from "stores/theme-store";
import {useTerminalStore} from "stores/terminal-store";
import {useOrderStore} from "stores/order-store";
import {Loading, LocalStorage, QSpinnerGears, Dialog, Cookies} from "quasar";
import {createSignalRConnection} from "src/utils/signalrConnection";
import {storeToRefs} from "pinia";
import {i18n} from "boot/i18n";
import {bus} from "boot/bus";
import GeneralUpdateDialog from "components/common/GeneralUpdateDialog.vue";

let signalr = null;

export async function initializeSignalr() {
  if (signalr === null) {
    signalr = await createSignalRConnection()
  } else {
    try {
      signalr.stop()
      signalr = await createSignalRConnection()
    } catch (error) {
      console.log("tryde error", error)
    }
  }
}

export default boot(async ({app, store, router}) => {

  const latestTerminalUid = LocalStorage.getItem('latestTerminalUid') || Cookies.get('latestTerminalUid') || null


  const terminalStore = useTerminalStore(store)
  const {terminal} = storeToRefs(terminalStore)
  const themeStore = useThemeStore(store)
  const {settings} = storeToRefs(themeStore)
  const localeSettings = LocalStorage.getItem('themeSettings')
  if (localeSettings) {
    themeStore.setThemeSettings(localeSettings)
  }
  const orderStore = useOrderStore(store)

  router.beforeEach((to, from, next) => {
    const initialTerminal = LocalStorage.getItem('terminal') || terminal.value || null
    const isLogin = to.name === 'login'
    if (!initialTerminal?.id && !isLogin) {
      next({name: 'login'})
      return
    }
    next()
  })
  const initialTerminal = LocalStorage.getItem('terminal') || terminal.value || null

  if (initialTerminal && initialTerminal.uid) {
    await terminalStore.fetchTerminalByUuId(initialTerminal.uid)
  }

  await initializeSignalr()
  // signalr on refresh settings event
  signalr.on('refreshsettings', async (res) => {
    if (!terminal.value?.uid) {
      return
    }
    if (res && res.uid === terminal.value.uid) {
      await terminalStore.fetchTerminalByUuId(terminal.value.uid)
      Loading.show({
        message: i18n.global.t('base.refreshsettings'),
        spinnerSize: 100,
        spinnerColor: 'secondary',
        spinner: QSpinnerGears,
      })
      setTimeout(() => {
        Loading.hide()
      }, 2000)
    }
  })

  // signalr on NewOrder event
  signalr.on('NewOrder', async (order) => {
    if (!terminal.value?.uid) {
      return
    }
    orderStore.setNewOrder(order)
  })

  // signalr on OrderDetailCancelled event
  signalr.on('OrderDetailCancelled', async (orderProductId, isClosed) => {
    if (!terminal.value?.uid) {
      return
    }
    orderStore.setOrderDetailCancelled(orderProductId, isClosed)
  })

  // signalr on OrderDetailUpdated event
  signalr.on('RefreshTerminal', async (res) => {
    if (!terminal.value?.uid) {
      return
    }
    if (res && res.now === true) {
      bus.emit('showProgressBar', 100)
      return
    }
    if (res && res.uid === terminal.value.uid) {
      Dialog.create({
        component: GeneralUpdateDialog,
      }).onOk((payload) => {
        bus.emit('showProgressBar', payload)
      })
    } else if (res && res.uid === null) {
      Dialog.create({
        component: GeneralUpdateDialog,
      }).onOk((payload) => {
        bus.emit('showProgressBar', payload)
      })
    }
  })

  app.provide("signalr", signalr);

})
