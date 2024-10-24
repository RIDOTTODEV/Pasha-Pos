import {defineAsyncComponent, ref, watch, inject} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {date, LocalStorage, useQuasar,} from "quasar";
import {storeToRefs} from "pinia";
import {useThemeStore} from "stores/theme-store";
import {useTerminalStore} from "stores/terminal-store";
import {i18n} from "boot/i18n";

const AppHeader = defineAsyncComponent(() => import('components/layout/Header.vue'));
const SidebarMenus = defineAsyncComponent(() => import('components/layout/SideBarMenus.vue'));

export function useLayout() {

  const showUpdateProgressBar =  ref(false)
  const progressDuration = ref(0)
  const bus = inject('bus')
  const $q = useQuasar()
  const leftDrawerOpen = ref(false);
  const themeStore = useThemeStore();
  const {getMenus, locales, currentGameDate, settings} = storeToRefs(themeStore)
  const terminalStore = useTerminalStore()
  const {terminal} = storeToRefs(terminalStore)
  const searchInput = ref('')
  const searchResults = ref([])
  const showResults = ref(false)
  /********** FOR SIDEBAR **********/
  const router = useRouter()
  const route = useRoute()
  const currentRouteName = ref(route.name)
  const currentRouteMeta = ref(route.meta.groupName)
  const expansionRefs = ref([])
  const expansionOnHandleShow = (name) => {
    expansionRefs.value.forEach((ref) => {
      if (ref.$attrs.name !== name) {
        ref.hide()
      }
    })
  }
  watch(() => route.name, (to) => {
    searchInput.value = ''
    currentRouteName.value = to
    currentRouteMeta.value = route.meta.groupName
  })

  const createGamingDate = () => {
    const now = new Date()
    const timeFormatted = date.formatDate(now, 'DD.MM.YYYY')
    $q.dialog({
      component: defineAsyncComponent(() => import("components/common/GamingDateDialog.vue")),
      componentProps: {
        formValues: {
          date: timeFormatted,
        },
        actionFn: themeStore.createGamingDate,

      },
      persistent: true,
    })
  }

  const onClickLogout = async () => {
    LocalStorage.setItem('latestTerminalUid', terminal.value.uid)
    LocalStorage.removeItem('terminal')
    //terminal.value = null
    await router.push({name: 'login'})
  }

  const toggleDarkMode = () => {
    const isActiveDarkModel = LocalStorage.getItem('darkMode')
    if (isActiveDarkModel) {
      LocalStorage.set('darkMode', false)
      $q.dark.set(false)
    } else {
      LocalStorage.set('darkMode', true)
      $q.dark.set(true)
    }
  }
  /**********  / FOR SIDEBAR **********/

  const onSubmitSearch = async () => {
    if (currentRouteName.value === 'home') {
      await searchCurrentTable().then(res => {
        if (res.data) {
          searchResults.value = res.data

          showResults.value = true
        }
      })
    } else if (currentRouteName.value === 'table') {
      bus.emit('searchTable', searchInput.value)
    }
  }
  const searchCurrentTable = async () => {
    return await terminalStore.getCurrentTable(searchInput.value)
  }

  const onClearSearchInput = () => {
    searchInput.value = ''
    searchResults.value = []
    bus.emit('searchTable', '')
  }

  const onClickExitApp = () => {
    // if (!settings.value.newOrder.extensionId) {
    //   $q.notify({
    //     type: 'warning',
    //     position: 'center',
    //     message: i18n.global.t('base.extensionNotFound'),
    //     timeout: 2000
    //   })
    //   return
    // }
    $q.dialog({
      title: i18n.global.t('base.exitApp'),
      message: i18n.global.t('base.exitAppMessage'),
      ok: {
        label: i18n.global.t('base.yes'),
        color: 'negative',
        push: false,
        unelevated: true
      },
      cancel: {
        label: i18n.global.t('base.no'),
        color: 'blue-grey-8',
        unelevated: true,
        flat: true,
        autofocus: true
      }
    }).onOk(async () => {
      window.postMessage('exitApp', '*')
    })
  }

  bus.on('showProgressBar',(duration) => {
    showUpdateProgressBar.value = true
    progressDuration.value = duration
  })

  return {
    $q,
    leftDrawerOpen,
    AppHeader,
    getMenus,
    currentRouteName,
    currentRouteMeta,
    searchInput,
    SidebarMenus,
    router,
    expansionRefs,
    locales,
    themeStore,
    currentGameDate,
    terminal,
    showResults,
    searchResults,
    showUpdateProgressBar,
    progressDuration,
    onClickLogout,
    expansionOnHandleShow,
    createGamingDate,
    toggleDarkMode,
    onSubmitSearch,
    onClearSearchInput,
    onClickExitApp
  }
}
