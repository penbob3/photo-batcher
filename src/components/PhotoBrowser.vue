<template>
    <div id="container">
        <div v-if="!selectedFolder">No Folder Selected! <a href="javascript:undefined" @click="selectFolder()">Select Folder...</a></div>
        <div v-show="selectedFolder" id="pathtext" style="margin-top: 6px; margin-bottom: 6px;">{{ "Selected Path: " + selectedFolder  + ' - ' }} <a href="javascript:undefined" @click="selectFolder()">Select Different Folder...</a></div>
        <div v-show="selectedFolder" id="gallery">
            <div v-for="image, idx in folderFiles" @click="$emit('photoSelected', idx)" class="imageBox">
                <img :src="'data:image/jpg;base64, ' + image.thumbnailB64" class="image"/>
            </div>
        </div>
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
                let maybeFolder = await window.electronAPI.openFolder()
                if (maybeFolder) {
                    this.selectedFolder = maybeFolder
                    console.log(this.selectedFolder)
                    this.folderFiles = await window.electronAPI.readFolder(this.selectedFolder)
                    console.log(this.folderFiles)
                    this.$emit('photoListLoaded', this.folderFiles)
                } else {
                    window.alert("You didn't pick a folder!")
                }
            },
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

    #pathtext {
        position: relative;
    }

    #gallery {
        height: 100%;
        width: calc(100% - 30px);
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
        gap: 20px;
        margin-left: 30px;
        margin-top: 0px;
        padding-bottom: 20px;
        overflow-y: scroll;
    }

    .imageBox {
        width: 180px;
        height: 180px;
        
    }

    .image {
        width: 180px;
        height: 180px;
        object-fit: contain;
    }
</style>