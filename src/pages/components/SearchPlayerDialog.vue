<template>
  <q-dialog transition-duration="100" ref="dialogRef" @hide="onDialogHide" square style="z-index: 0!important;"  position="top" backdrop-filter="blur(4px) saturate(150%)" transition-show="slide-down" transition-hide="slide-up">
    <q-card flat class="q-dialog-plugin bg-transparent" style="min-width: 700px;margin-top: 100px">
      <div>
        <q-card-section class="q-pa-none">
          <SimpleKeyboardNew
            v-model="formValues.searchString"
            :debounce="1000"
            :placeholder="$t('base.search') + ' ...'"
            @onKeyPress="args => { if(args === '{enter}') { onSubmitSearchPlayer() } }"
            :slot-names="['append']"
            input-name="searchPlayer"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </SimpleKeyboardNew>
        </q-card-section>
        <q-card-section v-if="searchedPlayers.length" class="bg-white">
          <q-list dense  separator padding class="rounded-borders q-pt-sm">
            <q-item @click="onSelectPlayer(player)" clickable  v-ripple v-for="(player,index) in searchedPlayers" :key="index" class="">
              <q-item-section>
                <q-item-label> <span class="text-bold">{{index+1}}.</span> {{player.fullName}} <span class="text-negative q-ml-md">#{{player.id}}</span></q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {useDialogPluginComponent} from 'quasar'
import {ref} from "vue";

const props = defineProps({
  kioskBoardInputType: {
    type: String,
    default: () => 'text'
  },
  searchFn: {
    type: Function,
    default: () => {}
  }
})
const formValues = ref({
  searchString: '',
})
defineEmits([
  ...useDialogPluginComponent.emits
])
const searchedPlayers = ref([])
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const onSubmitSearchPlayer = async () => {

  await props.searchFn({...formValues.value}).then(res => {
    searchedPlayers.value = res || []
  })

}
const onSelectPlayer = async (player) => {

  onDialogOK(player)
}
</script>
