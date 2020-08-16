<template>
  <el-container direction="vertical">
    <h1>Generador de números aleatorios</h1>

    <el-divider />

    <el-form ref="form" :model="form" label-width="120px" @submit.native.prevent="generate()">
      <el-form-item label="Método">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-radio v-model="form.algorithm" label="mixed" style="width: 100%;" :disabled="!!generator" border>
              Mixto
            </el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio v-model="form.algorithm" label="multiplicative" style="width: 100%;" :disabled="!!generator" border>
              Multiplicativo
            </el-radio>
          </el-col>
          <el-col :span="6">
            <el-radio v-model="form.algorithm" label="additive" style="width: 100%;" :disabled="!!generator" border>
              Aditivo
            </el-radio>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="Parámetros">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model.number="form.multiplier" prefix-icon="el-icon-setting" placeholder="Multiplicador" :disabled="!!generator" />
          </el-col>
          <el-col :span="6">
            <el-input v-model.number="form.increment" prefix-icon="el-icon-setting" placeholder="Incremento" :disabled="!!generator" />
          </el-col>
          <el-col :span="6">
            <el-input v-model.number="form.modulus" prefix-icon="el-icon-setting" placeholder="Módulo" :disabled="!!generator" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="Semillas">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-input v-model.number="form.seeds[0]" suffix-icon="el-icon-star-off" placeholder="α" :disabled="!!generator" />
          </el-col>
          <el-col v-show="form.algorithm === 'additive'" :span="5">
            <el-input v-model.number="form.seeds[1]" suffix-icon="el-icon-star-off" placeholder="β" :disabled="!!generator" />
          </el-col>

          <el-col v-if="!generator" :span="form.algorithm !== 'additive' ? 13 : 8">
            <el-button type="primary" native-type="submit" icon="el-icon-grape" style="width: 100%;">
              Generar
            </el-button>
          </el-col>

          <el-col v-else :span="form.algorithm !== 'additive' ? 13 : 8">
            <el-button-group style="width: 100%;">
              <el-button type="primary" icon="el-icon-grape" style="width: 75%;" @click="generateNext()">
                Siguente
              </el-button>
              <el-button type="primary" icon="el-icon-edit-outline" style="width: 25%;" @click="editGenerator()" />
            </el-button-group>
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
    </el-form>
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
      randoms: [],
      generator: undefined,
    };
  },
  computed: {
    c_randoms: {
      get() {
        return this.randoms.map(
          rnd => rnd.toString().substring(0, 6),
        ).join(', ');
      },
    },
  },
  methods: {
    generate() {
      const { algorithm, multiplier, increment, modulus, seeds } = this.form;

      const loading = this.$loading({ lock: true });

      switch (algorithm) {
        case 'mixed':
          this.generator = lcgMixed(multiplier, increment, modulus, seeds[0]);
          break;
        case 'multiplicative':
          this.generator = lcgMultiplicative(multiplier, modulus, seeds[0]);
          break;
        case 'additive':
          this.generator = lcgAdditive(modulus, seeds);
          break;
      }

      this.randoms = new Array(20000).fill().map(() => this.generator.next().value / modulus);

      loading.close();
    },

    generateNext() {
      this.randoms.push(
        this.generator.next().value / this.form.modulus,
      );
    },

    editGenerator() {
      this.generator = undefined;
      this.randoms = [];
    },
  },
};
</script>
