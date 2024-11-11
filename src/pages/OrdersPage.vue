<script setup>
import {useOrder} from "src/composables/useOrder";
import KioskBoardInput from "components/common/KioskBoardInput.vue";
import {textCapitalize} from "../utils/helpers";

const {
  getTerminalOrders,
  pagination,
  orderFilterInput,
  date,
  $q,
  router,
  deliverOrder,
  onClickOrderHistory,
  filterTerminalOrder,
  completeOrders
} = useOrder();
</script>

<template>
  <q-page class="q-pl-md q-pr-md ">
    <q-table
      grid
      flat bordered
      :rows="getTerminalOrders()"
      :columns="[]"
      row-key="id"
      :filter="orderFilterInput"
      hide-header
      :rows-per-page-options="[0]"
      :filter-method="filterTerminalOrder"
      hide-pagination
      hide-bottom
      virtual-scroll
      v-model:pagination="pagination"
      class="full-height"
    >
      <template v-slot:top>
        <div class="row full-width">
          <div class="col-4 flex content-end">
            <div class="text-h6 text-bold">
              {{ $t('order.orders') }} ({{ getTerminalOrders().length }})
            </div>
          </div>
          <div class="col-8 row  flex justify-end  ">
            <q-btn icon="o_cancel" unelevated color="green-9" no-caps :label="$t('order.clearAllTickets')" @click="completeOrders" class="  "/>
            <q-btn icon="add" unelevated no-caps :label="$t('order.createNewOrder')" @click="router.push({name:'table'})" class=" q-ml-md is-activeBtn"/>
            <KioskBoardInput
              styleClass=""
              show-prepend
              :placeholder="$t('base.search')"
              v-model="orderFilterInput"
              class="q-ml-md bg-white"
              @clearValue="orderFilterInput = ''"

            />
            <q-btn   color="dark" icon="history" unelevated no-caps :label="$t('order.orderHistory')" @click="onClickOrderHistory" class="q-ml-md"/>
          </div>
        </div>
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-4 col-sm-3 col-md-2 ">

          <q-card flat bordered square  class=" full-height flex " style="flex-direction: column;">
            <q-card-section class="q-pa-xs flex  justify-center">
              <div class="text-subtitle1 text-left text-bold flex items-center q-ml-sm">
                <q-icon name="point_of_sale" size="17px" class="q-mr-xs"/>
                {{ props.row.tableName }}
              </div>
            </q-card-section>
            <q-separator size="2px"/>
            <q-card-section class="q-pa-xs flex  justify-center no-wrap" v-if="props.row.playerName">
              <q-icon name="o_person" size="20px" class="q-mr-xs"/>
              <div class="text-bold q-ml-sm">
                {{ props.row.playerName	 }}
              </div>
            </q-card-section>
            <q-separator size="2px" v-if="props.row.playerName"/>

            <q-card-section class="q-pa-xs flex  justify-center">
              <div class="text-subtitle1 text-left text-bold flex items-center q-mr-sm">
                <q-icon name="schedule" size="17px" class="q-mr-xs"/>
                {{ date.formatDate(props.row.createdAt, 'HH:mm:ss') }}
              </div>
            </q-card-section>
            <q-separator size="2px" v-if="props.row.note"/>

            <q-card-section class="q-pa-xs flex  justify-center" v-if="props.row.note">
              <q-icon name="o_comment" size="17px" class="q-mr-xs q-mt-xs float-left"/>
              <div class=" q-mr-sm">
                {{ textCapitalize(props.row.note) }}
              </div>
            </q-card-section>
            <q-separator size="2px"/>

            <q-card-section class="q-pa-xs row" v-for="(product,index) in props.row.products.filter(p => p.status === 'New')" :key="index">
              <div class="text-subtitle2   col-12 text-center">
               <div class="row col-12 flex flex-center">
                <span> {{ product.quantity }} X {{ product.productName }}</span>
                 <span  class="q-ml-md text-grey-8" v-if="product.portion">{{product.portion}}</span>
                 <span class="q-ml-md text-grey-8" v-if="product.extras">{{product.extras}}</span>
                 <span class="q-ml-md   row col-12 flex flex-center text-subtitle2  " v-if="product.note">{{$t('base.note')}}:  <span class="q-ml-sm">{{textCapitalize(product.note)}}</span>...</span>
               </div>
              </div>
              <div class="col-12" v-if="index !== props.row.products.filter(p => p.status === 'New').length - 1">
                <q-separator size="2px"/>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-sm bg-dark cursor-pointer full-width " @click="deliverOrder(props.row)" style="margin-top: auto;position: relative;">
              <div class="row blink flex justify-center  items-center  ">
                <q-icon name="touch_app" class="q-mr-md" size="25px" />
                <div class="text-h5 text-bold "> {{ $t('order.newTicket') }} </div>
              </div>
            </q-card-section>
          </q-card>

        </div>
      </template>
      <template v-slot:no-data>
        <div class="row col-12 flex flex-center" >
          <q-card flat>
            <q-card-section>
              <div class="text-h6 text-bold"> {{ $t('base.noOrderList') }} </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<style scoped lang="scss">
.blink {
  animation: blinker 0.5s cubic-bezier(.5, 0, 1, 1) infinite alternate;
}
@keyframes blinker {
  to {
    opacity: 1;
    color: white;
  }

  from {
    opacity: 0.6;
    color: red;
  }
}
</style>
