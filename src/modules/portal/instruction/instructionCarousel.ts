export default () => {

  const getImgUrl = (i: number) => {
    return `@/assets/img/regression${i + 1}.png`;
  };

  return {
    getImgUrl
  }
}
