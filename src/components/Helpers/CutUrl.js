export const cutUrl = (str) => {
  if (str.includes('https://')) {
    str = str.replace('https://', '');
  }
  if (str.includes('http://')) {
    str = str.replace('http://', '');
  }
  if (str.includes('www.')) {
    str = str.replace('www.', '');
  }
  if (str.includes('/')) {
    str = str.replace('/', '');
  }
  return str;
};