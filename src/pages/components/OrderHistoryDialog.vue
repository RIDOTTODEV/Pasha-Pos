<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" square style="z-index: 0!important; " maximized position="right" transition-duration="500" backdrop-filter="blur(4px) saturate(150%)"  >
    <q-card class="q-dialog-plugin" flat style="min-width: 1000px;margin-top: 60px;height: 100%!important;">
        <q-card-section>
        <app-table
          :filterFields="filterFields"
          :title="$t('order.orderHistories')"
          event-bus-key="orderHistory"
          :filter-fn="orderStore.fetchOrderHistory"
          table-column-name="orderHistories"
          :use-date-time-filter="false"
          :data="orderHistory"
          :total-count="orderHistoryTotal"
          @rollBackProduct="onClickRollBackProduct"
          />
        </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {useDialogPluginComponent} from 'quasar'
import {useOrderStore} from "stores/order-store";
import {storeToRefs} from "pinia";
import AppTable from "components/common/AppTable.vue";
const orderStore = useOrderStore()
const {orderHistory,orderHistoryTotal} = storeToRefs(orderStore)
const props = defineProps({
  filterFields:{
    type:Object,
    required:true,
    default:()=>({})
  }
})

defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const onClickRollBackProduct = async (product) => {
  await orderStore.updateOrderDetailStatus(product.id, 'New').then(() => {
    onDialogOK()
  })
}
</script>
