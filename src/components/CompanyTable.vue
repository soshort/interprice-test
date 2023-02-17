<template>
    <div class="container mt-3">
        <div class="row">
            <div class="col-md-12">
                <div class="table-responsive">
                    <table class="table table-borderless text-nowrap">
                        <tr class="border-bottom">
                            <th style="width: 5%"/>
                            <th style="width: 10%"/>
                            <th style="width: 35%"/>
                            <template v-for="year in activeYears">
                                <th v-bind:key="year" class="m-1 text-center" colspan="2">{{ year }} YRS</th>
                            </template>
                        </tr>
                        <tr class="border-bottom">
                            <td/>
                            <td class="text-left">
                                <button
                                    class="d-inline-flex align-items-center text-secondary btn btn-order"
                                    v-on:click="setOrderBy('dateSent')"
                                    v-bind:class="getOrderByButtonClasses('dateSent')">DATE SENT
                                </button>
                            </td>
                            <td class="text-left">
                                <button
                                    class="d-inline-flex align-items-center text-secondary btn btn-order"
                                    v-on:click="setOrderBy('name')"
                                    v-bind:class="getOrderByButtonClasses('name')">COMPANY
                                </button>
                            </td>
                            <template v-for="year in activeYears">
                                <td v-bind:key="year + 'FIX'" class="text-secondary text-center">FIX</td>
                                <td v-bind:key="year + 'FRN'" class="text-secondary text-center">FRN</td>
                            </template>
                        </tr>
                        <CompanyItem
                            v-for="company in sortedCompanies"
                            v-bind:key="company.Id"
                            v-bind:company="company"
                        />
                        <tr class="border">
                            <td/>
                            <td/>
                            <td class="text-secondary">Average by {{ activeMetric }}</td>
                            <template
                                v-for="period in activeYears">
                                <td class="text-center"
                                    v-bind:key="period + 'FIX'">{{ formatOutput(getAverageValue(period, 'FIX')) }}
                                </td>
                                <td class="text-center"
                                    v-bind:key="period + 'FRN'">{{ formatOutput(getAverageValue(period, 'FRN')) }}
                                </td>
                            </template>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import CompanyItem from "@/components/CompanyItem.vue";

export default {
    name: "CompanyTable",
    components: {CompanyItem},
    computed: {
        ...mapGetters([
            'activeCurrency',
            'activeYears',
            'activeMetric',
            'sortedCompanies',
            'averages',
            'orderBy'
        ])
    },
    methods: {
        getOrderByButtonClasses(field) {
            return {
                asc: this.orderBy.field === field && this.orderBy.direction === 'asc',
                desc: this.orderBy.field === field && this.orderBy.direction === 'desc',
                active: this.orderBy.field === field
            }
        },
        setOrderBy(field) {
            this.$store.commit('setOrderBy', field)
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
        getAverageValue(period, couponType) {
            const key = this.activeCurrency + '-' + period + '-' + couponType + '-' + this.activeMetric;
            return this.averages[key];
        }
    }
}
</script>