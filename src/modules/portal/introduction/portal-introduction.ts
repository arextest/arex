import {computed, ref, watch} from "vue";

export default () => {
  const screenWidth = ref(document.documentElement.clientWidth);

  window.addEventListener("resize",() => screenWidth.value = document.body.offsetWidth);

  return {
    span: computed(() => screenWidth.value > 1750 ? 5 : 9)
  }
};
