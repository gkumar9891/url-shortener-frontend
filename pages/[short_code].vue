<template>
    <div>
        <h1 v-if="!isDataFound">Data Not Found</h1>
        <h1 v-else-if="!isServiceAvailable">Service Not Available</h1>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
const { public: { apiBase } } = useRuntimeConfig();
const route = useRoute();
const isServiceAvailable = ref<boolean>(true);
const isDataFound = ref<boolean>(true);

onMounted(async () => {
    try {
        let res = await fetch(`${apiBase}/url-shortener/${route.params.short_code}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })

        if (res.status == '404') {
            isDataFound.value = false;
            return
        }

        res = await res.json();

        await navigateTo(res.original_url, { external: true });
    } catch (error) {
        console.log(error);

        isServiceAvailable.value = false
    }
})

</script>