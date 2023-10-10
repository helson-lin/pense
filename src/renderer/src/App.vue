<template>
  <div class="app">
    <!-- 设备列表 -->
    <div v-if="!showCamera" class="cameras">
      <div
        v-for="item in cameras"
        :key="item.deviceId"
        class="camera"
        @click="playMedia(item.deviceId)"
      >
        {{ item.label }}
      </div>
    </div>
    <video v-else id="camera" ref="videoRef" class="full-video" :style="filterStyle"></video>
    <div v-if="dragabble" class="drag"></div>
    <Tools :show="showTool" @reset-camera="resetCamera" @refresh="refresh" @mirror="mirror" />
    <Message ref="messageRef" />
  </div>
</template>
<script setup>
import Mousetrap from 'mousetrap'
import { onMounted, ref } from 'vue'
import Tools from './components/Tools.vue'
import Message from './components/Message.vue'
import { getAllCameras, getCameraStream } from './utils/camera'
const cameras = ref([])
const videoRef = ref(null)
const messageRef = ref(null)
const showCamera = ref(false)
const dragabble = ref(false)
const showTool = ref(false)
const filterStyle = ref('transform: scaleX(-1);')
const filterMap = { blur: 'filter: blur(20px);', mirror: 'transform: scaleX(-1);' }
// keyboard binding
Mousetrap.bind(['command+up', 'ctrl+up'], () => {
  window.electron.ipcRenderer.send('size', 'max')
  return false
})
Mousetrap.bind(['command+down', 'ctrl+down'], () => {
  window.electron.ipcRenderer.send('size', 'min')
  return false
})
Mousetrap.bind(['command+t', 'ctrl+t'], () => {
  showTool.value = !showTool.value
  return false
})
Mousetrap.bind(['command+c', 'ctrl+c'], () => {
  if (showCamera.value) {
    filterOperation('blur')
  }
  return false
})
Mousetrap.bind(['command+q', 'ctrl+q'], () => {
  window.ipcRenderer.send('quit')
  return false
})
Mousetrap.bind(['command+shift+left', 'ctrl+shift+left'], () => {
  window.electron.ipcRenderer.send('move', 'left')
  return false
})
Mousetrap.bind(['command+shift+right', 'ctrl+shift+right'], () => {
  window.electron.ipcRenderer.send('move', 'right')
  return false
})
Mousetrap.bind(['command+d', 'ctrl+d'], () => {
  dragabble.value = !dragabble.value
  return false
})

/**
 * @description refresh camera device
 */
const refresh = () => getAllCameras().then((devices) => (cameras.value = devices))

const resetCamera = () => {
  showCamera.value = !showCamera.value
}

const mirror = () => filterOperation('mirror')
const filterOperation = (key) => {
  const style = filterMap[key]
  if (!style) return
  if (filterStyle.value.includes(style)) {
    filterStyle.value = filterStyle.value.replace(style, '')
  } else {
    filterStyle.value += style
  }
}

const playMedia = (deviceId) => {
  showCamera.value = true
  setTimeout(() => {
    getCameraStream(deviceId).then((currentStream) => {
      // 监听媒体流结束事件
      currentStream.getTracks().forEach((track) => {
        track.onended = () => {
          track.stop()
          messageRef.value.show({
            value: '媒体流已结束',
            duration: 1000
          })
          console.log('媒体流已结束')
          // 在这里执行结束后的操作
        }
      })
      if (videoRef.value) {
        videoRef.value.srcObject = currentStream
        videoRef.value.play()
      }
    })
  }, 0)
}

// const effectAction = (key) => {}

onMounted(async () => {
  setTimeout(() => {
    console.log(messageRef.value)
    messageRef.value.show({
      value: '媒体流已结束',
      duration: 1000
    })
  }, 3000)
  getAllCameras().then((devices) => (cameras.value = devices))
})
</script>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}
@import './assets/css/styles.less';
</style>
<style lang="less" scoped>
.app {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  -webkit-app-region: none;
  .cameras {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    box-sizing: border-box;
    .camera {
      width: 100%;
      height: 1.7rem;
      display: flex;
      align-items: center;
      line-height: 1.7rem;
      border-radius: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 0.7rem;
      padding: 5px;
      box-sizing: border-box;
      border: 1px solid;
      color: #fff;
      margin-bottom: 10px;
      &:hover {
        cursor: pointer;
        background-color: #6364bf;
      }
    }
  }
  .drag {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    -webkit-app-region: drag;
    cursor: move;
    pointer-events: all;
  }
  .full-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
