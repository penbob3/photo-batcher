<template>
    <PageSwitcher :menuOptions="menuOptions" @menuChange="(idx) => selectedMenuOption = idx" :selectedMenuOption="selectedMenuOption"></PageSwitcher>
    <PhotoBrowser v-show="selectedMenuOption == 0" @photoListLoaded="(list) => photoList = list" @photoSelected="updateSelectedPhoto"></PhotoBrowser>
    <PhotoAnalyzer v-show="selectedMenuOption == 1" :currentImage="photoList[selectedPhoto]"></PhotoAnalyzer>
</template>
  
<script>
    import PageSwitcher from './components/PageSwitcher.vue'
    import PhotoBrowser from './components/PhotoBrowser.vue'
    import PhotoAnalyzer from './components/PhotoAnalyzer.vue'

    export default {
        components: {
            PageSwitcher,
            PhotoBrowser,
            PhotoAnalyzer
        },
        data() {
            return {
                selectedMenuOption: 0,
                menuOptions: [
                    {
                        title: "Browse",
                        component: PhotoBrowser
                    },
                    {
                        title: "Analyze",
                        component: PhotoAnalyzer
                    }
                ],
                photoList: [],
                selectedPhoto: 0
            }
        },
        methods: {
            updateSelectedPhoto: function (idx) {
                this.selectedPhoto = idx
                this.selectedMenuOption = 1
            }
        }
    }

    console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>