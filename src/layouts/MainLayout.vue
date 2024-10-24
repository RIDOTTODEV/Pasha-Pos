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
import {useLayout} from "src/composables/useLayout";

const {leftDrawerOpen, AppHeader, SidebarMenus, router} = useLayout()
</script>
