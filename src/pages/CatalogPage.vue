<script setup>
import {getNameOfObject, textCapitalize} from "src/utils/helpers";
import {useCatalog} from "src/composables/useCatalog";
import KioskBoardInput from "components/common/KioskBoardInput.vue";
import {onUnmounted} from "vue";
import {date} from "quasar";

onUnmounted(() => {
  selectedTable.value = null
})
const {
  terminalStore,
  fetchFavoriteProduct,
  selectedTable,
  order,
  $q,
  categories,
  categoryHistory,
  products,
  searchProductInput,
  selectedOrderItem,
  orderProcess,
  turkishAlphabet,
  filteredWaiters,
  selectedAlphabet,
  orderPlayer,
  playerPhotoUrl,
  onClickCategory,
  onClickBack,
  onClickFavorite,
  onClickProduct,
  filterProducts,
  onSelectOrderItem,
  onClickAddNoteSelectedOrderItem,
  productPortionAndExtra,
  onClickAddOrderNote,
  onClickCopyProduct,
  onSelectAlphabet,
  onSelectWaiter
} = useCatalog();

</script>

<template>
  <q-page class="q-pl-md q-pr-md q-pt-sm">
    <div class="row">
      <div class="col-4 q-mt-xs bg-white">
        <div class="q-pb-none q-pt-xs q-pr-sm q-pl-sm row flex justify-between"
             style="flex: 0 0 auto; max-height: 30%; overflow: auto">
          <div class="text-subtitle1 flex content-center items-center">
            <q-icon name="o_local_dining" size="2rem" class="q-mr-sm"/>
            <span class="text-bold">{{ textCapitalize(selectedTable?.name) }}  {{ $t('base.orders') }} </span>
          </div>
        </div>
        <q-card flat square class="justify-between"
                style="display: flex; flex-direction: column;height: calc(100vh - 148px); ">
          <q-card-section class="q-pb-none q-pt-xs q-pr-sm q-pl-sm row flex justify-between"
                          v-if="orderPlayer?.playerId > 0" style="flex: 1 1 auto; height:30%;overflow: auto ">
            <q-item clickable v-ripple class="col-12 q-pt-none q-pb-none q-pr-sm q-pl-sm bg-red-1" dense>
              <q-item-section avatar style="margin-left: -6px;">
                <q-avatar rounded>
                  <q-img width="200px" error-src="/assets/no-image.png" :src="playerPhotoUrl"/>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span>{{ orderPlayer?.name + ' ' + orderPlayer?.surname }}</span>
                  -- <span>{{ orderPlayer?.playerId }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row flex text-subtitle2 text-dark">
                  <q-icon name="history" size="20px" class="q-mr-sm"/>
                  <span class="q-mr-xs">{{ $t('order.orderHistory') }}</span> (<span
                  class="text-bold">{{ orderPlayer?.orders?.length }}</span>)
                </div>
              </q-item-section>
            </q-item>
            <!--            <q-scroll-area style="height: 200px; width: 100%!important;">-->
            <!--            -->
            <!--            </q-scroll-area>-->
            <div class="q-ma-sm bg-grey-1 full-width row" v-for="(o,i) in orderPlayer.orders" :key="i">
              <div class="col-12 row" v-for="(p,k) in o.products" :key="k">
                <div class="col-4 flex content-center">
                  <div class="text-subtitle2 ">{{ p.productName }}</div>
                  <span class="q-ml-sm" v-if="p.portion"> {{ p.portion }}</span>
                  <span class="q-ml-sm" v-if="p.extra"> {{ p.extra }}</span>
                </div>
                <div class="col-4 flex content-center justify-center">
                  <div class="text-subtitle1 text-bold">X{{ p.quantity }}</div>
                </div>
                <div class="col-4 flex content-center justify-end">
                  <div class="text-subtitle2">{{ date.formatDate(p.createdAt, 'DD.MM.YYYY HH:mm') }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
          <div :style="'display: flex; flex-direction: column;flex: 15 0 auto;overflow: auto; max-height: 40%;' ">
            <q-card-section class="product_list q-pa-none" style="">
              <q-item clickable v-ripple class="col-12 q-mt-xs q-pt-none q-pb-none q-pr-sm q-pl-sm bg-red-1" dense>
                <q-item-section>
                  <q-item-label>
                    {{ $t('base.newOrderList') }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row flex text-subtitle2 text-dark">
                    <q-icon name="o_loyalty" size="20px" class="q-mr-sm"/>
                    <span class="q-mr-xs">{{ $t('order.orderHistory') }}</span> (<span
                    class="text-bold">{{ order.products.length }}</span>)
                  </div>
                </q-item-section>
              </q-item>
              <div class="row">
                <div class="col-12">
                  <q-item v-for="(item,index) in order.products" dense :key="index" clickable
                          :active="selectedOrderItem.index === index" active-class="selectedProduct"
                          class="q-pl-none q-pr-none">
                    <q-item-section avatar>
                      <div class="flex q-ml-xs">
                        <q-btn
                          unelevated
                          :color="selectedOrderItem?.index === index ? 'white' : 'secondary'"
                          outline
                          style="width: 40px"
                          label="-"
                          @click="()=> item.quantity > 1 ? item.quantity-- : order.products.splice(index, 1)"

                        />

                        <q-btn
                          unelevated
                          outline
                          style="width: 40px"
                          :label="item.quantity"
                          class="q-mx-sm"
                          color="grey-9"
                        />
                        <q-btn
                          unelevated
                          :color="selectedOrderItem?.index === index ? 'white' : 'secondary'"
                          outline
                          style="width: 40px"
                          label="+"
                          @click="()=> item.quantity++"

                        />
                      </div>
                    </q-item-section>
                    <q-item-section @click="onSelectOrderItem(item,index)">
                      <div class="text-h6">
                        {{ textCapitalize(item.productName) }}
                      </div>
                      <div style="margin-top: -5px">
                        <div class="text-subtitle2  " v-if="item.portionSetId && item.portion">
                          {{ textCapitalize(item.portion) }}
                        </div>
                        <div class="text-subtitle2  " v-if="item.extraSetId && item.extras">
                          {{ textCapitalize(terminalStore.getExtraName(item.extraSetId, item.extras)) }}
                        </div>
                      </div>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon class="q-mr-sm" @click="onClickCopyProduct(item)" size="2rem" name="content_copy"
                              :color="selectedOrderItem?.index === index ? 'white' : 'grey-8'"/>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-card-section>
          </div>
          <q-card-section class="q-pa-none row ">
            <q-btn
              :disable="order.products.length === 0"
              no-caps
              square
              :label="$t('base.next')"
              unelevated
              class="full-width tableBtn"
              @click="() => {
                orderProcess = 'chooseWaiter'
              }"
              size="30px"
              style="border-bottom: 3px solid #e6e6e6"
            />
            <q-btn
              no-caps
              square
              :label="$t('base.close')"
              unelevated
              class="col-6 hB"
              :color="$q.dark.isActive ? 'dark' : 'white'"
              :text-color="$q.dark.isActive ? 'white' : 'dark'"
              to="/table"

              style="border-right: 3px solid #e6e6e6;"
            />
            <q-btn
              :disable="order.products.length === 0"
              no-caps
              square
              :label="$t('base.clear')"
              unelevated
              :color="$q.dark.isActive ? 'dark' : 'white'"
              :text-color="$q.dark.isActive ? 'white' : 'dark'"
              class="col-6 hB"
              @click="() => {
                order.products = []
                selectedOrderItem = {product: null, index: -1}
              }"

            />
            <q-btn
              no-caps
              square
              :label="$t('base.note')"
              unelevated
              :color="$q.dark.isActive ? 'dark' : 'white'"
              :text-color="$q.dark.isActive ? 'white' : 'dark'"
              class="  col-12 hB"
              @click="onClickAddOrderNote"

              style="border-top: 3px solid #e6e6e6"
            />
          </q-card-section>
        </q-card>
      </div>
      <div v-if="orderProcess === 'product'" class="col-3 q-pa-xs">
        <q-card flat square>
          <q-card-section class="q-pa-none" style="height: calc(100vh - 10vh)">
            <div class="post-category">
              <div class="pos__categories__inner">
                <div class="pos__category col-12 cursor-pointer  is-back" style="min-width: 100% !important;"
                     v-if="categoryHistory.length > 0" @click="onClickBack">
                  <q-icon name="arrow_back" size="2rem" class="q-mr-sm"/>
                  {{ $t('base.back') }}
                </div>
                <div class="pos__category col-12 cursor-pointer  "
                     :style="fetchFavoriteProduct ? {minWidth: '100% !important', backgroundColor:'#ff3568!important',color:'white'} : {minWidth: '100% !important'}"
                     v-if="categoryHistory.length > 0" @click="onClickFavorite">
                  <q-icon :name="fetchFavoriteProduct ? 'favorite' :'favorite_border'" size="2rem" class="q-mr-sm"/>
                  {{ $t('base.favorites') }}
                </div>
                <div class="pos__category cursor-pointer" v-for="(item,index) in categories" :key="index"
                     @click="onClickCategory(item)">
                  <div class="">
                    {{ textCapitalize(getNameOfObject(item)) }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="orderProcess === 'product'" class="col-5 q-pa-xs">
        <q-card flat square style="height: calc(100vh - 10vh)">
          <q-card-section>
            <KioskBoardInput
              v-model="searchProductInput"
              @update:modelValue="filterProducts"
              :debounce="1000"
              :placeholder="$t('base.searchProduct')"
              :show-prepend="true"
              @clearValue="() => {
                searchProductInput = ''
                filterProducts()
              }"
            />
          </q-card-section>
          <q-card-section class="row q-pt-none">
            <q-scroll-area style="height: 500px; width: 100%!important;">
              <div class="row">
                <div class="col-4" v-for="(product,index) in products" :key="index" @click="onClickProduct(product)">
                  <div v-ripple
                       class="relative-position text-capitalize container flex justify-center text-center content-center text-bold cursor-pointer q-ma-sm  productBtn"
                       style="height: 60px">
                    {{ textCapitalize(product.productName) }}
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="orderProcess === 'productDetail'" class="col-8 q-pa-xs">
        <q-card flat square>
          <q-card-section class="q-pb-none">
            <div class="row col-12 bg-secondary text-white  flex content-center justify-center" style="height: 40px">
              <div class="text-subtitle1 text-bold ">
                {{ $t('base.actions') }}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pl-sm q-pr-sm q-pt-none">
            <div class="row">
              <div class="col-4 ">
                <div v-ripple
                     @click="() => {
                      order.products.push({...selectedOrderItem.product})
                    }"
                     class="app-cart-grey flex content-center justify-center q-ma-sm relative-position cursor-pointer  "
                     style="height: 70px">
                  <div class="text-subtitle1 text-bold">
                    {{ $t('base.duplicate') }}
                  </div>
                </div>
              </div>
              <div class="col-4 ">
                <div v-ripple
                     @click="onClickAddNoteSelectedOrderItem"
                     class="app-cart-grey flex content-center justify-center q-ma-sm relative-position cursor-pointer"
                     style="height: 70px">
                  <div class="text-subtitle1 text-bold">
                    {{ $t('base.note') }}
                  </div>
                </div>
              </div>
              <div class="col-4 ">
                <div v-ripple
                     @click="productPortionAndExtra(selectedOrderItem.product,'update',true)"
                     class="app-cart-grey flex content-center justify-center q-ma-sm relative-position cursor-pointer"
                     style="height: 70px">
                  <div class="text-subtitle1 text-bold">
                    {{ $t('base.portionsAndExtras') }}
                  </div>
                </div>
              </div>
              <div class="col-4 ">
                <div v-ripple
                     @click="() => {
                        order.products.splice(selectedOrderItem.index, 1)
                         selectedOrderItem = {product: null, index: -1}
                      }"
                     class="app-cart-grey flex content-center justify-center q-ma-sm relative-position cursor-pointer"
                     style="height: 70px">
                  <div class="text-subtitle1 text-bold">
                    {{ $t('base.cancel') }}
                  </div>
                </div>
              </div>
              <div class="col-4 ">
                <div v-ripple
                     @click="() => {
                       selectedOrderItem = {product: null, index: -1}
                       orderProcess = 'product'
                     }"
                     class="app-cart-grey flex content-center justify-center q-ma-sm relative-position cursor-pointer"
                     style="height: 70px">
                  <div class="text-subtitle1 text-bold">
                    {{ $t('base.backToProducts') }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div v-if="orderProcess === 'chooseWaiter'" class="col-8 q-pa-xs">
        <q-card flat square>
          <q-card-section class="q-pb-sm">
            <div class="text-subtitle1 text-bold">
              {{ $t('base.chooseWaiter') }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-virtual-scroll
              :items="turkishAlphabet"
              virtual-scroll-horizontal
              v-slot="{ item, index }"
            >
              <q-btn
                :key="index"
                :label="item"
                unelevated
                size="md"
                @click="onSelectAlphabet(item)"
                :class="selectedAlphabet === item ? 'is-activeBtn q-mr-sm' : 'primaryBtn q-mr-sm'"

              />
              <!--              <div-->
              <!--                :key="index"-->
              <!--                 class="q-pa-md flex justify-center text-bold content-center text-black text-uppercase cursor-pointer"-->
              <!--                 style="border-right: 1px solid #ccc; border-top: 1px solid #ccc;   height: 50px; width: 50px;"-->
              <!--              >-->
              <!--                {{ item }}-->
              <!--              </div>-->
            </q-virtual-scroll>
          </q-card-section>
          <q-card-section>
            <q-scroll-area class="full-width  " style="height: calc(100vh - 30vh); width: 100%!important;">
              <div class="row">
                <div class="col-4   q-pa-sm" v-for="(waiter,index) in filteredWaiters" :key="index">
                  <q-btn
                    :key="index"
                    @click="onSelectWaiter(waiter)"
                    size="17px"
                    :label="waiter?.name"
                    unelevated
                    class="primaryBtn full-width"
                  />
                </div>
              </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped class="scss">
.post-category {
  flex: 4;
  overflow: hidden;
  width: 100%;
  position: relative;
  height: 100%;
}

.pos__categories__inner {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  flex-wrap: wrap;
  height: calc(100vh - 80px);
  overflow: auto;
}

.pos__category {
  flex: 1 0 calc(50% - 0.9rem);
  border: 0.05rem #ccc solid;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.25rem;
  font-size: 125%;
  font-weight: 600;
  transition: background-color 200ms ease, color 200ms ease;
  white-space: normal;
  text-align: center;

}

.selectedProduct {
  background-color: #ff3568 !important;
  color: white !important;
}

.hB {
  min-height: 68px !important;
}

.hB:hover {
  background-color: #ff3568 !important;
  color: white !important;
}

.is-back {
  background-color: #e0e0e0 !important;
  color: black !important;

}
</style>
