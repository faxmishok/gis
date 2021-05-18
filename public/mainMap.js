import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import { DragRotate, Modify, Snap } from 'ol/interaction';
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
import {
  selectYourMap,
  selectYourDrawType,
  selectYourProjection,
} from './mapModules/controls';
import { createDraw, addDrawInteraction } from './mapModules/draw';
import { downloadGEO } from './mapModules/export';
import { altKeyOnly } from 'ol/events/condition';
import { loadPGVectors } from './mapModules/load';
import { getView } from './mapModules/projection';

/*=========================================
<!-- OVERRIDING AND ADDING MAP CONTROLS -->
=========================================*/
const fullScreenControl = new FullScreen();
const overViewMapControl = new OverviewMap({
  collapsed: true,
  layers: [
    new Tile({
      source: new OSM(),
    }),
  ],
});
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

/*===============
<!-- MAIN MAP -->
===============*/
var [lon, lat] = [5293437.691331564, 4928767.585347839];

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
    overViewMapControl,
    zoomSliderControl,
    zoomToExtentControl,
  ]),
});

/*=============================================================
<!-- Create source and layer for user location and drawings -->
=============================================================*/
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

/*=====================================
<!-- CHANGES THE SELECTED MAP LAYER -->
=====================================*/
map.addControl(selectYourMap);

const selectMap = document.getElementById('layer-select');
const onMapChange = () => {
  const scheme = selectMap.value;
  for (let i = 0; i < layers.length; ++i) {
    layers[i].setVisible(baseLayerNames[i].scheme === scheme);
  }
};

selectMap.addEventListener('change', onMapChange);

onMapChange();

/*==========================
<!-- Download as GeoJSON -->
==========================*/
downloadGEO(source, 'download-geo');

/*==============================================
<!-- Load and Visualize Postgres Data on Map -->
==============================================*/
const PGLayers = loadPGVectors(map, 'loaded-vectors');
const onCheck = () => {
  for (let i = 0; i < PGLayers.length; i++) {
    var labelElement = document.getElementById(`cb-${i}`);
    PGLayers[i].setVisible(labelElement.checked);
  }
};

const check = document.getElementById('loaded-vectors');
check.addEventListener('change', onCheck);

/*============================
<!-- Change Map Projection -->
============================*/
map.addControl(selectYourProjection);

const selectProjection = document.getElementById('proj-select');

const onProjChange = () => {
  const currentProjection = getView(selectProjection.value);
  map.setView(currentProjection);
};

selectProjection.addEventListener('change', onProjChange);

onProjChange();

/*=========================
<!-- Modify Map Vectors -->
=========================*/
const modify = new Modify({ source });
map.addInteraction(modify);

/*==========================
<!-- Add Drawing Feature -->
==========================*/
const selectDrawType = document.getElementById('draw-type');
let draw = createDraw(source, selectDrawType);

selectDrawType.onchange = () => {
  map.removeInteraction(draw);
  draw = createDraw(source, selectDrawType);
  addDrawInteraction(draw, map, selectDrawType.value);
};

addDrawInteraction(draw, map, selectDrawType.value);

map.addControl(selectYourDrawType);

/*=======================
<!-- Snap Interaction -->
=======================*/
const snap = new Snap({
  source: vector.getSource(),
});
map.addInteraction(snap);

/*==============================
<!-- Drag Rotate Interaction -->
==============================*/
const dragRotateInteraction = new DragRotate({
  condition: altKeyOnly,
});
map.addInteraction(dragRotateInteraction);

/*=====================
<!-- Handle Zoom In -->
=====================*/
const zoomInElement = document.getElementById('zoomInBtn');
zoomInElement.addEventListener('click', () => {
  map.getView().animate({
    zoom: map.getView().getZoom() + 1,
    duration: 250,
  });
});

/*======================
<!-- Handle zoom out -->
======================*/
const zoomOutElement = document.getElementById('zoomOutBtn');
zoomOutElement.addEventListener('click', () => {
  map.getView().animate({
    zoom: map.getView().getZoom() - 1,
    duration: 250,
  });
});

/*========================================================
<!-- W3 Fullscreen API with cross-browser availability -->
========================================================*/
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

/*=============================================================
<!-- Clear user drawn vectors from map & reload map element -->
=============================================================*/
const clearElement = document.getElementById('clearBtn');
clearElement.addEventListener('click', () => {
  map.removeLayer(vector);
  location.reload();
});
