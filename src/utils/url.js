import slugify from "slugify"

export const convertSLugUrl = (str) =>{
  if (!str) return ""
  str = slugify(str, {
    lower: true,
    locale: 'vi'
  });
  return str;
}