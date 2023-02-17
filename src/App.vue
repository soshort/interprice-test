<template>
    <div id="app">
        <Companies/>
    </div>
</template>
<script>
import Companies from "@/components/Companies.vue";

export default {
    name: 'App',
    components: {
        Companies,
    },
}
</script>
<style scoped>
@import '@/assets/css/app.css';
</style>
