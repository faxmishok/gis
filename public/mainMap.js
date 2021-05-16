import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile, Vector as VectorLayer, Group } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import { DragRotate, Modify, Draw, Snap } from 'ol/interaction';
import {
  FullScreen,
  MousePosition,
  OverviewMap,
  ScaleLine,
  ZoomSlider,
  ZoomToExtent,
  defaults as defaultControls,
} from 'ol/control';
import makeLayers from './mapModules/layers';
import { getColor } from './mapModules/colors';
import { selectYourMap, selectYourDrawType } from './mapModules/controls';
import { createDraw, addDrawInteraction } from './mapModules/draw';
import { downloadGEO } from './mapModules/export';
import { altKeyOnly } from 'ol/events/condition';
import { GeoJSON } from 'ol/format';

/*
===================================
OVERRIDING AND ADDING MAP CONTROLS
===================================
*/
const fullScreenControl = new FullScreen();
const mousePositionControl = new MousePosition();
const overViewMapControl = new OverviewMap({
  collapsed: true,
  layers: [
    new Tile({
      source: new OSM(),
    }),
  ],
});
const scaleLineControl = new ScaleLine();
const zoomSliderControl = new ZoomSlider();
const zoomToExtentControl = new ZoomToExtent();

const baseLayerNames = [
  {
    url: '',
    scheme: 'OSMStandard',
  },
  {
    url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    scheme: 'OSMHumanitarian',
  },
  {
    url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
    scheme: 'StamenTerrain',
  },
];

const layers = makeLayers(baseLayerNames);
/*
===================================
MAIN MAP
===================================
*/
const map = new Map({
  target: 'js-map',
  layers,
  view: new View({
    center: [5293437.691331564, 4928767.585347839],
    zoom: 8,
  }),
  keyboardEventTarget: document,
  controls: defaultControls().extend([
    fullScreenControl,
    // mousePositionControl,
    overViewMapControl,
    // scaleLineControl,
    zoomSliderControl,
    zoomToExtentControl,
  ]),
});

/*
========================================================
Create source and layer for user location and drawings
========================================================
*/
const source = new VectorSource();
const vector = new VectorLayer({
  source: source,
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
map.addLayer(vector);

/*
 ============================
 CHANGES THE SELECTED MAP LAYER
 ===========================
 */
map.addControl(selectYourMap);

const select = document.getElementById('layer-select');
const onChange = () => {
  const scheme = select.value;
  for (let i = 0; i < layers.length; ++i) {
    layers[i].setVisible(baseLayerNames[i].scheme === scheme);
  }
};

select.addEventListener('change', onChange);

onChange();

/*
=====================
Download as GeoJSON
=====================
*/
downloadGEO(source, 'download-geo');

/*
======================
MODIFY
======================
*/
const modify = new Modify({ source });
map.addInteraction(modify);

/*
===========================
Drawing
===========================
*/
const selectDrawType = document.getElementById('draw-type');
let draw = createDraw(source, selectDrawType);

selectDrawType.onchange = () => {
  map.removeInteraction(draw);
  draw = createDraw(source, selectDrawType);
  addDrawInteraction(draw, map, selectDrawType.value);
};

addDrawInteraction(draw, map, selectDrawType.value);

map.addControl(selectYourDrawType);
/*
 =====================
 Snap Interaction
 =====================
 */
const snap = new Snap({
  source: vector.getSource(),
});
map.addInteraction(snap);

/*
=========================
Drag Rotate Interaction
=========================
*/
const dragRotateInteraction = new DragRotate({
  condition: altKeyOnly,
});
map.addInteraction(dragRotateInteraction);

// Handle zoom in
const zoomInElement = document.getElementById('zoomInBtn');
zoomInElement.addEventListener('click', () => {
  map.getView().animate({
    zoom: map.getView().getZoom() + 1,
    duration: 250,
  });
});

// Handle zoom out
const zoomOutElement = document.getElementById('zoomOutBtn');
zoomOutElement.addEventListener('click', () => {
  map.getView().animate({
    zoom: map.getView().getZoom() - 1,
    duration: 250,
  });
});

// W3 Fullscreen API with cross-browser availability
const fullScreenElement = document.getElementById('fullScreenBtn');
fullScreenElement.addEventListener('click', () => {
  var mapElement = document.getElementById('js-map');
  if (mapElement.requestFullscreen) {
    mapElement.requestFullscreen();
  } else if (mapElement.webkitRequestFullscreen) {
    mapElement.webkitRequestFullscreen();
  } else if (mapElement.mozRequestFullScreen) {
    mapElement.mozRequestFullScreen();
  } else if (mapElement.msRequestFullscreen) {
    mapElement.msRequestFullscreen();
  }
});

const clearElement = document.getElementById('clearBtn');
clearElement.addEventListener('click', () => {
  map.removeLayer(vector);
  location.reload();
});
