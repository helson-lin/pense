<template>
  <div :class="{ message: true, 'show-message': showMessage, 'hidden-message': !showMessage }">
    {{ message }}
  </div>
</template>
<script>
import { ref, defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const message = ref('')
    const showMessage = ref(false)
    const show = ({ value, duration }) => {
      message.value = value
      showMessage.value = true
      setTimeout(() => {
        showMessage.value = false
      }, duration || 200)
    }
    return {
      message,
      showMessage,
      show
    }
  }
})
</script>
<style lang="less" scoped>
.message {
  position: fixed;
  top: -3rem;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px 10px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 0.7rem;
  z-index: 33;
  width: max-content;
  height: max-content;
  padding: 0.2rem 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.34, 0.45, 0.82, 1.13);

  &.show-message {
    top: 2.5rem;
    visibility: visible;
  }
  &.hidden-message {
    visibility: hidden;
  }
}
</style>
