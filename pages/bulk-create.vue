<template>
    <section class="section pt-40">
        <div class="container mx-auto px-4">
            <div class="text-center mb-5">
                <h1 class="text-3xl">Bulk Create</h1>
                <a class="mt-5 inline-block text-blue-800 underline" href="/files/bulk-upload.xlsx" download>sample file to download</a>
                <FileUpload @input="fileInput"></FileUpload>
                <button v-if="canDownload" @click="download" class="bg-blue-400 text-white rounded-lg px-5 py-3 mr-3 hover:bg-blue-300">Download File</button>
                <button v-if="canDownload" @click="canDownload=false" class="bg-blue-400 text-white rounded-lg px-5 py-3 hover:bg-blue-300">Clear</button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

const { public: { apiBase } } = useRuntimeConfig();

const canDownload = ref(false);

const fileHandler = () => {
    let filePath:any;
    const fileInput = async function (event: any) {
        const file = event.target.files[0];
        const form = new FormData();
        form.append("file", file);
        form.append("baseUrl", location.origin)

        const result = await fetch(`${apiBase}/url-shortener/bulk-create`, {
            method: "POST",
            body: form
        })
        const xlFileData = await result.json();
        filePath = xlFileData.data.filePath;
        
        canDownload.value = true
    }
    const download = async function() {
        if(filePath) {
            const res = await fetch(`${apiBase}/download`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filePath: filePath
                })
            })

            const blob = await res.blob();

                // Create a URL for the Blob
            const downloadUrl = URL.createObjectURL(blob);

            // Create a temporary <a> element to trigger the download
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "download"; // Set the default filename if not provided
            document.body.appendChild(a); // Append <a> to the document
            a.click(); // Trigger the download
            a.remove(); // Clean up the element

            // Revoke the Object URL to free memory
            URL.revokeObjectURL(downloadUrl);
        }
    }

    return {fileInput, download};
}

const {fileInput, download} = fileHandler();

</script>