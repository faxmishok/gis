import { GeoJSON } from 'ol/format';

// TODO: add shapefile download implementation
// export const downloadSHP = (source, downloadElementId) => {
//   const format = new GeoJSON({ featureProjection: 'EPSG: 3857' });
//   const download = document.getElementById(`${downloadElementId}`);
//   source.on('change', () => {
//     const features = source.getFeatures();
//     // const json = format.writeFeatures(features);
//     // download.href = `data:text/json;charset=utf-8, ${json}`;
//   });
// };

export const downloadGEO = (source, downloadElementId) => {
  const format = new GeoJSON({ featureProjection: 'EPSG: 3857' });
  const download = document.getElementById(`${downloadElementId}`);
  source.on('change', () => {
    const features = source.getFeatures();
    const json = format.writeFeatures(features);
    download.href = `data:text/json;charset=utf-8, ${json}`;
  });
};
