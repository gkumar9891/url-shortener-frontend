<template>
    <nav class="fixed top-0 left-0">
        <ul class="list-none flex flex-col items-start">
            <li v-for="link in links" class="py-2 pl-7 pr-5 relative -left-3 transition-all hover:left-0 rounded-r-full bg-blue-400 text-white mb-2"><NuxtLink :to="link.path">{{ link.name }}</NuxtLink></li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
const links = [
    {
        path: "/",
        name: "Home"
    },
    {
        path: "/custom-url",
        name: "Create Custom Short Url"
    }, 
    {
        path: '/bulk-create',
        name: "Bulk Create"
    }
]

</script>