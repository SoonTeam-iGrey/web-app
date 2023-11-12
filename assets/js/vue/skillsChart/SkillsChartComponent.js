const app = Vue.createApp({
  template: /**/`
    <div id="container_skillsRadarChart">
      <div>
        <canvas id="skillsRadarChart"></canvas>
      </div>
      <div>
        <canvas id="skillsLineChart"></canvas>
      </div>
    </div>
    `,
  data() {
    return {
      renderId: 0,
      chartData: {
        labels: [],
        datasets: []
      },
      rawData: {
        labels: [],
        datasets: []
      },
      lineRawData: {
        labels: [],
        datasets: []
      },
      availableLabels: [],
      selectedLabels: []
    }
  },
  computed: {},
  methods: {
    handleLabelClick(label) {
      if (this.selectedLabels.find(e => e === label)) {
        this.selectedLabels = this.selectedLabels.filter(e => e !== label)
      } else {
        this.selectedLabels = [...this.selectedLabels, label]
      }
      this.chartData = {
        ...this.chartData
      }
    },
    canStrikeThrough(label) {
      return !!this.selectedLabels.find(e => e === label)
    },
    extract(skillsHistory) {
      const sortComparator = (e1, e2) => e1["domain"] > e2["domain"]
      const result = {}
      let domains = new Set()
      for (let i = 0; i < skillsHistory.length; i++) {
        const skillHist = skillsHistory[i]
        if (!result[skillHist["moment"]]) {
          result[skillHist["moment"]] = []
        }
        result[skillHist["moment"]].push(skillHist)
        domains.add(skillHist["domain"])
      }
      domains = [...domains].sort(sortComparator)
      const keys = Object.keys(result)
      for (let i = 0; i < keys.length; i++) {
        const moment = keys[i]
        result[moment] = result[moment].sort(sortComparator)
      }
      return {
        labels: domains,
        datasets: [...Object.entries(result).map(
          entry => ({
            label: entry[0],
            data: entry[1].map(val => +val["theoreticalScore"] + +val["practicalScore"])
          })
        )]
      }
    },
    fetchSkills() {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: {
          "Authorization": `Bearer ${getCookie("authCookie")}`
        }
      }

      fetch("http://{{BASE_HOST}}/api/skills".replace("{{BASE_HOST}}", baseHost), requestOptions)
        .then(response => response.json())
        .then(result => {
          const newChartData = this.extract(result)
          this.availableLabels = newChartData["labels"]
          this.selectedLabels = ["game developer",
            "data science",
            "machine learning",
            "quality assurance",
            "devops",
            "cybersecurity",
            "database administrator",
            // 'mobile developer',
            "frontend"]
          this.chartData = newChartData
          this.lineRawData = result
        })
    },
    removeSelected(chartData) {
      const removeLabel = this.availableLabels.map(label => this.selectedLabels.indexOf(label) === -1)
      console.log("Selected: " + removeLabel)
      const removed = {
        labels: chartData["labels"].filter((_, indx) => removeLabel[indx]),
        datasets: chartData["datasets"].map(dataset => ({
          ...dataset,
          data: dataset["data"].filter((_, indx) => removeLabel[indx])
        }))
      }
      return removed
    },
    keepStartAndCurrent(dataChart) {
      const datasets = dataChart["datasets"].sort((a, b) => a["label"] > b["label"])
      return {
        ...dataChart,
        datasets: [datasets[0], datasets[datasets.length - 1]]
      }
    },
    extractLineData(skillsHistory) {
        const radarData = this.extract(skillsHistory);
        const xData = radarData['datasets'].map(ds => ds['label']).sort((a, b) => a > b)
        const labels = radarData['labels'];
        const result = {}
        for (let i = 0; i < xData.length; i++) {
          for (let j = 0; j < labels.length; j++) {
            if (!result[labels[j]]) {
              result[labels[j]] = [];
            }
            if (result[labels[j]]) {
              result[labels[j]].push(radarData['datasets'][i]['data'][j]);
            }
          }
        }
        return {
          labels,
          datasets: Object.entries(result).map(entry => ({
            label: entry[0],
            data: entry[1]
          }))
        }
      }
  },
  watch: {
    chartData(newValue) {
      const ctx = document.getElementById(`skillsRadarChart`)

      let newData = this.removeSelected(newValue);
      newData = this.keepStartAndCurrent(newValue)

      new Chart(ctx, {
        type: "radar",
        data: newData,
        options: {
          elements: {
            line: {
              borderWidth: 3
            }
          }
        }
      });

    },
    lineRawData(newValue) {
      const secondCtx = document.getElementById(`skillsLineChart`)

      let secondNewData = this.extractLineData(newValue);

      new Chart(secondCtx, {
        type: "line",
        data: secondNewData,
        options: {
          elements: {
            line: {
              borderWidth: 3
            }
          }
        }
      });
    }
  },
  mounted() {

    this.fetchSkills()

  }
})

app.mount("#skills_chart_component")