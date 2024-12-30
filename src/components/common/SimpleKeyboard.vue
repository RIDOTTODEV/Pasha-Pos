<template>
  <q-input
    ref="simpleKioskBoard"
    v-model="input"
    :for="inputName"
    @click="keyboardVisible = true"
    dense
    outlined
    @clear="onClearInput"
    clearable
    :placeholder="placeholder"
    :type="type"
    :class="inputClass"
    :autofocus="autofocus"
    bg-color="white"
    color="secondary"
  >
    <template v-for="slotName in slotNames" v-slot:[slotName]="props">
      <slot :name="slotName" v-bind="{ props }"/>
    </template>
  </q-input>

  <q-dialog
    v-model="keyboardVisible"
    transition-hide="slide-down"
    transition-show="slide-up"
    position="bottom"
    maximized
    class="simpleKeyboardDialog"
  >
    <q-card style="width: 1200px!important;">
      <q-card-section class="q-pa-none">
        <div :class="keyboardClass"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref, watchEffect, nextTick, watch, onMounted} from 'vue';
import SimpleKeyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import turkishLayout from 'simple-keyboard-layouts/build/layouts/turkish';
import {debounce} from "quasar";

const emits = defineEmits(['update:modelValue', 'onKeyPress']);
const props = defineProps({
  modelValue: {
    type: String,
    default: () => '',
  },
  label: {
    type: String,
    default: () => '',
  },
  placeholder: {
    type: String,
    default: () => '...',
  },
  inputName: {
    type: String,
    default: () => 'default',
  },
  keyboardClass: {
    type: String,
    default: () => 'simple-keyboard',
  },
  debounce: {
    type: Number,
    default: () => 300,
    required: false,
  },
  type: {
    type: String,
    default: () => 'text',
  },
  slotNames: {
    type: Array,
    default: () => [],
  },
  autofocus: {
    type: Boolean,
    default: () => false,
  },
  inputClass: {
    type: String,
    default: () => 'full-width',
    required: false
  }
});
const input = ref(props.modelValue);
const keyboardVisible = ref(false);
const keyboard = ref(null);

watchEffect(() => {
  emits('update:modelValue', input.value);
});

const setupKeyBoard = () => {
  if (keyboardVisible.value && !keyboard.value) {
    keyboard.value = new SimpleKeyboard({
      onChange,
      onKeyPress: button => {
        if (button === '{enter}') {
          onKeyPress('{Enter}');
        } else {
          onKeyPress(button);
        }
      },
      inputName: props.inputName,
      theme: 'hg-theme-default',
      physicalKeyboardHighlight: true,
      physicalKeyboardHighlightPress: true,
      display: {
        '{bksp}': '←',
        '{tab}': 'Tab ⇄',
        '{lock}': 'Caps Lock',
        '{enter}': 'Enter↵',
        '{shift}': '⇑Shift',
        '{space}': 'Space',
      },
      ...turkishLayout,
      buttonTheme: [
        {
          class: "enterBtn",
          buttons: "{enter} {space} {shift} {lock} {tab} {bksp}"
        },
        {
          class: "grayBtn",
          buttons: "{space} {shift} {bksp}"
        }
      ],
    });

    keyboard.value.setInput(input.value);
  } else if (!keyboardVisible.value && keyboard.value) {
    keyboard.value.destroy();
    keyboard.value = null;
  } else if (keyboardVisible.value && keyboard.value) {
    keyboard.value.setInput(input.value);
  }
};

const onChange = (text) => {
  input.value = text;
  emits('update:modelValue', text);
  if (props.debounce > 300) {
    onHandleDebounce();
  }
};

const onHandleDebounce = debounce(() => {
  if (keyboardVisible.value) {
    onKeyPress('{enter}');
  }
}, props.debounce);

const onKeyPress = (button) => {
  if (button === '{shift}' || button === '{lock}') {
    handleShift();
  }
  if (button === '{Enter}') {
    keyboard.value?.destroy();
    keyboardVisible.value = false;
  }
  if (button === '{enter}'){
    emits('onKeyPress', button);
  }
};

const handleShift = () => {
  if (keyboard.value) {
    keyboard.value.setOptions({
      layoutName: keyboard.value.options.layoutName === 'default' ? 'shift' : 'default',
    });
  }
};

const onClearInput = () => {
  input.value = '';
  emits('update:modelValue', '');
  emits('onKeyPress', '{enter}');
}

const onHandleBackspace = () => {
  let inputText = input.value;
  input.value = inputText?.slice(0, -1);
  onChange(input.value);
  keyboard.value.setInput(input.value);
}

watch(keyboardVisible, () => {
  nextTick(() => {
    setupKeyBoard();
  });
});
watch(() => props.inputName, (inputName) => {
  if (keyboard.value) {
    keyboard.value.setOptions({inputName});
  }
});
watch(() => keyboardVisible.value, (showDialog) => {
  if (!showDialog) {
    keyboard.value?.destroy();
    keyboardVisible.value = false;
    emits('onKeyPress', '{enter}');
  }
});
watch(() => props.modelValue, (value) => {
  input.value = value;
  if (keyboard.value) {
    keyboard.value.setInput(value);
  }
});


onMounted(() => {
  if (props.autofocus) {
    setTimeout(() => {
      keyboardVisible.value = true;
    }, 100)
  }
  // Handle backspace key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      if (keyboard.value) {
        onHandleBackspace();
      }
    }
  });
})
</script>

<style>
.simple-keyboard.myTheme1 {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 0;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

.simple-keyboard.myTheme1 .hg-button {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}

.simple-keyboard.myTheme1 .hg-button:active {
  background: #1c4995;
  color: white;
}

#root .simple-keyboard.myTheme1 + .simple-keyboard-preview {
  background: #1c4995;
}

.simpleKeyboardDialog .q-dialog__backdrop {
  background: none !important;
}

.enterBtn {
  background: #ff3568 !important;
  color: white !important;

}

.grayBtn {
  background: #b0bec5 !important;
  color: black !important;
}

.hg-button {
  height: 60px !important;
  font-weight: 700 !important;
}

.hg-theme-default .hg-button span {
  font-size: 20px !important;
  font-weight: 550 !important;
}
</style>
