import {type Ref, computed} from 'vue';

export function isUrlValid(url:Ref) {
    return computed<boolean>(() => {
        const pattern: RegExp = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(url.value);
    })
}

export function shortCodeValidation(shortCode:Ref) {
    return computed<boolean>(() => {
        return shortCode.value.length >= 6;
    })
}
