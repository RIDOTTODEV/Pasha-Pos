<script setup>
import {ref} from "vue";

defineProps({
  terminalName: {
    type: String,
    required: false,
    default: () => 'Terminal'
  }
})
const time = ref(new Date().toLocaleTimeString());
setInterval(() => {
  time.value = new Date().toLocaleTimeString();
}, 1000);
const date = ref(new Date().toDateString());
</script>

<template>
  <q-card flat class="bg-transparent" square>
    <q-card-section class="q-pa-none">
      <div class="row q-pa-xs q-pb-none">
        <div class="col-6 row flex ">
          <q-btn icon="alarm" unelevated/>
          <div class="text-subtitle1 text-bold " style="width: 100px!important;">
            {{ time }}
            <div class="text-caption " style="margin-top: -5px; ">
              {{ date }}
            </div>
          </div>
        </div>
        <div class="col-6 flex content-center justify-center ">
          <q-chip square icon="storefront"> {{ terminalName }}</q-chip>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">

</style>
