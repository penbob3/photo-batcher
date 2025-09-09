<template>
    <div id="container">
        <div class="spacer"></div>
        <div v-for="option,idx in menuOptions" @click="selectMenuOption(idx)" :class="'option ' + (selectedMenuOption == idx ? 'selected' : '')">{{ option.title }}</div>
    </div>
</template>

<script>
    export default {
        props: {
            menuOptions: Array
        },
        data() {
            return {
                selectedMenuOption: 0
            }
        },
        methods: {
            selectMenuOption: function(optionIdx) {
                this.selectedMenuOption = optionIdx
                this.$emit('menuChange', optionIdx)
            }
        }
    }
</script>

<style lang="css" scoped>
    #container {
        height: 50px;
        border-bottom: 1px black solid;
        background-color: rgb(71, 212, 165);
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }
    
    .option {
        height: 49px;
        width: 110px;
        text-align: center;
        line-height: 48px;
        border-right: 1px solid black;
    }

    .spacer {
        height: 49px;
        background-color: black;
        width: 1px;
    }

    .selected {
        background-color: rgb(116, 255, 209);
    }
</style>