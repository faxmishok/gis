import { toLonLat } from 'ol/proj';

export const eee = () => {
  const webMercatorCoordinates = [5293437.691331564, 4928767.585347839];

  console.log(toLonLat(webMercatorCoordinates));
};
