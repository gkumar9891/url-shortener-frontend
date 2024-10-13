<template>
  <div class="fixed top-0 right-0 flex flex-col items-end h-screen overflow-auto" role="alert">
    <div v-for="toast,index in toasts" :key="index">
      <div v-if="toast.type == 'success'" class="flex items-start py-2 px-4 bg-green-400 rounded-md mb-2">
        <button @click="copyText($event, toast.data.short_url)" @mouseout="resetCopyText($event)" v-if="toast.type == 'success'" class="tooltip mt-3">
          <span class="tooltiptext">Copy to clipboard</span>
          <img style="pointer-events: none" class="w-4 mr-3" src="/img/copy-link-icon.svg" alt="">
        </button>
        <div class="toast-body mr-3">
          <p>
            short url: 
          <NuxtLink :to="toast.data.short_url" target="_blank">
          {{ toast.data.short_url }}
          </NuxtLink>
          </p>

          <p>
            long url: 
          <NuxtLink :to="toast.data.original_url" target="_blank">
          {{ toast.data.original_url }}
          </NuxtLink>
          </p>

          
        </div>
        <button type="button" class="ml-auto mt-1" @click="deleteToast(index)">X</button>
      </div>
      <div v-else-if="toast.type == 'error'" class="flex items-start py-2 px-4 bg-red-400 rounded-md mb-2">
        <div class="toast-body mr-3">
          <p>
            {{toast.message}}
          </p>        
        </div>
        <button type="button" class="ml-auto" @click="deleteToast(index)">X</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/composables/toast";
import { onMounted } from "vue";

const { toasts, deleteToast } = useToast();
const {$toast} = useNuxtApp()

const copyText = (event: Event, text:string) => {
  const type = "text/plain";
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  navigator.clipboard.write(data).then(() => {
    event.target!.querySelector('.tooltiptext').innerHTML = `Copied: ${text}`
  })
}

const resetCopyText = (event: Event) => {
  event.target!.querySelector('.tooltiptext').innerHTML = "Copy short url"
}

onMounted(() => {
  console.log($toast)
})
</script>

<style>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  min-width: max-content;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  right: 150%;
  top: -17%;
  margin-left: -75px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
    position: absolute;
    top: 38%;
    right: -9px;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
    rotate: -90deg;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>