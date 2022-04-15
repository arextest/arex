<template>
  <div class="portal-footer">
    <div class="portal-footer-content">
      <div class="footer-content-title">
        <span class="content-title-trip">Trip</span>
        <span class="content-title-point">.</span>
        <span class="content-title-com">com</span>
        <span class="content-title-group"> Group</span>
      </div>
      <div class="footer-content-text">Copyright©1999-{{ year }}, ctrip.com. All rights reserved.</div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {usePortalFooter} from "@/modules/portal";

  export default defineComponent({
    name: "PortalFooter",
    setup: usePortalFooter
  });
</script>

<style scoped lang="less">
  .portal-footer {
    position: relative;
    height: 202px;
    background: #5678A8;
  }

  .portal-footer .portal-footer-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-card);
  }

  .portal-footer .footer-content-title {
    text-align: center;
    font-size: 24px;
  }

  .portal-footer .content-title-trip, .content-title-com, .content-title-point {
    font-weight: 700;
  }

  .portal-footer .content-title-point {
    color: orange;
  }

  .portal-footer .content-title-group {
    font-weight: 300;
  }

  .portal-footer .footer-content-text {
    margin-top: 24px;
    font-size: 18px;
  }
</style>
