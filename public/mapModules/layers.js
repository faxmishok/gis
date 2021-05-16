import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';

export default (myLayers) => {
  const layers = [];

  let i;
  for (i = 0; i < myLayers.length; i++) {
    const layerDesc = myLayers[i];
    if (layerDesc.url === '') {
      layers.push(
        new TileLayer({
          visible: false,
          preload: Infinity,
          source: new OSM(),
        })
      );
    } else {
      layers.push(
        new TileLayer({
          visible: false,
          preload: Infinity,
          source: new OSM({
            url: layerDesc.url,
            crossOrigin: 'Anonymous',
          }),
        })
      );
    }
  }

  return layers;
};
