<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss no-esc-dismiss square
            backdrop-filter="blur(4px) saturate(150%)" transition-show="slide-up" transition-hide="slide-down">
    <q-card class="q-dialog-plugin q-pa-none" style="min-width: 700px">
      <q-card-section class="q-pt-none q-pr-none q-pl-none">
        <progress-bar :duration="totalTime" @timeOut="onTimeOut"/>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">
          <q-btn icon="o_settings" color="warning" text-color="dark" unelevated/>
          {{ $t('base.generalUpdate') }}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle1 ">
          {{ $t('base.generalUpdateMessage') }}
        </div>
      </q-card-section>
      <q-card-section class="row">
        <div class="col-8">
          <q-btn
            v-for="(time,index) in times"
            :key="index"
            :label="$t(time.label)"
            @click="onDialogOK(time.value)"
            color="blue-grey-8"
            unelevated
            class="q-mr-md"
            outline
            no-caps
          />
        </div>
        <div class="col-4 text-right">
          <q-btn
            :label="$t('base.cancel')"
            @click="onDialogOK(times[times.length -1].value)"
            color="negative"
            icon="clear"
            unelevated
            class="q-mr-md"
            no-caps
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import ProgressBar from "components/common/ProgressBar.vue";
import {useDialogPluginComponent} from 'quasar'
import {ref} from "vue";

defineEmits([
  ...useDialogPluginComponent.emits
])

const times = ref([
  {
    label: 'base.now',
    value: 1000
  },
  {
    label: 'base.oneMinute',
    value: 1000 * 60
  },
  {
    label: 'base.fiveMinutes',
    value: 1000 * 60 * 5
  }
])
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const totalTime = ref(times.value[2].value)

const onTimeOut = () => {
  location.reload()
}
</script>
