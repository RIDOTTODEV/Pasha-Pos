<script setup>
import {useSettings} from "src/composables/useSettings";
import {textCapitalize} from "../utils/helpers";
const {
  settingTabs,
  settingTab,
  $q,
  settings,
  terminal,
  tags,
  sections,
  isPwd,
  getTerminalMenuNames,
  AppVersion,
  updateSecuritySettings,
  updateWaitingOrderSettings,
  saveThemeLocalSettings,
  updateEnvironmentSettings
} = useSettings()
</script>

<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-2 q-pa-sm">
        <q-card flat >
          <q-card-section>
            <div class="text-h5 tex-bold text-center app-cart-grey q-card--bordered flex items-center content-center justify-center" style="height: 50px">
              {{$t('settings.settingMenus')}}
            </div>
            <q-tabs
              v-model="settingTab"
              vertical
              :active-color="$q.dark.isActive ? 'grey-1' : 'grey-10'"
              :active-bg-color="$q.dark.isActive ? 'grey-9' : 'grey-2'"
              inline-label
              outside-arrows
              align="left"
            >
              <q-tab v-for="(tab,index) in settingTabs" :key="index"  :name="tab"   :label="$t('settings.'+tab)" />
            </q-tabs>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-10 q-pa-sm">
        <q-card flat>
          <q-card-section>
            <q-tab-panels
              v-model="settingTab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="security" class="q-pt-xs">
                <div class="row">
                  <div class="col-12">
                    <div class="text-h5   q-mb-xs">{{$t('settings.security')}}</div>
                  </div>
                  <div class="col-12 q-mb-xs">
                    <q-separator size="0.1rem"/>
                  </div>
                  <div class="col-12">
                    <q-form @submit="updateSecuritySettings()">
