<template>
    <form class="xl:w-1/3 mx-auto" @submit.prevent="getShortLink">
        <div class="flex border-solid border-2 rounded-md overflow-hidden">
            <span class="py-4 px-6 bg-blue-500 text-white">URL</span>
            <input v-model="url" type="text" class="flex-1 px-3" placeholder="paste your url" aria-label="url field"
                aria-describedby="paste your url here" />
        </div>
        <div v-if="url && !isUrlValid" class="text-red-400 text-center mt-4">Enter a valid url</div>
        <div class="text-center mt-5">
            <button :disabled="!isUrlValid || !url" type="submit"
                class="disabled:opacity-75 py-3 px-3 bg-blue-500 text-white rounded-md transform motion-reduce:transform-none hover:-translate-y-1 hover:scale-110 transition ease-in-out duration-300">Get
                short link</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from '@/composables/toast';

const {public: { apiBase }} = useRuntimeConfig();
const $toast = useToast();

const url = ref<string>('');

const isUrlValid = computed<boolean>(() => {
    const pattern: RegExp = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url.value);
})

const getShortLink = async ():Promise<void> => {
    
    try {
        const urlRegex = /^(https?:\/\/)/;
        
        let payload = {
            url: url.value
        }
    
        if(!urlRegex.test(url.value)) {
            payload.url = `https://${url.value}`
        }

        let res = await fetch(`${apiBase}/url-shortener`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "content-type": "application/json"
            }
        })
    
        if (res.status == '500') {
            $toast.error(`internal server error`)
            return;
        }
    
        res = await res.json();
    
        res.short_url = `${window.location.protocol}//${window.location.host}/${res.short_url}`
        $toast.success(res);
    } catch (error) {
        console.log(error)
        $toast.error(error.message)
    }
    
}
</script>

<style></style>