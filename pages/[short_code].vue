<script setup lang="ts">
import { onMounted } from 'vue';
const {public: { apiBase }} = useRuntimeConfig();
const route = useRoute();

onMounted(async () => {
    let res = await fetch(`${apiBase}/url-shortener/${route.params.short_code}`, {
        method: "GET",
        headers: {
            "content-type": "application/json"
        }
    })
    res = await res.json();

    await navigateTo(res.original_url, {external: true});
})

</script>