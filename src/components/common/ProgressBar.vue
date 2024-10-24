<script setup>
import { ref} from "vue";
const emits = defineEmits(['timeOut'])
const props = defineProps({
  duration:{
    type:Number,
    default: () => 1000,
    required: true
  },
})
const progress = ref(0)
const updateInterval = ref(100)
const step = (updateInterval.value / props.duration)
const interval = setInterval(() => {
  progress.value += step
  if (progress.value >= 1){
    clearInterval(interval)
    emits('timeOut')
  }
}, updateInterval.value)


</script>

<template>
  <q-linear-progress stripe size="15px"  :value="progress" color="negative">
    <div class="absolute-full flex flex-center">
      <q-badge color="white"  text-color="accent" :label="Math.round(progress * 100) +'%'" />
    </div>
  </q-linear-progress>
</template>

<style scoped>

</style>
