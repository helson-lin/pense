<template>
  <div v-if="showMessage" class="message">{{ message }}</div>
</template>
<script setup>
import { ref } from 'vue'
const message = ref(null)
const showMessage = ref(false)
const show = ({ value, duration }) => {
  message.value = value
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, duration || 200)
}
</script>
<style lang="less" scoped>
.message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px 10px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 10px;
  z-index: 33;
}
</style>
