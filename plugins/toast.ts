import {ref} from 'vue'

const toast = {
    install(app) {
        const toasts = ref<{}[]>([]);

        app.config.globalProperties.$toast = {
            getToasts: () => toasts,
            addSuccess: (msg) => {
                toasts.value.push({messsage: msg, type: 'success'});
            }

        }
    }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(toast);
})