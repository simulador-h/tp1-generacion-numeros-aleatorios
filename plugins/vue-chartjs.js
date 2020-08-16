import Vue from 'vue';
import { Bar } from 'vue-chartjs';

Vue.component('bar-chart', {
  extends: Bar,
  props: ['data', 'options'],
  watch: {
    options() {
      this.$data._chart.destroy();
      this.renderChart(this.data, this.options);
    },
    data() {
      this.$data._chart.destroy();
      this.renderChart(this.data, this.options);
    },
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
});
