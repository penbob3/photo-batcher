<template>
    <PageSwitcher :menuOptions="menuOptions" @menuChange="(idx) => selectedMenuOption = idx"></PageSwitcher>
    <component :is="menuOptions[selectedMenuOption].component"></component>
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
                ]
            }
        }
    }

    console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>