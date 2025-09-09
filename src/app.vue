<template>
    <PageSwitcher :menuOptions="menuOptions"></PageSwitcher>
    <h1>💖 Hello World!</h1>
    <p>Welcome to your Electron application.</p>
</template>
  
<script>
    import PageSwitcher from './components/PageSwitcher.vue'

    export default {
        components: {
            PageSwitcher
        },
        data() {
            return {
                menuOptions: ["Browser", "Review"]
            }
        }
    }

    console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>