console.log("creating the app...")

const app = Vue.createApp({
    template: /**/`
        <canvas id="skillsRadarChart"></canvas>
    `,
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [],
            }
        }
    },
    computed: {

    },
    methods: {

    },
    watch: {
        chartData(newValue, oldValue) {
            console.log("new data setting..." + JSON.stringify(newValue))
            const ctx = document.getElementById('skillsRadarChart');

            new Chart(ctx, {
                type: 'radar',
                data: newValue,
                options: {
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    }
                },
            });
        }
    },
    mounted() {
        console.log("mounting...")
        this.chartData = {
            labels: [
                'Eating',
                'Drinking',
                'Sleeping',
                'Designing',
                'Coding',
                'Cycling',
                'Running'
            ],
            datasets: [{
                label: 'skills',
                data: [65, 59, 90, 81, 56, 55, 40],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }]
        };
    }
});

app.mount("#skills_chart_component");