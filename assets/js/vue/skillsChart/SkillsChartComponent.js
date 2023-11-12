const app = Vue.createApp({
    template: /**/`
    <div id="container_skillsRadarChart">

        <canvas id="skillsRadarChart"></canvas>
    </div>
<!--        <p-->
<!--            style="margin: 5px 5px 5px 5px"-->
<!--            :style="{color: canStrikeThrough(label) ? 'red' : 'none'}"-->
<!--            v-for="(label, key) in availableLabels" :key="key"-->
<!--            @click="handleLabelClick(label)"-->
<!--        > {{ label }} </p>-->
    `,
    data() {
        return {
            renderId: 0,
            chartData: {
                labels: [],
                datasets: [],
            },
            rawData: {
                labels: [],
                datasets: [],
            },
            availableLabels: [],
            selectedLabels: [],
        }
    },
    computed: {

    },
    methods: {
        handleLabelClick(label) {
            console.log("clicked on: " + label)
            console.log(this.selectedLabels)
            if (this.selectedLabels.find(e => e === label)) {
                this.selectedLabels = this.selectedLabels.filter(e => e !== label);
            } else {
                this.selectedLabels = [...this.selectedLabels, label];
            }
            this.chartData = {
                ...this.chartData
            };
        },
        canStrikeThrough(label) {
            return !!this.selectedLabels.find(e => e === label);
        },
        extract(skillsHistory) {
            const sortComparator = (e1, e2) => e1['domain'] > e2['domain'];
            const result = {}
            let domains = new Set();
            for (let i = 0; i < skillsHistory.length; i++) {
                const skillHist = skillsHistory[i];
                if (!result[skillHist['moment']]) {
                    result[skillHist['moment']] = [];
                }
                result[skillHist['moment']].push(skillHist);
                domains.add(skillHist['domain']);
            }
            domains = [...domains].sort(sortComparator);
            const keys = Object.keys(result);
            for (let i = 0; i < keys.length; i++) {
                const moment = keys[i];
                result[moment] = result[moment].sort(sortComparator);
            }
            return {
                labels: domains,
                datasets: [...Object.entries(result).map(
                    entry => ({
                        label: entry[0],
                        data: entry[1].map(val => +val['theoreticalScore'] + +val['practicalScore'])
                    })
                )]
            };
        },
        fetchSkills() {
            const requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    'Authorization': `Bearer ${getCookie('authCookie')}`
                }
            };

            fetch("http://{{BASE_HOST}}/api/skills".replace("{{BASE_HOST}}", baseHost), requestOptions)
                .then(response => response.json())
                .then(result => {
                    const newChartData = this.extract(result);
                    this.availableLabels = newChartData['labels'];
                    this.selectedLabels = ['game developer',
                        'data science',
                        'machine learning',
                        'quality assurance',
                        'devops',
                        'cybersecurity',
                        'database administrator',
                        // 'mobile developer',
                        'frontend'];
                    this.chartData = newChartData;
                });
        },
        removeSelected(chartData) {
            const removeLabel = this.availableLabels.map(label => this.selectedLabels.indexOf(label) === -1)
            const removed =  {
                labels: chartData['labels'].filter((_, indx) => removeLabel[indx]),
                datasets: chartData['datasets'].map(dataset => ({
                    ...dataset,
                    data: dataset['data'].filter((_, indx) => removeLabel[indx])
                }))
            }
            return removed;
        }
    },
    watch: {
        chartData(newValue) {
            // document.getElementById("container_skillsRadarChart").innerHTML = "";
            // document.getElementById("container_skillsRadarChart").innerHTML += `<canvas id="skillsRadarChart${this.renderId++}"></canvas>`;
            const ctx = document.getElementById(`skillsRadarChart`);

            const newData = this.removeSelected(newValue);

            setTimeout(() => {
                new Chart(ctx, {
                    type: 'radar',
                    data: newData,
                    options: {
                        elements: {
                            line: {
                                borderWidth: 3
                            }
                        }
                    },
                });
            }, 100);
        }
    },
    mounted() {

        this.fetchSkills();

    }
});

app.mount("#skills_chart_component");