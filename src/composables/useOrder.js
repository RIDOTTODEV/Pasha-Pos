import {useOrderStore} from "stores/order-store";
import {useTerminalStore} from "stores/terminal-store";
import {storeToRefs} from "pinia";
import {defineAsyncComponent, onMounted, ref} from "vue";
import {useQuasar, date} from "quasar";
import {i18n} from "boot/i18n";
import {useRouter} from "vue-router";


export function useOrder() {
  const $q = useQuasar()
  const terminalStore = useTerminalStore()
  const {getTerminal , getTerminalMenuIds} = storeToRefs(terminalStore)
  const router = useRouter()

  const orderStore = useOrderStore()
  const {getTerminalOrders, terminalOrders} = storeToRefs(orderStore)
  const orderFilterFields = ref({
    Statuses: ['New'],
    StartDate: date.formatDate(date.subtractFromDate(new Date(), {hours: 10}), 'YYYY-MM-DDTHH:mm:ss'),
    IsClosed: false,
    Take: 50,
    Skip: 0,
    SectionIds: getTerminal.value('sections'),
    OrderTagIds: getTerminal.value('tags'),
    MenuIds: getTerminalMenuIds.value,
    //EndDate: null,
    QueryType: 'ByTime'
  })
  const pagination = ref({
    page: 1,
    rowsPerPage: 50,
  })
  const orderFilterInput = ref('')

  onMounted(async () => {
    await fetchOrders()
   })

  const fetchOrders = async () => {
    await orderStore.fetchOrders(JSON.parse(JSON.stringify(orderFilterFields.value)))
  }

  const onClickOrderHistory = async () => {
    let params = {...orderFilterFields.value}
    delete params.Statuses
    params.IsClosed = true
    params.Sort = 'Id DESC'
    params.Take = 50
    $q.dialog({
      component: defineAsyncComponent(() => import('src/pages/components/OrderHistoryDialog.vue')),
      componentProps: {
        filterFields: params,
      },
    }).onOk(() => {
      fetchOrders()
    })
  }
  const deliverOrder = (order) => {
    const orderDetailIds = order.products.map(product => product.id)
    orderStore.bulkUpdateOrderDetailStatus(orderDetailIds, 'Delivered').then(() => {
      terminalOrders.value = terminalOrders.value.filter(Order => Order.id !== order.id)
      $q.notify({
        type: 'positive',
        message: i18n.global.t('order.orderDeliveredSuccess'),
        position: 'bottom-right',
        timeout: 1500,
      })
    })
  }

  const filterTerminalOrder = (rows) => {
    return rows.filter(order => {
      return order.tableName?.toLowerCase().indexOf(orderFilterInput.value.toLowerCase()) > -1
        || order.playerName?.toLowerCase().indexOf(orderFilterInput.value.toLowerCase()) > -1
        || order.orderedByFullName?.toLowerCase().indexOf(orderFilterInput.value.toLowerCase()) > -1
        || order.note?.toLowerCase().indexOf(orderFilterInput.value.toLowerCase()) > -1
        || order.products?.some(product =>
          product.productName.toLowerCase().indexOf(orderFilterInput.value.toLowerCase()) > -1
        )
    })
  }

  const completeOrders = async () => {
    const orderDetailIds = terminalOrders.value.map(order => order.products.map(product => product.id)).flat()
    // show quasar dialog for confirmation
    $q.dialog({
      title: i18n.global.t('order.completeOrders'),
      message: i18n.global.t('order.completeOrdersConfirmation'),

      persistent: true,
      color: 'secondary',
      ok: {
        label: i18n.global.t('base.ok'),
        color: 'blue-grey-8',

        unelevated: true,

      },
      cancel: {
        label: i18n.global.t('base.cancel'),
        color: 'negative',
        noCaps:true,
        flat:true
      },
    }).onOk(async () => {
      await orderStore.bulkUpdateOrderDetailStatus(orderDetailIds,'Delivered').then(() => {
        terminalOrders.value = []
        $q.notify({
          type: 'positive',
          message: i18n.global.t('order.orderCompletedSuccess'),
          position: 'bottom-right',
          timeout: 1500,
        })
      })
    })


  }
  return {
    terminalStore,
    orderStore,
    $q,
    getTerminalOrders,
    pagination,
    orderFilterInput,
    date,
    router,
    deliverOrder,
    onClickOrderHistory,
    filterTerminalOrder,
    completeOrders
  }
}
