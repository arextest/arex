<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="onClick">Back Home</a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useRouter} from "vue-router";
import {Route} from "@/common/constant";

export default defineComponent({
  name: "404",
  setup: () => {
    const router = useRouter();

    return {
      onClick: () => router.push({ name: Route.PORTAL })
    }
  }
});
</script>

<style scoped lang="less">

</style>
