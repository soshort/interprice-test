<template>
    <tbody>
        <tr class="border-bottom">
            <td>
                <button
                    type="button"
                    class="btn btn-expand d-inline-flex align-items-center"
                    v-if="company.hasHiddenData"
                    v-bind:class="getExpandButtonClasses()"
                    v-on:click="toggleRow()"/>
            </td>
            <td>{{ formatDate(company.dateSent) }}</td>
            <td v-if="hasData">
                <b class="p-0">{{ company.name }}</b>
            </td>
            <td v-else>
                <span class="text-muted">{{ company.name }}</span>
            </td>
            <template v-for="(period, idx) in activeYears">
                <td class="text-center"
                    v-bind:key="idx + 'FIX'"
                    v-bind:class="getCellClasses(period, 'FIX')">
                    {{ formatOutput(getCellValue(period, 'FIX'), activeMetric) }}
                </td>
                <td class="text-center"
                    v-bind:key="idx + 'FRN'"
                    v-bind:class="getCellClasses(period, 'FRN')">
                    {{ formatOutput(getCellValue(period, 'FRN'), activeMetric) }}
                </td>
            </template>
        </tr>
        <template v-if="isRowExpanded(company.name)">
            <tr
                class="border-bottom"
                v-for="(metric, idx) in disabledMetrics"
                v-bind:key="idx">
                <td/>
                <td/>
                <td>{{ metric }}</td>
                <template v-for="(period, idx) in activeYears">
                    <td class="text-center" v-bind:key="idx + 'FIX'">
                        {{ formatOutput(getCellValue(period, 'FIX', metric), metric) }}
                    </td>
                    <td class="text-center" v-bind:key="idx + 'FRN'">
                        {{ formatOutput(getCellValue(period, 'FRN', metric), metric) }}
                    </td>
                </template>
            </tr>
        </template>
    </tbody>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex'

export default {
    name: 'CompanyItem',
    props: {
        company: Object,
    },
    computed: {
        ...mapGetters([
            'activeYears',
            'activeMetric',
            'disabledMetrics',
            'activeCurrency',
            'minValueKeys',
            'expandedCompanyNames'
        ]),
        hasData() {
            return Object.keys(this.company.data).length > 0;
        }
    },
    methods: {
        getExpandButtonClasses() {
            return { expanded: this.isRowExpanded(this.company.name) };
        },
        isRowExpanded() {
            return this.expandedCompanyNames.includes(this.company.name);
        },
        getCellValue(years, couponType, metric) {
            const key = this.activeCurrency + '-' + years + '-' + couponType + '-' + (metric ?? this.activeMetric);
            return this.company.data[key] ?? '';
        },
        getCellClasses(years, couponType) {
            const key = this.activeCurrency + '-' + years + '-' + couponType + '-' + this.activeMetric;
            return {
                'bg-warning bg-opacity-25': this.company.data[key] && this.minValueKeys[key] === this.company.data[key]
            }
        },
        toggleRow() {
            this.$store.commit('toggleRow', this.company.name)
        },
        formatDate(date) {
            return date ? moment(date).format('DD-MMM-YY') : '';
        },
        formatOutput(value, metric) {
            if (metric === 'Yield') {
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
<style scoped>
    @import '@/assets/css/companyItem.css';
</style>
