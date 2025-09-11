<template>
    <div id="container">
        <div v-if="!selectedFolder">No Folder Selected! <a href="javascript:undefined" @click="selectFolder()">Select Folder...</a></div>
        <div></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedFolder: null,
                folderFiles: null
            }
        },
        methods: {
            selectFolder: async function() {
                this.selectedFolder = await window.electronAPI.openFolder()
                console.log(this.selectedFolder)
                this.folderFiles = await window.electronAPI.readFolder(this.selectedFolder)
                console.log(this.folderFiles)
                //let image = await window.electronAPI.getImage("C:\\Users\\plazm\\Pictures\\FurryCon!\\goodens\\DSC_3308.NEF")
                //console.log(image)
            }
        }
    }
</script>

<style scoped>
    #container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100% - 50px);
        background-color: honeydew;
    }
</style>