<!--                     <div class="row">-->
<!--                       <div class="col-3 flex content-center">-->
<!--                         <div class="text-subtitle1 text-bold">-->
<!--                           {{$t('settings.autoLogin')}}-->
<!--                         </div>-->
<!--                       </div>-->
<!--                       <div class="col-9">-->
<!--                         <q-toggle  unchecked-icon="clear"  checked-icon="check" size="lg" color="secondary" v-model="terminal.autoLogIn" :label="terminal.autoLogIn ? $t('base.active') : $t('base.passive')" />-->
<!--                       </div>-->
<!--                     </div>-->
                      <div class="row">
                        <div class="col-3 flex content-center">
                          <div class="text-subtitle1 text-bold">
                            {{$t('settings.saveTerminalSettings')}}
                          </div>
                        </div>
                        <div class="col-9">
                          <q-toggle  unchecked-icon="clear"  checked-icon="check" size="lg" color="secondary" v-model="terminal.saveTerminalSettings" :label="terminal.saveTerminalSettings ? $t('base.active') : $t('base.passive')" />
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12 text-right">
                          <q-btn :label="$t('base.save')" icon="save" color="blue-grey-8" unelevated type="submit" class=" "/>
                        </div>
                      </div>
                    </q-form>
                  </div>
                </div>
               </q-tab-panel>
              <q-tab-panel name="waitingOrders">
                <div class="row">
                  <div class="col-12">
                    <div class="text-h5   q-mb-xs">{{$t('settings.waitingOrders')}}</div>
                  </div>
                  <div class="col-12 q-mb-xs">
                    <q-separator size="0.1rem"/>
                  </div>
                  <div class="col-12">
                    <q-form @submit="updateWaitingOrderSettings()">
                      <div class="row q-mt-md">
                        <div class="col-2 ">
                          <div class="row flex justify-between content-end"  >
                            <div class="text-subtitle2 flex items-center" style="height: 50px">
                              {{$t('base.sortByState')}}
                            </div>
                            <q-toggle
                              v-model="terminal.sortByState"
                              color="secondary"
                              size="lg"
                              checked-icon="check"
                              unchecked-icon="clear"
                            />
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="text-subtitle2 flex items-center"  >
                            {{$t('base.password')}}
                          </div>
                          <SimpleKeyboardNew
                            v-model="terminal.password"
                            :placeholder="$t('base.password') + ' ...'"
                            inputName="password"
                            :slot-names="['append']"
                            :type="isPwd ? 'password':'text'"
                          >
                            <template v-slot:append>
                              <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                              />
                            </template>
                          </SimpleKeyboardNew>
                        </div>
                        <div class="col-6 text-right">
                          <q-btn :label="$t('base.save')" icon="save" color="blue-grey-8" unelevated type="submit" class=" "/>
                        </div>
                      </div>
                     <div class="row">
                       <div class="col-2">
                          <div class="text-h6 text-bold">
                            {{$t('base.tags')}}
                          </div>
                       </div>
                       <div class="col-2 flex justify-center">
                         <div class="text-h6 text-bold">
                           {{$t('base.restore')}}
                         </div>
                       </div>
                       <div class="col-3">
                         <div class="text-h6 text-bold">
                           {{$t('base.askPasswordRestoring')}}
                         </div>
                       </div>
                       <div class="col-2">
                         <div class="text-h6 text-bold">
                           {{$t('base.sections')}}
                         </div>
                       </div>
                     </div>
                      <div class="row">
                        <div class="col-2">
                          <div class="row flex justify-between" v-for="(tag,index) in tags" :key="index">
                            <div class="text-subtitle2 flex items-center" style="height: 50px">
                              {{tag.name}}
                            </div>
                            <q-toggle
                              :key="index"
                              v-model="terminal.tags"
                              color="secondary"
                              size="lg"
                              :val="tag.id"
                              checked-icon="check"
                              unchecked-icon="clear"
                            />
                          </div>
                        </div>
                        <div class="col-2">
                          <div class="row flex justify-center" v-for="(tag,index) in tags" :key="index">
                            <q-toggle
                              :key="index"
                              v-model="terminal.restore"
                              color="secondary"
                              size="lg"
                              :val="tag.id"
                              checked-icon="check"
                              unchecked-icon="clear"
                            />
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="row flex justify-center" v-for="(tag,index) in tags" :key="index">
                            <q-toggle
                              :key="index"
                              v-model="terminal.askPasswordRestoring"
                              color="secondary"
                              size="lg"
                              :val="tag.id"
                              checked-icon="check"
                              unchecked-icon="clear"
                            />
                          </div>
                        </div>
                        <div class="col-2">
                          <div class="row flex justify-between" v-for="(section,index) in sections" :key="index">
                            <div class="text-subtitle2 flex items-center" style="height: 50px">
                              {{section.name}}
                            </div>
                            <q-toggle
                              :key="index"
                              v-model="terminal.sections"
                              color="secondary"
                              size="lg"
                              :val="section.id"
                              checked-icon="check"
                              unchecked-icon="clear"
                            />
                          </div>
                        </div>
                      </div>

                    </q-form>
                  </div>
                </div>

                 </q-tab-panel>
              <q-tab-panel name="newOrder">
                <div class="row">
                  <div class="col-12">
                    <div class="text-h5   q-mb-xs">{{$t('settings.newOrder')}}</div>
                  </div>
                  <div class="col-12 q-mb-xs">
                    <q-separator size="0.1rem"/>
                  </div>
                  <div class="col-12">
                    <q-form @submit="saveThemeLocalSettings()">
