<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-auto">
                <div class="btn-group">
                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        v-for="currency in currencies"
                        v-bind:key="currency"
                        v-bind:class="getCurrencyButtonClasses(currency)"
                        v-on:click="setActiveCurrency(currency)">{{ currency }}
                    </button>
                </div>
            </div>
            <div class="col-md-auto">
                <div class="btn-group mt-4 mt-md-0">
                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        v-for="period in years"
                        v-bind:key="period"
                        v-bind:class="getYearButtonClasses(period)"
                        v-on:click="toggleActivePeriod(period)">{{ period }} YRS
                    </button>
                </div>
            </div>
            <div class="col-md-auto">
                <div class="btn-group mt-4 mt-md-0">
                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        v-for="metric in metrics"
                        v-bind:key="metric"
                        v-bind:class="getMetricButtonClasses(metric)"
                        v-on:click="setActiveMetric(metric)">{{ metric }}
                    </button>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-6 col-lg-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Filter by company name ..."
                    v-bind:value="filterInput"
                    v-on:input="filterInputChange">
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    name: "CompanyFilters",
    computed: {
        ...mapGetters([
            'metrics',
            'currencies',
            'years',
            'activeCurrency',
            'activeYears',
            'activeMetric',
            'averages',
            'filterInput',
            'orderBy'
        ])
    },
    methods: {
        ...mapMutations([
            'setOrderBy',
            'setActiveMetric',
            'toggleActivePeriod'
        ]),
        filterInputChange(event) {
            this.$store.commit('setFilterInput', event.target.value);
        },
        setActiveCurrency(currency) {
            this.$store.commit('setActiveCurrency', currency);
            this.$store.commit('setActiveYears', [...this.years]);
        },
        getCurrencyButtonClasses(currency) {
            return {active: this.activeCurrency === currency};
        },
        getYearButtonClasses(period) {
            return {active: this.activeYears.includes(period)};
        },
        getMetricButtonClasses(metric) {
            return {active: this.activeMetric === metric};
        },
        formatOutput(value) {
            if (this.activeMetric === 'Yield') {
                return value ? value.toFixed(3) + '%' : '';
            }

            if (value > 0) {
                return '+' + parseInt(value) + 'bp';
            }

            return value ? parseInt(value) + 'bp' : '';
        },
    }
}
</script>