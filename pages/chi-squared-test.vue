<template>
  <el-container direction="vertical">
    <h1>Prueba de χ²</h1>

    <el-divider />

    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Método">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-radio v-model="form.method" label="native" style="width: 100%;" border>
              Nativo
            </el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio v-model="form.method" label="congruential" style="width: 100%;" border>
              Congruencial
            </el-radio>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="Parámetros">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-input v-model.number="form.quantity" prefix-icon="el-icon-setting" placeholder="Cantidad" />
          </el-col>

          <el-col :span="9">
            <el-button type="primary" icon="el-icon-grape" style="width: 100%;" @click="generate()">
              Generar
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="Números">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-input v-model="c_randoms" type="textarea" :rows="12" readonly />
          </el-col>
        </el-row>
      </el-form-item>

      <el-link :href="'data:text/plain;charset=utf-8,' + encodeURIComponent(c_randoms)" download="numeros">
        Descargar
      </el-link>

      <el-divider />

      <el-form-item label="Parámetros">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-input v-model.number="form.intervals" prefix-icon="el-icon-setting" placeholder="Intervalos" />
          </el-col>

          <el-col :span="9">
            <el-button type="primary" icon="el-icon-data-analysis" style="width: 100%;" @click="calculate()">
              Calcular χ²
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="Valor Crítico">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model.number="criticalCondition" suffix-icon="el-icon-star-off" placeholder="χ²" readonly />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <bar-chart v-if="criticalCondition !== undefined" :data="chartData" :options="chartOptions" />
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        method: 'native',
        quantity: 50,
        intervals: 10,
      },
      randoms: [],
      criticalCondition: undefined,
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Tabla de Frecuencias',
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    };
  },
  computed: {
    c_randoms: {
      get() {
        return this.randoms.map(
          rnd => rnd.toFixed(4),
        ).join(', ');
      },
    },
  },
  methods: {
    generate() {
      const { method, quantity } = this.form;

      const loading = this.$loading({ lock: true });

      if (method === 'native') {
        this.randoms = new Array(quantity).fill().map(() => Math.random());
      } else {
        const m = 2 ** 32;
        const a = 22695477;
        const c = 1;

        const lcgMixed = function* (multiplier, increment, modulus, seed) {
          let x = seed;

          while (true) {
            x = ((multiplier * x) + increment) % modulus;
            yield x;
          }
        };

        this.generator = lcgMixed(a, c, m, 3002);
        this.randoms = new Array(quantity).fill().map(() => this.generator.next().value / m);
      }

      this.criticalCondition = undefined;

      loading.close();
    },
    calculate() {
      const { intervals } = this.form;

      const loading = this.$loading({ lock: true });

      const min = Math.min(...this.randoms);
      const max = Math.max(...this.randoms);

      // const min = 0;
      // const max = 1;

      const step = (max - min) / intervals;

      let ca = 0;

      const intervalRanges = new Array(intervals).fill().map(
        (_v, idx) => [min + (step * idx), min + step * (idx + 1)],
      );

      const expectedFrequencies = [];
      const observedFrequencies = [];

      for (let i = 0; i < intervals; i++) {
        const expf = this.randoms.length / intervals;
        const [lowerBound, upperBound] = intervalRanges[i];

        const obsf = this.randoms.reduce(
          (f, rnd) => (i === intervals - 1 && rnd >= lowerBound) || (rnd >= lowerBound && rnd < upperBound) ? f + 1 : f, 0,
        );

        expectedFrequencies.push(expf);
        observedFrequencies.push(obsf);

        ca += ((expf - obsf) ** 2) / expf;
      }

      this.criticalCondition = ca;

      this.chartData = {
        labels: new Array(intervals).fill().map(
          (_v, idx) => {
            const [lowerBound, upperBound] = intervalRanges[idx];
            const midValue = ((upperBound - lowerBound) / 2) + lowerBound;
            return midValue.toFixed(4);
          },
        ),
        datasets: [{
          label: 'Frecuencias Esperadas',
          data: expectedFrequencies,
          borderWidth: 1,
          borderColor: 'rgb(144 147 153)',
          backgroundColor: 'rgba(144 147 153 / 60%)',
          hoverBorderColor: 'rgb(230 162 60)',
          hoverBackgroundColor: 'rgba(230 162 60 / 60%)',
        }, {
          label: 'Frecuencias Observadas',
          data: observedFrequencies,
          borderWidth: 1,
          borderColor: 'rgb(103 194 58)',
          backgroundColor: 'rgba(103 194 58 / 60%)',
          hoverBorderColor: 'rgb(245 108 108)',
          hoverBackgroundColor: 'rgba(245 108 108 / 60%)',
        }],
      };

      loading.close();
    },
  },
};
</script>
