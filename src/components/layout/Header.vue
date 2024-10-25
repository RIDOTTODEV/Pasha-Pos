<script setup>
import ProgressBar from "components/common/ProgressBar.vue";
import KioskBoardInput from "components/common/KioskBoardInput.vue";
import Timer from "components/common/Timer.vue";
import {useI18n} from "vue-i18n";
const {locale} = useI18n({useScope: "global"});

defineProps({
  drawer: {
    type: Boolean,
    required: true
  }
})
import {useLayout} from "src/composables/useLayout";
const { locales, themeStore, router,searchInput,$q,terminal,showResults,searchResults,showUpdateProgressBar, progressDuration,onClickLogout,onSubmitSearch,onClearSearchInput,onClickExitApp} = useLayout();
const onTimeOut = () => {
  location.reload()
}
</script>

<template>

  <div class="row menuTopBorder menuBottomShadow headerMenuBar">
    <div class="row col-12" v-if="showUpdateProgressBar"  >
      <progress-bar :duration="progressDuration" @timeOut="onTimeOut"  />
    </div>
    <div class="row col-12 q-pa-xs ">
      <div class="row col-12">
        <div class="col-md-5 col-sm-12 col-xs-12 row content-center">
          <div class="col-5 flex justify-center items-center content-center">
            <q-img
              :src="$q.dark.isActive ? '/assets/logo.png' : '/assets/logo-dark.png'"
              alt="Logo"
              class="logo"
              width="200px"
              @click="router.push({name:'home'})"
            />
          </div>
          <div class="col-7">
            <Timer :terminal-name="terminal?.name"/>
          </div>
        </div>
        <div class="col-3 flex items-center  ">
          <KioskBoardInput
            prepend-icon="search"
            :showPrepend="true"
            :placeholder="$t('base.search') + '...'"
            v-model="searchInput"
            @close-modal="onSubmitSearch"
            @clear-value="onClearSearchInput"

          />
          <q-popup-proxy style="width: 430px"  context-menu v-model="showResults"  transition-show="flip-up" transition-hide="flip-down"  >
            <q-list bordered separator >
              <q-item dense class="row" clickable v-ripple v-for="(result,index) in searchResults" :key="index">
                <q-item-section class="col-12 text-center">
                  <q-item-label>{{result.adsoyad}}</q-item-label>
                  <q-item-label caption lines="2"> {{$t('base.memberId')}} {{result.memberid}}</q-item-label>
                  <q-item-label caption lines="3">  {{$t('base.playerId')}} {{result.playerId}}</q-item-label>
                  <q-item-label caption lines="4"> {{result.tableType}} - {{result.tableName}}</q-item-label>
                </q-item-section >

              </q-item>
            </q-list>
          </q-popup-proxy>
        </div>
        <div class=" col-4 col-4 col-4 flex row no-wrap ">
          <div class="col-12 flex justify-end  items-center ">
            <q-btn
              unelevated
              :label="$t('base.home')"
              class="q-mr-md hB primaryBtn"
              @click="router.push({name:'home'})"
              no-caps
            />
            <q-btn
              unelevated
              :label="$t('base.settings')"
              class="q-mr-md hB primaryBtn"
              @click="router.push({name:'settings'})"
              no-caps
            />
            <q-btn
              unelevated
              :label="$t('base.logout')"
              class="q-mr-md hB primaryBtn"
              @click="onClickLogout"
              no-caps
            />
            <q-btn
              unelevated
              :label="$t('base.exist')"
              class="hB primaryBtn "
              @click="onClickExitApp"
              no-caps
            />
            <q-select
              v-model="themeStore.selectedLocale"
              :options="locales"
              @update:model-value="() => {
             locale = themeStore.selectedLocale.lang
             themeStore.setLocale(themeStore.selectedLocale.lang)
             }"
              dense
              borderless
              class="q-ml-md"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      <q-img
                        :src="scope.opt.iconPath"
                        fit="contain"
                        width="20px"
                        height="20px"
                        class="q-mr-sm"
                      />
                      {{ scope.opt.title }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <div class="text-subtitle2  ">
                  <q-img
                    :src="scope.opt.iconPath"
                    fit="contain"
                    width="20px"
                    height="20px"
                    class="q-mr-sm"
                  />

                </div>
              </template>
            </q-select>
            <!--            <q-btn-->
            <!--              flat-->
            <!--              :icon="$q.dark.isActive ? 'far fa-moon' : 'far fa-moon'"-->
            <!--              unelevated-->
            <!--              @click="toggleDarkMode"-->
            <!--              :color="$q.dark.isActive ? 'warning' : ''"-->
            <!--              class="hB"-->
            <!--            />-->

            <!--            <q-btn-->
            <!--              flat-->
            <!--              @click="$q.fullscreen.toggle()"-->
            <!--              :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"-->
            <!--              class="hB"-->
            <!--            />-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hB {
  max-height: 38px !important;
}
</style>
