<template>
  <q-input
    v-model="input"
    :for="inputName"
    dense
    outlined
    @clear="onClearInput"
    clearable
    :placeholder="placeholder"
    :type="type"
    :class="inputClass"

    bg-color="white"
    color="secondary"
    @blur="onBlurInput"
    @focus="onFocusInput"
  >
    <!--    :autofocus="autofocus"-->
    <template v-for="slotName in slotNames" v-slot:[slotName]="props">
      <slot :name="slotName" v-bind="{ props }"/>
    </template>
  </q-input>
  <q-card style="width: 1200px !important" v-if="keyboardVisible" id="keyboard">
    <q-card-section class="q-pa-none">
      <div :class="keyboardClass" id="keyboardCard"></div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import {ref, watchEffect, nextTick, onMounted, onBeforeUnmount} from 'vue';
import SimpleKeyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import {debounce} from "quasar";
import {useRouter} from "vue-router";

const router = useRouter();
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
const isKeyboardUsing = ref(false);
const keyboard = ref(null);

const onFocusInput = () => {
  onFocusOutInput();
  keyboardVisible.value = true;
  nextTick(() => {
    setupKeyBoard();
  });
};
const onFocusOutInput = () => {
  keyboardVisible.value = false;
  keyboard.value?.destroy();
  keyboard.value = null;
};
const onBlurInput = () => {
  if (keyboardVisible.value && !isKeyboardUsing.value) {
    onFocusOutInput();
  }
}
watchEffect(() => {
  emits('update:modelValue', input.value);
});

const setupKeyBoard = () => {
  if (keyboardVisible.value && !keyboard.value) {
    keyboard.value = new SimpleKeyboard({
      onChange,
      onKeyPress,
      inputName: props.inputName,
      theme: 'hg-theme-default',
      physicalKeyboardHighlight: true,
      physicalKeyboardHighlightPress: false,
      display: {
        '{bksp}': '←',
        '{tab}': 'Tab ⇄',
        '{lock}': 'Caps Lock',
        '{enter}': 'Enter↵',
        '{shift}': '⇑Shift',
        '{space}': 'Space',
        '{close}': 'Close X ',
      },
      buttonTheme: [
        {
          class: "enterBtn",
          buttons: "{enter} {space} {shift} {lock} {tab} {bksp} {close}"
        },
        {
          class: "grayBtn",
          buttons: "{space} {shift} {bksp}"
        }
      ],
      layout: {
        default: [
          '" 1 2 3 4 5 6 7 8 9 0 * - # {bksp}',
          "{tab} q w e r t y u ı o p ğ ü [ ]",
          "{lock} a s d f g h j k l ş i , {enter}",
          "{shift} < z x c v b n m ö ç . | $ € {shift}",
          ".com @ {space} {close}",
        ],
        shift: [
          "é ! ' ^ + % & / ( ) = ? _ ~ {bksp}",
          "{tab} Q W E R T Y U I O P Ğ Ü { }",
          "{lock} A S D F G H J K L Ş İ ; {enter}",
          "{shift} > Z X C V B N M Ö Ç : \\ ` ´ {shift}",
          ".com @ {space} {close}",
        ],
      },
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
  isKeyboardUsing.value = true;
  if (button === '{shift}' || button === '{lock}') {
    handleShift();
  }
  if (button === '{enter}') {
    emits('onKeyPress', button);
  }
  if (button === '{close}') {
    onFocusOutInput();
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
  if (keyboard.value) {
    onFocusOutInput();
  }
}

const handleClickOutside = (event) => {
   if (keyboardVisible.value) {
     const inputElement = document.querySelector(
       `input[id="${props.inputName}"]`
     );
     const keyboardElement = document.getElementById('keyboardCard');
      if (
       !inputElement?.contains(event.target) &&
       !keyboardElement?.contains(event.target) &&
       keyboardVisible.value && props.type !== 'textarea'
     ) {
        onFocusOutInput();
       isKeyboardUsing.value = false;
     }
   }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);

  window.addEventListener('keydown', (e) => {
    if (document.activeElement === document.querySelector(`input[for="${props.inputName}"]`)) {
      if (e.key === 'Enter') {
        onKeyPress('{enter}');
      }
      if (e.key.length === 1) {
        if (keyboard.value && props.debounce > 300) {
          onHandleDebounce();
        }
      }
      if (e.key === 'Backspace') {
        if (keyboard.value) {
          if (props.debounce > 300) {
            onHandleDebounce();
          }
        }
      }
    }
  });
})
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

router.afterEach(() => {
  if (keyboard.value) {
    keyboard.value.destroy();
    keyboard.value = null;
  }
  keyboardVisible.value = false;
});

</script>

<style>
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

#keyboard {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1em;
  background-color: #eee;
  box-shadow: 0px -3px 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
</style>
