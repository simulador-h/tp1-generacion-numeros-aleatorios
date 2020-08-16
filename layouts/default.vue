<template>
  <el-container>
    <el-aside width>
      <el-menu :router="true" :default-active="$route.path" :collapse="isCollapsed">
        <el-menu-item @click="toogleCollapse()">
          <i class="el-icon-menu" />
        </el-menu-item>
        <el-menu-item index="/">
          <i class="el-icon-house" />
          <span>Home</span>
        </el-menu-item>
        <el-menu-item index="/random-generator">
          <i class="el-icon-coin" />
          <span>Generador</span>
        </el-menu-item>
        <el-menu-item index="/chi-squared-test">
          <i class="el-icon-document" />
          <span>Test de χ²</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main>
        <nuxt />
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-aside {
  width: 64px;
  overflow: visible;
}

.el-container > .el-main {
  padding: 25px 50px;
}

.el-menu {
  min-height: 100vh;
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>

<script>
export default {
  data() {
    return {
      isCollapsed: true,
    };
  },
  methods: {
    toogleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};

</script>
