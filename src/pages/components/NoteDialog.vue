<template>
  <q-dialog transition-duration="100" ref="dialogRef" @hide="onDialogHide" square style="z-index: 0!important;"  position="top" backdrop-filter="blur(4px) saturate(150%)" transition-show="slide-down" transition-hide="slide-up">
    <q-card flat class="q-dialog-plugin" style="min-width: 700px;margin-top: 100px">
      <q-form @submit="onSubmit">
        <q-card-section class="q-pa-none">
          <KioskBoardInput
            square
            @close-modal="onSubmit"
            :autofocus="true"
            :type="kioskBoardInputType"
            v-model="formValues.note"
            :label="$t('base.note')"
            :rules="[val => !val  || $t('base.requiredField',{fieldName: $t('base.note')})]"
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
