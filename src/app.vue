<template>
    <PageSwitcher :menuOptions="menuOptions" @menuChange="(idx) => selectedMenuOption = idx"></PageSwitcher>
    <PhotoBrowser v-show="selectedMenuOption == 0" @photoListLoaded="(list) => photoList = list" @photoSelected="(idx) => selectedPhoto = idx"></PhotoBrowser>
    <PhotoAnalyzer v-show="selectedMenuOption == 1 "></PhotoAnalyzer>
</template>
  
<script>
    //<component :is="menuOptions[selectedMenuOption].component"></component>
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
                photoList: null,
                selectedPhoto: null
            }
        }
    }

    console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>