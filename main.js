window.onload = init;

function init() {
  // Overriding and adding map controls
  const fullScreenControl = new ol.control.FullScreen();
  const mousePositionControl = new ol.control.MousePosition();
  const overViewMapControl = new ol.control.OverviewMap({
    collapsed: true,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
  });
  const scaleLineControl = new ol.control.ScaleLine();
  const zoomSliderControl = new ol.control.ZoomSlider();
  const zoomToExtentControl = new ol.control.ZoomToExtent();

  // Raster standard OSM layer
  const OSMStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    title: 'OSMStandard',
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

  const map = new ol.Map({
    view: new ol.View({
      center: [5293437.691331564, 4928767.585347839],
      zoom: 8,
    }),
    layers: [
      // new ol.layer.Tile({
      //   source: new ol.source.OSM(),
      // }),
      OSMStandard,
      vector,
    ],
    target: 'js-map',
    keyboardEventTarget: document,
    controls: ol.control.defaults().extend([
      fullScreenControl,
      // mousePositionControl,
      overViewMapControl,
      // scaleLineControl,
      zoomSliderControl,
      zoomToExtentControl,
    ]),
  });

  // Layers
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
    layers: [OSMHumanitarian, stamenTerrain],
  });

  map.addLayer(baseLayerGroup);

  // map.on('click', function (e) {
  //   console.log(e.coordinate);
  // });

  const dragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly,
  });
  map.addInteraction(dragRotateInteraction);

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
  const typeSelect = document.getElementById('type');

  const OSMStandardElement = document.getElementById('osm-standard');

  function addInteractions() {
    OSMStandardElement.checked = true;
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
    OSMStandardElement.checked = true;
  }

  const drawElement = document.getElementById('draw');
  // Select draw tool
  typeSelect.onchange = function () {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
    drawElement.checked = true;
  };

  // Handle radio button selections between pointer and draw mode
  drawElement.addEventListener('change', addInteractions);
  document
    .getElementById('pointer')
    .addEventListener('change', activatePointerMode);

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

  const makeFullScreen = () => {
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
  };
  // W3 Fullscreen API with cross-browser availability
  const fullScreenElement = document.getElementById('fullScreenBtn');
  fullScreenElement.addEventListener('click', makeFullScreen);

  const clearElement = document.getElementById('clearBtn');
  clearElement.addEventListener('click', () => {
    map.removeLayer(vector);
    location.reload();
  });
}
