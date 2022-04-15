<template>
  <div class="user-menu">
    <div class="menu-item">
      <question-circle-outlined class="menu-item-icon" />
      <span>{{ $t('help') }}</span>
    </div>
<!--    <div class="menu-item" @click="onToggle">
      <global-outlined class="menu-item-icon" />
      <span>{{ lang }}</span>
    </div>-->
    <template v-if="email">
      <a-dropdown class="menu-item">
        <div>
          <a-avatar class="menu-item-avatar">X</a-avatar>
          <span>x_qi</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item>{{ $t("logout") }}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template v-else>
      <div class="menu-item" @click="onLogin">{{ $t("login") }}</div>
    </template>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {GlobalOutlined, QuestionCircleOutlined} from "@/common/icon";
  import {useI18n} from "vue-i18n";
  import {setLocale} from "@/common/locale";
  import {Lang} from "@/common/constant";
  import {useGetters} from "vuex-composition-helpers";

  export default defineComponent({
    name: "UserMenu",
    components: {
      QuestionCircleOutlined,
      GlobalOutlined
    },
    setup: () => {
      const { locale } = useI18n();
      const { email } = useGetters(["email"]);

      const onToggle = () => {
        setLocale(locale.value === Lang.EN ? Lang.ZH : Lang.EN);
        location.reload();
      }

      const onLogin = () => {

      };

      return {
        email,
        lang: locale.value === Lang.EN ? 'EN' : '中文',

        onToggle,
        onLogin
      }
    }
  });
</script>

<style scoped lang="less">
  .user-menu {
    display: flex;
    align-items: center;
  }

  .user-menu .menu-item {
    margin-right: 24px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  .user-menu .menu-item-icon {
    margin-right: 8px;
    font-size: 22px;
    vertical-align: -5px;
  }

  .user-menu .menu-item-avatar {
    margin-right: 8px;
  }
</style>
