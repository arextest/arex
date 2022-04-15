export default (props: any, { emit }: any) => {
  const onSelect = () => {
    emit("onSelect");
  }

  return {
    onSelect
  }
};
