<template>
    <div class="flex flex-col min-h-screen">
        <Toast></Toast>
        <Navigation></Navigation>
        <slot></slot>
        <FootNote class="mt-auto"></FootNote>
    </div>
</template>