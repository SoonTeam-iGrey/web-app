const app = Vue.createApp({
  template: /*html*/`
<div v-for="(candidate, key) in candidates" :key="key" class="col-md-6 col-lg-4 order-2 mb-4">
  <div class="card h-100">
    <div class="card-header d-flex align-items-center justify-content-between">
                      <h5 class="card-title m-0 me-2">Skill Radar</h5>
      <div class="dropdown">
                        <button
                          class="btn p-0"
                          type="button"
                          id="transactionID"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i class="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                          <a class="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                          <a class="dropdown-item" href="javascript:void(0);">Last Month</a>
                          <a class="dropdown-item" href="javascript:void(0);">Last Year</a>
                        </div>
      </div>
     </div>
                    <div class="card-body">
                      <canvas :id="'skills_chart_component_' + candidate.profile.username">
                      {{ candidate.profile.username }}
                      </canvas>
                    </div>
                  </div>
                  </div>
<div  v-for="(candidate, key) in candidates" :key="key" class="col-md-6 col-lg-4 mb-3">
                  <div class="card text-center">
                    <div class="card-header"> Numero </div>
                    <div class="card-body">
                      <p class="d-flex mb-4 pb-1">
                          First Name: {{ candidate.profile.firstName }}
                        </p>  
                        <p class="d-flex mb-4 pb-1">
                          Last Name: {{ candidate.profile.lastName }}
                        </p> 
                        <p class="d-flex mb-4 pb-1">
                          e-mail: {{ candidate.profile.email }}
                        </p> 
                        <p class="d-flex mb-4 pb-1">
                          candidate: {{ candidate.profile.phoneNumber }}
                        </p>  
                        <p class="d-flex mb-4 pb-1">
                          score: {{ candidate['totalScore'] }}
                        </p>  
                        <div style="margin: 3px">
                      <a v-bind:href="${"`tel:${candidate.profile.phoneNumber}`"}" class="btn btn-primary">Contact via Phone</a>
                        </div>
                        <div style="margin: 3px">
                      <a v-bind:href="${"`mailto:${candidate.profile.email}`"}" class="btn btn-primary">Contact via Email</a>
                        </div>
                    </div>
                  </div>
                </div>
  `,
  data() {
    return {
      candidates: [],
      rawCandidates: [],
    }
  },
  methods: {
    fetchData() {
      const requestOptions = {
        method: "POST",
        redirect: "follow",
        headers: {
          "Authorization": `Bearer ${getCookie("authCookie")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(["tudache123", "marianadrew", "budrescu"])
      }

      fetch("http://{{BASE_HOST}}/api/profile/schedule".replace("{{BASE_HOST}}", baseHost), requestOptions)
        .then(response => response.json())
        .then(result => {
          this.candidates = result;
          setTimeout(() => {
            this.rawCandidates = result;
          }, 200);
        });
    }
  },
  computed: {

  },
  watch: {
    rawCandidates(newValue, _oldValue) {
      for (let i = 0; i < newValue.length; i++) {
        const candidate = newValue[i];
        const ctx = document.getElementById(`skills_chart_component_${candidate.profile.username}`)

        const radarChartData = {
          labels: candidate.radarSkillsValue.domains,
          datasets: [
            {
              label: candidate.profile.firstName + " " + candidate.profile.lastName,
              data: candidate.radarSkillsValue.values,
              fill: true,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)'
            }
          ]
        }

        const chart = new Chart(ctx, {
          type: "radar",
          data: radarChartData,
          options: {
            elements: {
              line: {
                borderWidth: 3
              }
            }
          }
        });
        chart.render();
      }
    }
  },
  mounted() {
    this.fetchData();
  }
});

app.mount("#scheduledCandidates");