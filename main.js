window.onload = init;

function init() {
  // Raster standard layer
  const raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
  });

  const source = new ol.source.Vector();

  const vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 3,
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33',
        }),
      }),
    }),
  });

  // Layers
  const OSMStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: false,
    title: 'OSMStandard',
  });

  const OSMHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    }),
    visible: false,
    title: 'OSMHumanitarian',
  });

  const stamenTerrain = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
    }),
    visible: false,
    attributions:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    title: 'StamenTerrain',
  });

  // Layer group
  const baseLayerGroup = new ol.layer.Group({
    layers: [OSMStandard, OSMHumanitarian, stamenTerrain],
  });

  const map = new ol.Map({
    view: new ol.View({
      center: [5293437.691331564, 4928767.585347839],
      zoom: 8,
    }),
    layers: [
      // new ol.layer.Tile({
      //   source: new ol.source.OSM(),
      // }),
      raster,
      vector,
    ],
    target: 'js-map',
  });

  // map.on('click', function (e) {
  //   console.log(e.coordinate);
  // });

  map.addLayer(baseLayerGroup);

  // Layer Switcher
  const baseLayerElements = document.querySelectorAll(
    '.sidebar > label > input[type=radio]'
  );
  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener('change', function () {
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerTitle = element.get('title');
        element.setVisible(baseLayerTitle === baseLayerElementValue);
      });
    });
  }

  // Draw and Modify
  var modify = new ol.interaction.Modify({ source: source });
  map.addInteraction(modify);

  var draw, snap;
  var typeSelect = document.getElementById('type');

  function addInteractions() {
    draw = new ol.interaction.Draw({
      source: source,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
    snap = new ol.interaction.Snap({ source: source });
    map.addInteraction(snap);
  }

  function activatePointerMode() {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    map.removeInteraction(modify);
    document.getElementById('osm-standard').checked = true;
  }

  // Select draw tool
  typeSelect.onchange = function () {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
    document.getElementById('draw').checked = true;
  };

  // Handle radio button selections between pointer and draw mode
  document.getElementById('draw').addEventListener('change', addInteractions);
  document
    .getElementById('pointer')
    .addEventListener('change', activatePointerMode);

  // Handle zoom in
  document.getElementById('zoomInBtn').addEventListener('click', () => {
    map.getView().animate({
      zoom: map.getView().getZoom() + 1,
      duration: 250,
    });
  });

  // Handle zoom out
  document.getElementById('zoomOutBtn').addEventListener('click', () => {
    map.getView().animate({
      zoom: map.getView().getZoom() - 1,
      duration: 250,
    });
  });

  // W3 Fullscreen API with cross-browser availability
  document.getElementById('fullScreenBtn').addEventListener('click', () => {
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
}
