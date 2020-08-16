<template>
  <el-container direction="vertical">
    <h1>Generador de números aleatorios</h1>

    <el-divider />

    <el-form ref="form" :model="form" label-width="120px" @submit.native.prevent="generate()">
      <el-form-item label="Método">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-radio v-model="form.algorithm" label="mixed" style="width: 100%;" border>
              Mixto
            </el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio v-model="form.algorithm" label="multiplicative" style="width: 100%;" border>
              Multiplicativo
            </el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio v-model="form.algorithm" label="additive" style="width: 100%;" border>
              Aditivo
            </el-radio>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="Parámetros">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model.number="form.multiplier" prefix-icon="el-icon-setting" placeholder="Multiplicador" />
          </el-col>
          <el-col :span="6">
            <el-input v-model.number="form.increment" prefix-icon="el-icon-setting" placeholder="Incremento" />
          </el-col>
          <el-col :span="6">
            <el-input v-model.number="form.modulus" prefix-icon="el-icon-setting" placeholder="Módulo" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="Semillas">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-input v-model.number="form.seeds[0]" suffix-icon="el-icon-star-off" placeholder="α" />
          </el-col>
          <el-col v-show="form.algorithm === 'additive'" :span="5">
            <el-input v-model.number="form.seeds[1]" suffix-icon="el-icon-star-off" placeholder="β" />
          </el-col>

          <el-col :span="form.algorithm !== 'additive' ? 13 : 8">
            <el-button type="primary" native-type="submit" icon="el-icon-grape" style="width: 100%;">
              Generar
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <el-input v-model="textarea" type="textarea" :rows="5" />
  </el-container>
</template>

<script>
const lcgMixed = function* (multiplier, increment, modulus, seed) {
  let x = seed;

  while (true) {
    x = ((multiplier * x) + increment) % modulus;
    yield x;
  }
};

const lcgMultiplicative = function* (multiplier, modulus, seed) {
  let x = seed;

  while (true) {
    x = (multiplier * x) % modulus;
    yield x;
  }
};

const lcgAdditive = function* (modulus, seeds) {
  let [x, y] = seeds;

  while (true) {
    const z = (x + y) % modulus;
    x = y;
    y = z;

    yield z;
  }
};

export default {
  data() {
    return {
      form: {
        algorithm: 'mixed',
        multiplier: undefined,
        increment: undefined,
        modulus: undefined,
        seeds: new Array(2),
      },
      rands: [],
    };
  },
  methods: {
    generate() {
      const { algorithm, multiplier, increment, modulus, seeds } = this.form;

      let generator;

      switch (algorithm) {
        case 'mixed':
          generator = lcgMixed(multiplier, increment, modulus, seeds[0]);
          break;
        case 'multiplicative':
          generator = lcgMultiplicative(multiplier, modulus, seeds[0]);
          break;
        case 'additive':
          generator = lcgAdditive(modulus, seeds);
          break;
      }

      const rands = new Array(10).fill().map(() => generator.next().value / modulus);
      console.log(rands);
    },
  },
};
</script>
