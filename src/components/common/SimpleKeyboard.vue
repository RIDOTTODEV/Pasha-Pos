<script setup>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import {onMounted, ref, watch} from "vue";
const props = defineProps({
  keyboardClass: {
    type: String,
    required: false,
    default: () => "simple-keyboard"
  },
  input:{
    type: String,
    required: false,
    default: () => ""
  }
})
const emits = defineEmits(['onChange', 'onKeyPress'])
const keyboard = ref(null)
onMounted(() => {
  keyboard.value = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    layout: {
      default: [
        "1 2 3 4 5 6 7 8 9 0 {bksp}",
        "q w e r t y u i o p",
        "a s d f g h j k l",
        "{shift} z x c v b n m . {shift}",
        "{space}"
      ],
      shift: [
        "1 2 3 4 5 6 7 8 9 0 {bksp}",
        "Q W E R T Y U I O P",
        "A S D F G H J K L",
        "{shift} Z X C V B N M . {shift}",
        "{space}"
      ]
    },
    display: {
      "{bksp}": "backspace",
      "{shift}": "shift",
      "{space}": "space"
    }
  });
  keyboard.value.setInput(props.input)
})
const onChange = (input) => {
  emits('onChange',input)
}
const onKeyPress = (button) => {
  emits('onKeyPress',button)
  if (button === "{shift}" || button === "{lock}") handleShift();
}
const handleShift = () => {
  let currentLayout = keyboard.value.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";
  keyboard.value.setOptions({
    layoutName: shiftToggle
  });
}

// watch for changes in input prop
watch(() => props.input, (newVal) => {
  keyboard.value.setInput(newVal)
})
</script>

<template>
  <div :class="keyboardClass"></div>

</template>

<style scoped>

</style>
