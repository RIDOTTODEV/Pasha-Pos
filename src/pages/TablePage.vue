<script setup>
import {useCatalog} from "src/composables/useCatalog";
import {textCapitalize} from "src/utils/helpers";
import {onMounted} from "vue";

const {
  onSelectSection,
  getOrderSections,
  selectedSection,
  onSelectTable,
  selectedSectionTables,
  selectedTable
} = useCatalog();
onMounted(() => {
  selectedTable.value = null
  selectedSection.value = null
})

</script>

<template>
  <q-page class="q-pa-md">
    <q-card flat class=" ">
      <q-card-section class="">
        <div class="flex justify-center">
          <q-btn
            v-for="(item, index ) in getOrderSections"
            size="20px"
            @click="onSelectSection(item)"
            :key="index"
            :label="item?.name"
            unelevated
            no-caps
            :class="item?.id === selectedSection?.id  ? 'q-mr-sm is-activeBtn q-mt-sm' : 'q-mr-md q-mt-sm '"
            color="blue-grey-8"
          />
        </div>
        <div class="row q-mt-md">
          <q-scroll-area  style="height: calc(100vh - 20vh); width: 100%!important;"  >
            <div class="row">
              <div class="col-2 q-pr-md q-pl-md q-pb-md" v-for="(table,index) in selectedSectionTables" :key="index">
                <q-btn
                  no-caps
                  @click="onSelectTable(table)"
                  size="17px"
                  :label="textCapitalize(table?.name)"
                  unelevated
                  :class="table?.id === selectedTable?.id  ? ' is-activeBtn full-width' : '    full-width'"
                  color="grey-4"
                  text-color="dark"
                />
              </div>
            </div>
          </q-scroll-area>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>

</style>
