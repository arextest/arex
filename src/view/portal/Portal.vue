<template>
  <div class="portal">
    <portal-header />
    <portal-introduction class="portal-introduction" />
    <portal-instruction class="portal-instruction" />
    <portal-footer class="portal-footer" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import PortalHeader from "@/view/portal/header/PortalHeader.vue";
import PortalIntroduction from "@/view/portal/introduction/PortalIntroduction.vue";
import PortalInstruction from "@/view/portal/instruction/PortalInstruction.vue";
import PortalFooter from "@/view/portal/footer/PortalFooter.vue";

export default defineComponent({
  name: "Portal",
  components: {
    PortalHeader,
    PortalIntroduction,
    PortalInstruction,
    PortalFooter
  }
});
</script>

<style scoped lang="less">
  .portal {
    background: var(--color-card);
    margin: -24px;
  }

  .portal .portal-introduction {
    width: 60%;
    margin: 60px auto 0;
  }

  .portal .portal-instruction {
    width: 740px;
    margin: 60px auto 0;
  }

  .portal .portal-footer {
    margin-top: 139px;
  }
</style>
