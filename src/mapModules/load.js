import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import { GeoJSON } from 'ol/format';
import { getColor } from './colors';

import azerbaijanObj from '../assets/Azerbaijan.json';
import lineObj from '../assets/Line.json';
import pointObj from '../assets/Point.json';
import point1Obj from '../assets/Point1.json';
import polygonObj from '../assets/Polygon.json';
import poliqon1Obj from '../assets/Poliqon1.json';

export const loadPGVectors = (map, elementId) => {
  const divVectorElement = document.getElementById(`${elementId}`);
  const PGLayers = [];

  const arrayOfTableNames = [
    'azerbaijan',
    'line',
    'point',
    'point1',
    'polygon',
    'poliqon1',
  ];

  const featureObjects = [
    azerbaijanObj,
    lineObj,
    pointObj,
    point1Obj,
    polygonObj,
    poliqon1Obj,
  ];

  for (const [counter, responseItem] of featureObjects.entries()) {
    const labelString = arrayOfTableNames[counter];
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
      style: (feature) => {
        return new Style({
          fill: new Fill({
            color: getColor(feature),
          }),
          stroke: new Stroke({
            color: '#333',
            width: 3,
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: getColor(feature),
            }),
          }),
        });
      },
    });
    map.addLayer(newLayer);
    newLayer.setVisible(false);
    PGLayers.push(newLayer);
  }
  return PGLayers;
};
