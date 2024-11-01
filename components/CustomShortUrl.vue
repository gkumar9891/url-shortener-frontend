<template>
    <form class="xl:w-1/3 mx-auto" @submit.prevent="getShortLink">
        <div class="flex border-solid border-2 rounded-md overflow-hidden mb-2">
            <span class="py-4 px-6 bg-blue-500 text-white">URL</span>
            <input v-model="longUrl" type="text" class="flex-1 px-3" placeholder="paste your url" aria-label="url field"
                aria-describedby="paste your url here" />
        </div>
        <div v-if="!isUrlValid" class="text-red-400 text-center mb-4">Enter a valid url</div>
        <div class="inline-flex border-solid border-2 rounded-md overflow-hidden mb-4">
            <span class="py-4 px-1 bg-blue-500 text-white"> {{
        `${navigation?.location?.protocol}//${navigation?.location?.host}` }}/ </span>
            <input v-model="shortCode" type="text" class="px-2 inline-block w-40" placeholder="short-code"
                aria-label="url field" aria-describedby="paste your url here" />
        </div>
        <div v-if="!isShortCodeValid" class="text-red-400 text-center mb-4">Enter atleast six digit short code</div>


        <label class="mb-4 flex items-center" for="expiration"><input id="expiration" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2" type="checkbox" v-model="showExpiration">Want
            to add automatic expiration</label>

        <div v-if="showExpiration">
            <label class="block mb-2" for="date">Select Date</label>
            <input id="date" v-model="expirationDate" type="date" :min="todayDate" />
        </div>

        <div class="text-center mt-5">
            <button type="submit" :disabled="isSubmitDisabled"
                class="disabled:opacity-75 py-3 px-3 bg-blue-500 text-white rounded-md transform motion-reduce:transform-none hover:-translate-y-1 hover:scale-110 transition ease-in-out duration-300">Get
                short link</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from '@/composables/toast';
import {type ApiResponse} from '@/types/response';
import {isUrlValid as urlValidation, shortCodeValidation} from '@/utils/urlValidation';

const { public: { apiBase } } = useRuntimeConfig();
const $toast = useToast();
const navigation = ref();
const longUrl = ref('');
const shortCode = ref('');
const showExpiration = ref(false);
const expirationDate = ref('');

const todayDate = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;

const isUrlValid = urlValidation(longUrl);
const isShortCodeValid = shortCodeValidation(shortCode);

onMounted(() => {
    navigation.value = window || globalThis
})

const isSubmitDisabled = computed(() => {
    if(showExpiration.value && !expirationDate.value) {
        return true;
    }
    
    return !isUrlValid.value || !isShortCodeValid.value
})

const getShortLink = async (): Promise<void> => {
    const urlRegex = /^(https?:\/\/)/;

    let payload:any = {
        url: longUrl.value,
        shortCode: shortCode.value
    }

    if(showExpiration.value) {
        payload.expiryDate = expirationDate.value;
    }

    if (!urlRegex.test(longUrl.value)) {
        payload.url = `https://${longUrl.value}`
    }

    fetch(`${apiBase}/url-shortener/alias`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "content-type": "application/json"
        }
    }).then(async res => {
        if (res.status.toString().startsWith('4') || res.status.toString().startsWith('5')) {
            let _res:ApiResponse = await res.json();
            $toast.error(`${_res.message}`)
            return;
        }

        let _res:ApiResponse = await res.json();

        _res.data.short_url = `${window.location.protocol}//${window.location.host}/${_res.data.short_url}`
        $toast.success(_res.data);

    }).catch( (err:Error) => {
        $toast.error(err.message)
    })
}

</script>