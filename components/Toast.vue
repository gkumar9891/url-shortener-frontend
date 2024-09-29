<template>
  <div class="fixed top-0 right-0" role="alert">
    <div v-for="toast,index in toasts" :key="index">
      <div class="flex py-2 px-4 bg-green-400 rounded-md mb-2">
        <button v-if="toast.type == 'success'">
          <img class="w-4 mr-3" src="/img/copy-link-icon.svg" alt="">
        </button>
        <div class="toast-body mr-3">
          <NuxtLink :to="toast.message" target="_blank">
          {{ toast.message }}
          </NuxtLink>
        </div>
        <button type="button" class="ml-auto" @click="deleteToast(index)">X</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/composables/toast";

const { toasts, deleteToast } = useToast();
</script>