<!--                      <div class="row">-->
<!--                        <div class="col-3 flex content-center">-->
<!--                          <div class="text-subtitle1 text-bold">-->
<!--                            {{$t('settings.redirectTo')}}-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-9">-->
<!--                         <q-select-->
<!--                           :options="[{label: $t('base.home'), value: 'home'},{label: $t('base.table'), value: 'table'},{label: $t('base.order'), value: 'order'}]"-->
<!--                            v-model="settings.newOrder.redirectTo"-->
<!--                            outlined-->
<!--                            dense-->
<!--                            class="super-small"-->
<!--                           option-value="value"-->
<!--                            option-label="label"-->
<!--                           style="width: 300px"-->
<!--                           />-->
<!--                        </div>-->
<!--                      </div>-->
<!--                      <div class="row">-->
<!--                        <div class="col-3 flex content-center">-->
<!--                          <div class="text-subtitle1 text-bold">-->
<!--                            {{$t('settings.ticketNote')}}-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-9">-->
<!--                          <q-toggle  unchecked-icon="clear"  checked-icon="check" size="lg" color="secondary" v-model="settings.newOrder.ticketNote" :label="settings.newOrder.ticketNote ? $t('base.active') : $t('base.passive')" />-->
<!--                        </div>-->
<!--                      </div>-->
<!--                      <div class="row">-->
<!--                        <div class="col-3 flex content-center">-->
<!--                          <div class="text-subtitle1 text-bold">-->
<!--                            {{$t('settings.orderNote')}}-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-9">-->
<!--                          <q-toggle  unchecked-icon="clear"  checked-icon="check" size="lg" color="secondary" v-model="settings.newOrder.orderNote" :label="settings.newOrder.orderNote ? $t('base.active') : $t('base.passive')" />-->
<!--                        </div>-->
<!--                      </div>-->
<!--                      <div class="row">-->
<!--                        <div class="col-3 flex content-center">-->
<!--                          <div class="text-subtitle1 text-bold">-->
<!--                            {{$t('settings.customerSelect')}}-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-9">-->
<!--                          <q-toggle  unchecked-icon="clear"  checked-icon="check" size="lg" color="secondary" v-model="settings.newOrder.customerSelect" :label="settings.newOrder.customerSelect ? $t('base.active') : $t('base.passive')" />-->
<!--                        </div>-->
<!--                      </div>-->
<!--                      <div class="row">-->
<!--                        <div class="col-3 flex content-center">-->
<!--                          <div class="text-subtitle1 text-bold">-->
<!--                            {{$t('settings.waiterSelect')}}-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-9">-->
<!--                          <q-toggle  unchecked-icon="clear"  checked-icon="check" size="lg" color="secondary" v-model="settings.newOrder.waiterSelect" :label="settings.newOrder.waiterSelect ? $t('base.active') : $t('base.passive')" />-->
<!--                        </div>-->
<!--                      </div>-->
                      <div class="row">
                        <div class="col-3 flex content-center">
                          <div class="text-subtitle1 text-bold">
                            {{$t('settings.ringTone')}}
                          </div>
                        </div>
                        <div class="col-9">
                          <q-toggle  unchecked-icon="clear"  checked-icon="check" size="lg" color="secondary" v-model="settings.newOrder.ringTone" :label="settings.newOrder.ringTone ? $t('base.active') : $t('base.passive')" />
                        </div>
                      </div>
