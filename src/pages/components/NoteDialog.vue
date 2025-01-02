<template>
  <q-dialog transition-duration="100" ref="dialogRef" @hide="onDialogHide" square style="z-index: 0!important;"  position="top" backdrop-filter="blur(4px) saturate(150%)" transition-show="slide-down" transition-hide="slide-up">
    <q-card flat class="q-dialog-plugin bg-transparent" style="min-width: 700px;margin-top: 100px">
      <q-form @submit="onSubmit">
        <q-card-section class="q-pa-none">
          <SimpleKeyboardNew
            v-model="formValues.note"
            :placeholder="$t('base.note') + ' ...'"
            @onKeyPress="args => { if(args === '{enter}') { onSubmit() } }"
            type="textarea"
            inputName="note"
            :autofocus="true"
          />
        </q-card-section>
        <q-card-actions class="q-pa-none">
           <q-btn no-caps icon="save" size="lg" square class="full-width" color="blue-grey-8" unelevated :label="$t('base.save')" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {useDialogPluginComponent} from 'quasar'
import {ref} from "vue";

const props = defineProps({
  existNote: {
    type: String,
    default: () => ''
  },
  kioskBoardInputType: {
    type: String,
    default: () => 'text'
  }
})
const formValues = ref({
  note: props.existNote,
})
defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const onSubmit = async () => {
  onDialogOK(formValues.value)
}
</script>
