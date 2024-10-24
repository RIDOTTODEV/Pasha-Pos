<template>
  <q-page class="q-pa-md row">
    <div class="col-6 flex">
      <q-card @click="router.push({name:'table'})" flat class="card flex flex-center full-width" style="margin-right: 10px!important;">
        <q-card-section>
          <div class="text-h4 text-center">
            {{$t('base.newOrder')}}
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-6 flex  ">
      <q-card @click="router.push({name:'orders'})"  flat class="card flex flex-center full-width" style="margin-left: 10px!important;" >
        <q-card-section>
          <div class="text-h4 text-center">
            {{$t('base.orders')}}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import {useRouter} from "vue-router";
const router = useRouter();
</script>
<style lang="scss" scoped>

</style>
