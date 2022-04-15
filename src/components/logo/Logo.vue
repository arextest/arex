<template>
  <div class="logo" @click="onClick">
    <img src="@/assets/img/logo.png" />
    <span class="logo-text">AREX</span>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import {useRouter} from "vue-router";
  import {Route} from "@/common/constant";

  export default defineComponent({
    name: "Logo",
    setup: () => {
      const router = useRouter();

      const onClick = () => {
        router.push({ name: Route.PORTAL });
      }

      return {
        onClick
      }
    }
  });
</script>

<style scoped lang="less">
.logo {
  height: 64px;
  line-height: 64px;
  cursor: pointer;
}

.logo img {
  height: 36px;
  width: 36px;
  margin: -12px 16px 0 24px;
}

.logo span {
  color: var(--color-card);
  font-size: 28px;
  font-weight: 600;
}
</style>
