<template>
  <div class="portal-introduction">
    <div class="portal-introduction-capability">
      <div class="introduction-title">{{ $t("capabilities") }}</div>
      <div class="flex capability-first-row">
        <introduction-item
          :image-src="'/portal1.png'"
          title="Title"
          :contents="['........................', '........................', '........................']"
        />
        <introduction-item
          :image-src="'/portal2.png'"
          title="Title"
          :contents="['........................', '........................', '........................']"
        />
      </div>
      <div class="flex capability-second-row">
        <introduction-item
          :image-src="'/portal3.png'"
          title="Title"
          :contents="['........................', '........................', '........................']"
        />
        <introduction-item
          :image-src="'/portal4.png'"
          title="Title"
          :contents="['........................', '........................', '........................']"
        />
      </div>
    </div>
    <div class="portal-introduction-feature">
      <div class="introduction-title">{{ $t("features") }}</div>
      <a-row type="flex" justify="center">
        <a-col :span="span">
          <introduction-item
            :type="0"
            :image-src="'/portal5.png'"
            :title="$t('efficient')"
            :contents="['........................']"
          />
        </a-col>
        <a-col :span="span">
          <introduction-item
            :type="0"
            :image-src="'/portal6.png'"
            :title="$t('transparent')"
            :contents="['........................']"
          />
        </a-col>
        <a-col :span="span">
          <introduction-item
            :type="0"
            :image-src="'/portal7.png'"
            :title="$t('realTime')"
            :contents="['........................']"
          />
        </a-col>
        <a-col :span="span">
          <introduction-item
            :type="0"
            :image-src="'/portal8.png'"
            :title="$t('scientific')"
            :contents="['........................']"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {usePortalIntroduction} from "@/modules/portal";

import IntroductionItem from "@/view/portal/introduction/IntroductionItem.vue";

export default defineComponent({
  name: "PortalIntroduction",
  setup: usePortalIntroduction,
  components: {
    IntroductionItem,
  }
});
</script>

<style scoped lang="less">
  .portal-introduction .introduction-title {
    text-align: center;
    font-size: 28px;
    font-weight: 500;
  }

  .portal-introduction .capability-first-row {
    margin-top: 40px;
    justify-content: space-around;
  }

  .portal-introduction .capability-second-row {
    margin-top: 56px;
    justify-content: space-around;
  }

  .portal-introduction .portal-introduction-feature {
    margin-top: 60px;
    background: #F8FAFD;
    padding: 48px 0;
  }
</style>
