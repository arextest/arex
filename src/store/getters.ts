export default {
  routes: (state: any) => state.routes || [],
  screenWidth: (state: any) => state.screenWidth || document.body.offsetWidth
}
