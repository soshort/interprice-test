import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        items: [],
        currencies: [],
        activeCurrency: 'USD',
        years: [],
        activeYears: [],
        metrics: ['Spread', 'Yield', '3MLSpread'],
        activeMetric: 'Spread',
        filterInput: null,
        orderBy: {field: 'dateSent', direction: 'desc'},
        expandedCompanyNames: [],
    },
    getters: {
        filterInput: state => {
            return state.filterInput;
        },
        orderBy: state => {
            return state.orderBy;
        },
        activeCurrency: state => {
            return state.activeCurrency;
        },
        activeYears: state => {
            return state.activeYears.sort((a, b) => a - b);
        },
        activeMetric: state => {
            return state.activeMetric;
        },
        currencies: state => {
            const currencies = [];

            state.items.forEach(item => {
                item.Quote?.forEach(quote => {
                    currencies.push(quote.Currency)
                });
            });

            return [...new Set(currencies)];
        },
        years: state => {
            const years = [];

            state.items.forEach(item => {
                item.Quote?.forEach(quote => {
                    if (quote.Currency === state.activeCurrency) {
                        years.push(quote.Years);
                    }
                });
            });

            return [...new Set(years)].sort((a, b) => a - b);
        },
        metrics: state => {
            return state.metrics;
        },
        disabledMetrics: state => {
            return state.metrics.filter(metric => metric !== state.activeMetric);
        },
        companies: (state) => {
            return state.items.map(item => {
                const company = {
                    id: item.Id,
                    name: item.Company,
                    dateSent: item.DateSent,
                    preferred: item.Preferred,
                    quotes: item.Quote,
                    data: {},
                    hasHiddenData: false,
                    isExpanded: false,
                };

                item.Quote?.forEach(quote => {
                    state.metrics.forEach(metric => {
                        const key = quote.Currency + '-' + quote.Years + '-' + quote.CouponType + '-' + metric;
                        company.data[key] = quote[metric];

                        if (metric !== state.activeMetric && quote[metric] && quote.Currency === state.activeCurrency) {
                            company.hasHiddenData = true;
                        }
                    });
                });

                return company;
            });
        },
        filteredCompanies: (state, getters) => {
            if (state.filterInput) {
                return getters.companies
                    .filter(company => company.name.toLowerCase().includes(state.filterInput.toLowerCase()));
            }

            return getters.companies;
        },
        sortedCompanies: (state, getters) => {
            return [...getters.filteredCompanies].sort((a, b) => {
                const aDataExists = Object.keys(a.data).length > 0;
                const bDataExists = Object.keys(b.data).length > 0;
                if (!aDataExists && bDataExists) return 1;

                if (a[state.orderBy.field] === b[state.orderBy.field]) {
                    return b.preferred - a.preferred;
                }

                const sortDirection = state.orderBy.direction === 'asc' ? 1 : -1;
                return a[state.orderBy.field].localeCompare(b[state.orderBy.field]) * sortDirection;
            });
        },
        minValueKeys: (state, getters) => {
            const keys = {};

            getters.filteredCompanies.forEach(company => {
                company.quotes?.forEach(quote => {
                    const key = quote.Currency + '-' + quote.Years + '-' + quote.CouponType + '-' + state.activeMetric;

                    if (!(key in keys)) {
                        keys[key] = quote[state.activeMetric];
                    }

                    keys[key] = quote[state.activeMetric] ? Math.min(keys[key], quote[state.activeMetric]) : keys[key];
                });
            });

            return keys;
        },
        averages: (state, getters) => {
            const averages = {};

            getters.filteredCompanies.flatMap(company => company.quotes || [])
                .filter(quote => quote.Currency === state.activeCurrency && state.activeYears.includes(quote.Years))
                .forEach(quote => {
                    const key = quote.Currency + '-' + quote.Years + '-' + quote.CouponType + '-' + state.activeMetric;

                    if (quote[state.activeMetric]) {
                        averages[key] = averages[key] ?? [];
                        averages[key].push(quote[state.activeMetric]);
                    }
                });

            for (const key in averages) {
                averages[key] = averages[key].reduce((a, b) => a + b, 0) / averages[key].length;
            }

            return averages;
        },
        expandedCompanyNames: state => {
            return state.expandedCompanyNames;
        }
    },
    mutations: {
        setItems: (state, items) => {
            state.items = items;
        },
        setActiveCurrency: (state, currency) => {
            state.activeCurrency = currency;
            state.expandedCompanyNames = [];
        },
        setActiveYears: (state, years) => {
            state.activeYears = years;
        },
        toggleActivePeriod: (state, period) => {
            if (state.activeYears.includes(period)) {
                state.activeYears.splice(state.activeYears.indexOf(period), 1);
            } else {
                state.activeYears.push(period);
            }
        },
        setActiveMetric: (state, metric) => {
            state.activeMetric = metric;
            state.expandedCompanyNames = [];
        },
        setFilterInput: (state, value) => {
            state.filterInput = value;
            state.expandedCompanyNames = [];
        },
        setOrderBy(state, field) {
            state.orderBy.field = field;
            state.orderBy.direction = state.orderBy.direction === 'asc' ? 'desc' : 'asc';
        },
        toggleRow(state, name) {
            if (state.expandedCompanyNames.includes(name)) {
                state.expandedCompanyNames.splice(state.expandedCompanyNames.indexOf(name), 1);
            } else {
                state.expandedCompanyNames.push(name);
            }
        },
        collapseAllRows(state) {
            state.expandedCompanyNames = [];
        }
    },
    actions: {},
    modules: {}
})
