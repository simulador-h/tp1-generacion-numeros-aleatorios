<template>
  <div class="container">
    <div>
      <Logo />
      <h1>
        TP № 1
      </h1>
      <h2>
        Generación de Números Aleatorios
      </h2>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

h1 {
  font-size: 3rem;
  font-weight: 200;
  margin-top: 4rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 100;
}
</style>
