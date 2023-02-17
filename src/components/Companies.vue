<template>
    <div>
        <CompanyFilters/>
        <CompanyTable/>
    </div>
</template>
<script>
import CompanyFilters from "@/components/CompanyFilters.vue";
import CompanyTable from "@/components/CompanyTable.vue";

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Companies",
    components: {
        CompanyFilters,
        CompanyTable
    },
    computed: {
        years() {
            return this.$store.getters.years;
        }
    },
    mounted() {
        this.requestServerAPI();
    },
    methods: {
        requestServerAPI() {
            fetch('//localhost:8080/data.json')
                .then(response => response.json())
                .then(data => {
                    this.$store.commit('setItems', data?.Items || []);
                    this.$store.commit('setActiveYears', [...this.years]);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
}
</script>
<style scoped>
</style>