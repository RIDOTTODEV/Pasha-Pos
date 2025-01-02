<script setup>
import {useAuth} from "src/composables/useAuth";
const {formValues,terminals, showTerminals, signInByUUid} = useAuth()

</script>

<template>
  <q-page class="q-pa-md row">
    <div class="col-6 flex">
      <q-card flat class="flex flex-center full-width" style="margin-right: 10px!important;">
        <q-card-section>
          <div class="text-h4 text-center">
            <q-img src="/assets/ruby-login-logo.png" width="220px"/>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-6 flex  bg-transparent">
      <q-card flat class=" bg-transparent flex flex-center full-width" style="margin-left: 10px!important;">
        <q-card-section>
          <q-form @submit="signInByUUid" ref="qForm" style="width: 500px">
            <q-select
              v-model="formValues.uid"
              :options="terminals"
              :label="$t('base.selectTerminal')"
              @clearValue="formValues.uid = ''"
              emit-value
              map-options
              outlined
              dense
              bg-color="white"
              option-value="uid"
              option-label="name"
              class="q-mb-md"
              color="secondary"
              v-if="showTerminals"

              />
            <div class="col-12">
              <div class="text-subtitle2 text-bold q-mb-xs" @click="showTerminals = !showTerminals">
                {{$t('base.pleaseEnterUuid')}}
                <span class="text-negative">*</span>
              </div>

              <SimpleKeyboardNew
                v-model="formValues.uid"
                :placeholder="'UUID ...'"
                inputName="password"
                :slot-names="['append']"
                @onKeyPress="args => { if(args === '{enter}') { signInByUUid() } }"
              >
                <template v-slot:append>
                  <q-icon name="password" />
                </template>
              </SimpleKeyboardNew>
            </div>
            <div class="col-12">
              <q-btn unelevated  :label="$t('base.login')" class="q-mt-md full-width  " color="secondary"  type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>

</template>

<style scoped>

</style>
