import {defineStore} from 'pinia'
import {api,axios} from "boot/axios";
import {fireNotify} from "src/utils/notifications";
import {i18n} from "boot/i18n";
import {Loading, LocalStorage} from "quasar";

export const useTerminalStore = defineStore('terminal', {
  state: () => ({
    terminal: {},
    tags: [],
    sections: [],
    terminalMenu: [],
    waiters: [],
    tables: [],
    extraSets: [],
    portionSets: []
  }),

  getters: {
    getTerminal: (state) => (needle = null) => {
      if (!state.terminal) return null
      if (!needle) return state.terminal
      return state.terminal[needle]
    },
    getOrderTables() {
      return this.tables.sort((a, b) => a.order - b.order) || []
    },
    getOrderSections() {
      return this.sections.sort((a, b) => a.order - b.order) || []
    },
    getSectionTables: (state) => (sectionId) => {
      return state.tables.filter(table => table.sectionId === sectionId)
    },
    getPortionSet: (state) => (id) => {
      return state.portionSets.find(portionSet => portionSet.id === id)
    },
    getExtraSet: (state) => (id) => {
      return state.extraSets.find(extraSet => extraSet.id === id)
    },
    getTag: (state) => (id) => {
      return state.tags.find(tag => tag.id === id)
    },
    getPortionName: (state) => (portionSetId, portionId) => {
      const portionSet = state.portionSets.find(portionSet => portionSet.id === portionSetId)
      if (!portionSet) return ''
      const portion = portionSet.portions.find(portion => portion.id === portionId)
      if (!portion) return ''
      return portion.name
    },
    getExtraName: (state) => (extraSetId, extraId) => {
      const extraSet = state.extraSets.find(extraSet => extraSet.id === extraSetId)
      if (!extraSet) return ''
      const extra = extraSet.extras.find(extra => extra.id === extraId)
      if (!extra) return ''
      return extra.name
    },
    getTerminalMenuIds: (state) => {
      return state.terminalMenu.map(menu => menu.menuId)
    },
    getTerminalMenuNames: (state) => {
      return state.terminalMenu.map(menu => menu.menuName)
    },
    searchTableByName: (state) => (tableName) => {
      return state.tables.filter(table => table.name.toLowerCase().includes(tableName.toLowerCase()))
    },
    getTerminalTags: (state) => {
      return [...state.terminal?.tags || []]
    },
    getTerminalSections: (state) => {
      return [...state.terminal?.sections || []]
    },

  },

  actions: {
    async fetchTerminalByUuId(uid) {
      await api.get(`Terminal/GetTerminalSettings?uid=${uid}`).then(async res => {
        this.terminal = res.data || null
        const initTerminal = this.initTerminal()
        await LocalStorage.setItem('terminal', this.terminal)
        initTerminal.then(() => {
          this.router.push({name: 'home'})
        })
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      })
    },
    async fetchTerminalMenu() {
      await api.get(`Terminal/GetTerminalMenu?uid=${this.terminal?.uid}`).then(res => {
        this.terminalMenu = res.data
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      })
    },
    async fetchWaiters() {
      await api.get('Waiter/GetAll', {params: {Take: 999, Skip: 0}}).then(res => {
        this.waiters = res.data.data
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      })
    },
    async fetchTables() {
      await api.get('Table/GetAll', {params: {Take: 999, Skip: 0}}).then(res => {
        this.tables = res.data.data
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      })
    },
    async fetchExtraSets() {
      await api.get('ExtraSet/GetAll', {params: {Take: 999, Skip: 0}}).then(res => {
        this.extraSets = res.data.data
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      })
    },
    async fetchPortionSets() {
      await api.get('PortionSet/GetAll', {params: {Take: 999, Skip: 0}}).then(res => {
        this.portionSets = res.data.data
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      })
    },
    async fetchTags() {
      await api.get('Tag/GetAll', {params: {Take: 999, Skip: 0}}).then(res => {
        this.tags = res.data.data
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      })
    },
    async fetchSections() {
      await api.get('Section/GetAll', {params: {Take: 999, Skip: 0}}).then(res => {
        this.sections = res.data.data
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      })
    },
    async initTerminal() {
      const requests = [
        await this.fetchTerminalMenu(),
        await this.fetchWaiters(),
        await this.fetchTables(),
        await this.fetchExtraSets(),
        await this.fetchPortionSets(),
        await this.fetchTags(),
        await this.fetchSections(),
      ]
      return await Promise.all(requests)
    },
    async updateTerminalSettings(appendUrl, settings) {
      Loading.show()
      return await api.post(`Terminal/${appendUrl}`, settings).then(() => {
        this.fetchTerminalSettings()
        fireNotify(i18n.global.t('base.settingsSaved'), 'success', null, 1500, 'positive')
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      }).finally(() => {
        Loading.hide()
      })
    },
    async fetchTerminalSettings() {
      await api.get(`Terminal/GetTerminalSettings?uid=${this.terminal.uid}`).then(res => {
        this.terminal = res.data
        LocalStorage.set('terminal', this.terminal)
      }).catch(err => {
        fireNotify(i18n.global.t('base.errorOccurred', {message: err.message}), 'failed', null, 1500, 'negative')
      })
    },
    async getPlayerByTableNo(posTableNo) {
     return await axios.get(`${this.terminal.ridottoApiUrl}/api/services/app/MeterLog/GetPlayerTodayResult`,{
        params:{
          PosTableNo: posTableNo
        }
      }).then(res => res.data)
    },
    async createOrder(data) {
        await api.post('Order/Create', data).then(res => {
          this.router.push({name:'home'})
          fireNotify(i18n.global.t('order.createdSuccessfully'), 'success', null, 1500, 'positive')
        })
    },
    async getCurrentTable(searchString) {
      return await axios.get(`${this.terminal.assistApiUrl}/Member/GetCurrentTable?searchString=${searchString}`)
    }
  }
})
