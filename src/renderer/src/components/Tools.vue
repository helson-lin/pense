<template>
  <div :class="['tools', show ? 'tools-show' : 'tools-hidden']">
    <div
      v-for="toolItem in toolsMap"
      :key="toolItem"
      :class="[
        'tool',
        toolItem.key === activeKey ? toolItem.activeAnimate : toolItem.defaultAnimte
      ]"
      @click="effect(toolItem.key)"
    >
      <SvgIcon :name="toolItem.key === activeKey ? toolItem.activeIcon : toolItem.defaultIcon" />
    </div>
  </div>
</template>
<script setup>
import Mousetrap from 'mousetrap'
import { ref } from 'vue'
import SvgIcon from './SvgIcon.vue'
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['resetCamera', 'refresh', 'mirror'])
const activeKey = ref(null)
const fixed = ref(false)
const toolsMap = [
  {
    defaultIcon: 'dingLine',
    activeIcon: 'ding',
    defaultAnimte: null,
    activeAnimate: null,
    key: 'fixed'
  },
  {
    defaultIcon: 'cameraLine',
    activeIcon: 'camera',
    defaultAnimte: null,
    activeAnimate: null,
    key: 'camera'
  },
  {
    defaultIcon: 'refresh',
    activeIcon: 'refresh',
    defaultAnimte: 'deverse',
    activeAnimate: 'reverse',
    key: 'refresh'
  },
  {
    defaultIcon: 'mirror',
    activeIcon: 'mirror',
    defaultAnimte: null,
    activeAnimate: null,
    key: 'mirror'
  }
]

const changeFixed = () => {
  fixed.value = !fixed.value
  activeKey.value = fixed.value ? 'fixed' : null
  window.electron.ipcRenderer.send('fixed', fixed.value)
}

const effect = (key) => {
  const map = {
    fixed: changeFixed,
    camera: () => emit('resetCamera'),
    refresh: () => emit('refresh'),
    mirror: () => emit('mirror')
  }
  if (activeKey.value === key) {
    activeKey.value = null
  } else {
    activeKey.value = key
  }
  map[key] && map[key]()
}

Mousetrap.bind(['command+p', 'ctrl+p'], () => {
  changeFixed()
  return false
})
</script>
<style lang="less" scoped>
.tools {
  width: 35px;
  padding: 10px 0;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(15px);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: all;
  z-index: 2;
  transition: all 0.3s ease;
  .tool {
    cursor: pointer;

    &.reverse {
      /deep/ svg {
        transform: rotate(360deg);
        transform-origin: center;
        transition: all 1s ease;
      }
    }
    &.deverse {
      /deep/ svg {
        transform: rotate(-360deg);
        transform-origin: center;
        transition: all 1s ease;
      }
    }
  }
  &-show {
    right: 0;
  }
  &-hidden {
    right: -35px;
  }
}
</style>
