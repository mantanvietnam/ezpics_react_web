export const getNewProducts = async () => {
  const products = await fetch(`https://apis.ezpics.vn/apis/getNewProductAPI`);
  return await products.json();
};
