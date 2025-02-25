<template>
    <form class="xl:w-1/3 mx-auto" @submit.prevent="getShortLink">
        <div class="flex border-solid border-2 rounded-md overflow-hidden">
            <span class="py-4 px-6 bg-blue-500 text-white">URL</span>
            <input v-model="url" type="text" class="flex-1 px-3" placeholder="paste your url" aria-label="url field"
                aria-describedby="paste your url here" />
        </div>
        <div v-if="!isUrlValid" class="text-red-400 text-center mt-4">Enter a valid url</div>

        <label class="mb-4 flex items-center" for="expiration"><input id="expiration" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-2" type="checkbox" v-model="showExpiration">Want
            to add automatic expiration</label>

        <div v-if="showExpiration">
            <label class="block mb-2" for="date">Select Date</label>
            <input id="date" v-model="expirationDate" type="date" :min="todayDate" />
        </div>

        <div class="text-center mt-5">
            <button :disabled="isSubmitDisabled" type="submit"
                class="disabled:opacity-75 py-3 px-3 bg-blue-500 text-white rounded-md transform motion-reduce:transform-none hover:-translate-y-1 hover:scale-110 transition ease-in-out duration-300">Get
                short link</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from '@/composables/toast';
import { type ApiResponse } from '@/types/response';
import { isUrlValid as urlValidation } from '@/utils/urlValidation';

const { public: { apiBase } } = useRuntimeConfig();
const $toast = useToast();
const url = ref<string>('');
const isUrlValid = urlValidation(url);
const showExpiration = ref(false);
const expirationDate = ref('');

const todayDate = computed<string>(() => {
    let currentDate = new Date().getTime();
    currentDate += (1000*60*60*24);

    let date:number|string = new Date(currentDate).getDate()
    if(date < 10) {
        date = '0' + date; 
    }

    return `${new Date(currentDate).getFullYear()}-${new Date(currentDate).getMonth()+1}-${date}`
})

const isSubmitDisabled = computed(() => {
    if(showExpiration.value && !expirationDate.value) {
        return true;
    }
    
    return !isUrlValid.value || !url.value
})

const getShortLink = async (): Promise<void> => {
    const urlRegex = /^(https?:\/\/)/;

    let payload:any = {
        url: url.value
    }

    if(showExpiration.value) {
        payload.expiryDate = expirationDate.value;
    }

    if (!urlRegex.test(url.value)) {
        payload.url = `https://${url.value}`
    }

    fetch(`${apiBase}/url-shortener`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "content-type": "application/json"
        }
    }).then(async res => {
        if (!res.ok) {
            let _res: ApiResponse = await res.json();
            $toast.error(`${_res.message}`)
            return;
        }

        let _res = await res.json();

        _res.data.short_url = `${window.location.protocol}//${window.location.host}/${_res.data.short_url}`
        $toast.success(_res.data);
    }).catch((error: Error) => {
        $toast.error(error.message)
    })
}
</script>

<style></style>