<template>
  <div class="portal-header">
    <div class="portal-header-content">
      <div class="header-content-title">{{ $t("efficientServicePlatformForAutomatedTesting") }}</div>
      <div class="header-content-text">..........................</div>
    </div>
    <div class="portal-header-background">
      <img class="header-background-img" src="@/assets/img/portal_background.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "PortalHeader",
});
</script>

<style scoped lang="less">
  .portal-header {
    position: relative;
    height: 464px;
    background: linear-gradient(-38.73deg, rgb(0, 118, 245) 0%, rgb(0, 167, 250) 100%);
  }

  .portal-header .portal-header-content {
    position: absolute;
    left: 15%;
    top: 20%;
    width: 40%;
    color: var(--color-card);
  }

  .portal-header .header-content-title {
    font-size: 40px;
    font-weight: 500;
    letter-spacing: 0.76px;
  }

  .portal-header .header-content-text {
    margin-top: 24px;
    font-size: 20px;
    width: 80%;
  }

  .portal-header .portal-header-background {
    width: 100%;
    height: 100%;
    text-align: right;
  }

  .portal-header .header-background-img {
    width: 40%;
    height: 100%;
    max-width: 749px;
  }
</style>
