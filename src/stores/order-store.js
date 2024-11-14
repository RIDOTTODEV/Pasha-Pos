import {defineStore} from 'pinia'
import {api} from "boot/axios";
import {useTerminalStore} from "stores/terminal-store";
import {useThemeStore} from "stores/theme-store";
import {parseParams,playOneRingTone} from "src/utils/helpers";
export const useOrderStore = defineStore('order', {
  state: () => ({
    selectedSection: null,
    selectedTable: null,
    terminalOrders: [],
    orderHistory: [],
    orderHistoryTotal: 0,
  }),

  getters: {
    getSelectedTable: (state) => (needle = null) => {
      if (!state.selectedTable) return null
      if (!needle) return state.selectedTable
      return state.selectedTable[needle]
    },
    getTerminalOrders: (state) => (needle = null) => {
      //const terminalStore = useTerminalStore()
      return state.terminalOrders
    }
  },

  actions: {
    onSelectSection(section) {
      this.selectedSection = section
      this.selectedTable = null
    },
    onSelectTable(table) {
      this.selectedTable = table
      this.router.push({name: 'tableDetail', params: {id: table.id}})
    },
    async searchProducts(params) {
      return await api.get('Product/GetSearchProducts', {params})
    },
    async getPlayerOrders(params) {
      return await api.get('Order/GetAll', {params})
    },
    async fetchOrders(params) {
      await api.get('Order/GetAll', {
        params: params,
        paramsSerializer: params => parseParams(params)
      }).then(res => {
         this.terminalOrders = res.data.data
      })
    },
      setNewOrder(order) {
      const terminalStore = useTerminalStore()
      const {getTerminalTags, getTerminalSections, getTerminalMenuIds} = terminalStore
      const themeStore = useThemeStore()
      const {settings} = themeStore

      order.products = order.products.filter(product =>
        getTerminalTags.includes(product.orderTagId)
        && getTerminalMenuIds.includes(product.menuId)
      ).map(product => {
        return {
          ...product,
          status:'New'
        }
      })
      if (order.products.length > 0 && getTerminalSections.includes(order.sectionId)) {
        if (settings.newOrder.ringTone) {
            playOneRingTone().then()
        }
        this.terminalOrders.unshift(order)
      }
    },
    setOrderDetailCancelled(orderProductId, isClosed) {
      const order = this.terminalOrders.find(order => order.products.some(product => product.id === orderProductId))
      if (isClosed) {
        order.products = order.products.filter(product => product.id !== orderProductId)
        if (!order.products.length) {
          this.terminalOrders = this.terminalOrders.filter(Order => order.id !== Order.id)
        }
      } else {
        order.products = order.products.filter(product => product.id !== orderProductId)
      }
    },
    async bulkUpdateOrderDetailStatus(orderDetailIds, status) {
      return await api.post('Order/BulkUpdateOrderDetailStatus', {orderDetailIds, status})
    },
    async fetchOrderHistory(params) {
      await api.get('Order/GetAll', {
        params: params,
        paramsSerializer: params => parseParams(params)
      }).then(res => {
        this.orderHistory = res.data.data
        this.orderHistoryTotal = res.data.count
      })
    },
    async updateOrderDetailStatus(orderDetailId, status) {
      return await api.post('Order/UpdateOrderDetailStatus', {orderDetailId, status})
    },
    async completeOrders(orderIds) {
      return await api.post('Order/CompleteOrders', orderIds)
    },
  }
})


