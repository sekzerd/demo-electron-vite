<script setup lang="ts">
// import Versions from './components/Versions.vue'
import { write } from 'fs'
import AppBar from './components/AppBar.vue'
import { ref } from 'vue'

const count = ref(0)

function ipcHandle(): void {
  const result = window.electron.ipcRenderer.send('ping')
  console.log('ping sent', result)
}

function closeApp(): void {
  window.electron.ipcRenderer.send('win:close')
}

async function invokeFun(): Promise<void> {
  const res = await window.electron.ipcRenderer.invoke('app:invoke_add', count.value)
  console.log('invoke result:', res)
  count.value = res
}


function requestHidDevice(): void {
  console.log('requesting hid device')
  // @ts-ignore
  navigator.hid.requestDevice({ filters: [] }).then((devices) => {
    console.log('devices:', devices)
  }).catch((err) => {
    console.error('hid request error:', err)
  })
}

function getDevices(): void {
  // @ts-ignore
  navigator.hid.getDevices().then((devices) => {
    console.log('getDevices:', devices)
  }).catch((err) => {
    console.error('hid getDevices error:', err)
  })
}
async function invokeKoffi(): Promise<void> {
  console.log('invoking koffi test')
  const ret = await window.electron.ipcRenderer.invoke('test-koffi', 1, 2)
  console.log('koffi test invoked, ret:', ret)
}

const data = ref('')

async function writeFile(): Promise<void> {
  console.log('invoking write file')
  console.log('writing file with data:', data.value)
  const ret = await window.electron.ipcRenderer.invoke('app:fs:writeFileSync', 'test.txt', data.value)
  console.log('file write invoked, ret:', ret)
  console.log('write file invoked, quitting app')
}

function handleFileUpload(event: Event): void {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = function (e) {
      const content = e.target?.result
      console.log('File content:', content)
    }
    reader.readAsText(file)
  }
}

import { useAppStore } from './stores/useAppStore'
const data_pinia = ref('')
function save_pinia_data(): void {
  const app_store = useAppStore();
  app_store.text = data_pinia.value;
}
import { onMounted } from 'vue'
onMounted(() => {
  const app_store = useAppStore();

  console.log('mounted, fetching pinia data', app_store.text)
  data_pinia.value = app_store.text
})
</script>

<template>
  <div>
    <AppBar />
    <div class="flex  items-center ">
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
      <button class="btn bg-blue-500 m-2  rounded text-white" @click="invokeKoffi">
        call demo_dll</button>


      <input v-model="data" class="border-2 border-gray-300 rounded m-2 p-1 w-20" type="text" />
      <button class="btn bg-blue-500 m-2  rounded text-white" @click="writeFile">
        writeFile</button>

      <input type="file" @change="handleFileUpload" />


      <input v-model="data_pinia" class="border-2 border-gray-300 rounded m-2 p-1 w-20" type="text" />
      <button class="btn bg-blue-500 m-2  rounded text-white" @click="save_pinia_data">
        set pinia data</button>

    </div>
  </div>

</template>
