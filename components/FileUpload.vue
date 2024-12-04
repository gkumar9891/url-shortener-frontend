<template>
    <div class="file-upload-wrapper">
        <label for="file-upload">
            <img class="inline-block h-52" src="/img/upload.png" alt="">
        </label>
        <input @input="$props.input" class="hidden absolute -z-10" id="file-upload" type="file" accept="">
    </div>
</template>

<script setup lang="ts">
const $props = defineProps({
    acceptFiles: {
        type: String,
        default: '*'
    },
    input: {
        type: Function,
        default: () => {}
    }
});
</script>