<!--                      <div class="row">-->
<!--                        <div class="col-3 flex content-center">-->
<!--                          <div class="text-subtitle1 text-bold">-->
<!--                            {{$t('settings.extensionId')}}-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-9">-->
<!--                          <q-input v-model="settings.newOrder.extensionId"  type="text" outlined dense class="super-small" style="width: 300px"/>-->
<!--                         </div>-->
<!--                      </div>-->
                      <div class="row">
                        <div class="col-12 text-right">
                          <q-btn :label="$t('base.save')" icon="save" color="blue-grey-8" unelevated type="submit" class=" "/>
                        </div>
                      </div>
                    </q-form>
                  </div>
                </div>
                </q-tab-panel>
              <q-tab-panel name="environments">
                <div class="row">
                  <div class="col-12">
                    <div class="text-h5   q-mb-xs">{{$t('settings.security')}}</div>
                  </div>
                  <div class="col-12 q-mb-xs">
                    <q-separator size="0.1rem"/>
                  </div>
                  <div class="col-12">
                    <q-form @submit="updateEnvironmentSettings()">
                      <div class="row">
                        <div class="col-3 flex content-center">
                          <div class="text-subtitle1 text-bold">
                            {{$t('settings.appUrl')}}
                          </div>
                        </div>
                        <div class="col-9">
                          <q-input disable v-model="terminal.appUrl" outlined dense class="super-small" style="width: 300px"/>
                         </div>
                      </div>
                      <div class="row q-mt-md">
                        <div class="col-3 flex content-center">
                          <div class="text-subtitle1 text-bold">
                            {{$t('settings.ridottoApiUrl')}}
                          </div>
                        </div>
                        <div class="col-9">
                          <q-input disable v-model="terminal.ridottoApiUrl" outlined dense class="super-small" style="width: 300px"/>
                         </div>
                      </div>
                      <div class="row q-mt-md">
                        <div class="col-3 flex content-center">
                          <div class="text-subtitle1 text-bold">
                            {{$t('settings.assistApiUrl')}}
                          </div>
                        </div>
                        <div class="col-9">
                          <q-input disable v-model="terminal.assistApiUrl" outlined dense class="super-small" style="width: 300px"/>
                         </div>
                      </div>
                    <div class="row q-mt-md">
                        <div class="col-3 flex content-center">
                          <div class="text-subtitle1 text-bold">
                            {{$t('settings.playersLastOrderCount')}}
                          </div>
                        </div>
                        <div class="col-9">
                          <q-input v-model="terminal.playersLastOrderCount"  type="number" outlined dense class="super-small" style="width: 300px"/>
                         </div>
                      </div>

                      <div class="row">
                        <div class="col-12 text-right">
                          <q-btn :label="$t('base.save')" icon="save" color="blue-grey-8" unelevated type="submit" class=" "/>
                        </div>
                      </div>
                    </q-form>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="info">
                <div class="row">
                  <div class="col-12">
                    <div class="text-h5   q-mb-xs">{{$t('settings.info')}}</div>
                  </div>
                  <div class="col-12 q-mb-xs">
                    <q-separator size="0.1rem"/>
                  </div>
                  <div class="col-12">
                    <div class="row q-mt-md">
                      <div class="col-3 flex content-center">
                        <div class="text-subtitle1 text-bold">
                          {{$t('terminal.terminalName')}}
                        </div>
                      </div>
                      <div class="col-9">
                        <q-input disable v-model="terminal.name" outlined dense class="super-small" style="width: 300px"/>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row q-mt-md">
                      <div class="col-3 flex content-center">
                        <div class="text-subtitle1 text-bold">
                          {{$t('terminal.terminalUuid')}}
                        </div>
                      </div>
                      <div class="col-9">
                        <q-input disable v-model="terminal.uid" outlined dense class="super-small" style="width: 300px"/>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row q-mt-md">
                      <div class="col-3 flex content-center">
                        <div class="text-subtitle1 text-bold">
                          {{$t('terminal.menuNames')}}
                        </div>
                      </div>
                      <div class="col-9">
                        <q-chip icon="check" square  v-for="(menu,index) in getTerminalMenuNames" :key="index">{{textCapitalize(menu)}}</q-chip>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row q-mt-md">
                      <div class="col-3 flex content-center">
                        <div class="text-subtitle1 text-bold">
                          {{$t('terminal.loginUserName')}}
                        </div>
                      </div>
                      <div class="col-9">
                      <div class="text-subtitle1">Admin</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row q-mt-md">
                      <div class="col-3 flex content-center">
                        <div class="text-subtitle1 text-bold">
                          {{$t('terminal.applicationVersion')}}
                        </div>
                      </div>
                      <div class="col-9">
                        <div class="text-subtitle1">{{AppVersion}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<style scoped>

</style>
