<script setup lang="ts">
// import Versions from './components/Versions.vue'
import AppBar from './components/AppBar.vue'
import { ref } from 'vue'

const count = ref(0)

function ipcHandle(): void {
  const result = window.electron.ipcRenderer.send('ping')
  console.log('ping sent', result)
}

function closeApp(): void {
  window.electron.ipcRenderer.send('app:close')
}

async function invokeFun(): Promise<void> {
  const res = await window.electron.ipcRenderer.invoke('app:invoke_add', count.value)
  console.log('invoke result:', res)
  count.value = res
}


function requestHidDevice(): void {
  console.log('requesting hid device')
  navigator.hid.requestDevice({ filters: [] }).then((devices) => {
    console.log('devices:', devices)
  }).catch((err) => {
    console.error('hid request error:', err)
  })
}

function getDevices(): void {
  navigator.hid.getDevices().then((devices) => {
    console.log('getDevices:', devices)
  }).catch((err) => {
    console.error('hid getDevices error:', err)
  })
}

</script>

<template>
  <div>
    <AppBar />
    <div class="flex">
      <button class="btn bg-blue-500 m-2  rounded text-white" @click="ipcHandle">
        ping
      </button>

      <button class="btn bg-blue-500  rounded text-white" @click="closeApp">
        exit
      </button>

      <div class="ml-5">
        {{ count }}
      </div>
      <button class="btn bg-blue-500  rounded text-white" @click="invokeFun">
        invoke count
      </button>

      <button class="btn bg-blue-500 m-2  rounded text-white" @click="requestHidDevice">
        request hid device
      </button> <button class="btn bg-blue-500 m-2  rounded text-white" @click="getDevices">
        get hid devices
      </button>
    </div>
  </div>

</template>
