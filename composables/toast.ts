import { ref } from "vue";

const toasts = ref<{type: string, data?: object, message?: string}[]>([]);

export function useToast() {
    const success = (data:object) => {
        toasts.value.push({
           type: 'success',
           data: data 
        })
    }

    const error = (message:string) => {
        toasts.value.push({
           type: 'error',
           message: message
        })
    }

    const deleteToast =  (toastIndex:number) => {
        toasts.value = toasts.value.filter((toast,index) => index != toastIndex);
    }
    
    return {success, error, toasts, deleteToast}
}