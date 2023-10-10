/**
 * @description get all input cameras
 * @returns
 */
export const getAllCameras = () => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const cameras = devices.filter((device) => device.kind === 'videoinput')
        resolve(cameras)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const getCameraStream = (deviceId, audio = false) => {
  return new Promise((resolve, reject) => {
    const constraints = {
      audio,
      video: {
        deviceId: { exact: deviceId }
      }
    }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        resolve(stream)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
