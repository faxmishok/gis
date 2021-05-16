import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import { GeoJSON } from 'ol/format';
import fetchAllData from './request';

export const loadPGVectors = (map, elementId) => {
  const divVectorElement = document.getElementById(`${elementId}`);
  const PGLayers = [];
  fetchAllData().then((response) => {
    for (const [
      counter,
      responseItem,
    ] of response.featureCollection.entries()) {
      const labelString = response.arrayOfTableNames[counter];
      divVectorElement.innerHTML += `
      <label class="checkbox-container">
         ${labelString.charAt(0).toUpperCase() + labelString.slice(1)}
        <input type="checkbox" id="cb-${counter}"/>
        <span class="checkmark"></span>
      </label>
      `;
      var newLayer = new VectorLayer({
        title: 'My Title',
        source: new VectorSource({
          features: new GeoJSON().readFeatures(responseItem),
        }),
        style: new Style({
          fill: new Fill({
            color: '#906ccf',
          }),
          stroke: new Stroke({
            color: '#906ccf',
            width: 3,
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({ color: '#906ccf' }),
          }),
        }),
      });
      map.addLayer(newLayer);
      newLayer.setVisible(false);
      PGLayers.push(newLayer);
    }
  });
  return PGLayers;
};
