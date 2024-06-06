export const getNewProducts = async () => {
  return fetch("https://apis.ezpics.vn/apis/getNewProductAPI").then((res) =>
    res.json()
  );
};
