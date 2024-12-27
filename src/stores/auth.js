import { defineStore } from 'pinia';
import {api} from "boot/axios";
import {fireNotify} from "src/utils/notifications";
import {i18n} from "boot/i18n";
export const useAuthStore = defineStore('auth', {
  state: () => ({
    userPermissions: [],
    terminalDetails: {},
  }),
  getters: {
    hasPermission: (state) => (permission) => {
      // this for testing purposes
      return true
      return state.userPermissions.includes(permission)
    }
   },
  actions: {
    async fetchTerminalDetails(terminalUuId) {
      return await api.get('/Terminal/GetTerminalDetails', {params: {terminalUuId}}).then((response) => {
        this.terminalDetails = response.data.result
      }).catch(er => {
        fireNotify(i18n.global.t('base.failed', {name: i18n.global.t('base.terminalDetails')}), 'failed', null, 5000, 'negative')
      })
    },

  },

});
