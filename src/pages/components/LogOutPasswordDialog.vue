<template>
  <q-dialog no-esc-dismiss persistent transition-duration="100" ref="dialogRef" @hide="onDialogHide" square style="z-index: 0!important;"  position="top" backdrop-filter="blur(4px) saturate(150%)" transition-show="slide-down" transition-hide="slide-up">
    <q-card  square flat class="q-dialog-plugin bg-transparent" style="min-width: 700px;margin-top: 100px">
      <q-form @submit="onSubmit">
        <q-card-section class="q-pa-none">
          <KioskBoardInput
            square
            @close-modal="onSubmit"
            :autofocus="true"
            :type="kioskBoardInputType"
            v-model="formValues.password"
            :label="$t('base.note')"
            :rules="[val => !val  || $t('base.requiredField',{fieldName: $t('base.password')})]"

          />
        </q-card-section>
        <q-card-actions class="q-pa-none flex justify-end  q-mt-sm text-right">
          <q-btn no-caps icon="cancel" size="lg" square  @click="onDialogCancel"  color="negative" unelevated :label="$t('base.cancel')" type="button"/>
          <q-btn no-caps icon="save" size="lg" square   color="blue-grey-8" unelevated :label="$t('base.confirmPassword')" type="submit"/>
        </q-card-actions>
      </q-form>
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
  }
})
const formValues = ref({
  password: '',
})
defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const onSubmit = async () => {
  onDialogOK(formValues.value)
}
</script>
