<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <app-header
        @trigger-draw="leftDrawerOpen = !leftDrawerOpen"
        :drawer="leftDrawerOpen"
      />
    </q-header>

    <q-page-container class="app-content-bg">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import {useTerminalStore} from "stores/terminal-store";
const terminalStore = useTerminalStore();
const {terminal} = storeToRefs(terminalStore);
import {useLayout} from "src/composables/useLayout";
import {storeToRefs} from "pinia";
import {watch} from "vue";

const {leftDrawerOpen, AppHeader} = useLayout()

// watch the terminal value
watch(terminal, (value) => {
 if (!value?.id){
  location.reload()
 }
})
</script>
