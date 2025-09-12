<template>
    <div id="container" @click="loadJpg">
        <img :src="imgData" width="100%" height="100%"></img>
    </div>
</template>

<script>
    export default {
        props: [ "currentImage" ],
        data() {
            return {
                imgData: null
            }
        },
        methods: {
            loadJpg: async function () {
                console.log(this.currentImage)
                this.imgData = null
                let imgB64 = await await window.electronAPI.getImage(this.currentImage.exifTags.SourceFile)
                this.imgData = 'data:image/jpg;base64, ' + imgB64
            }
        }
    }
</script>

<style scoped>
#container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column; 
        height: calc(100% - 50px);
        background-color: rgb(160, 160, 160);
    }

img {
    object-fit: contain;
}
</style>