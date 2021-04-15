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
        width: 2,
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
      center: [5316116.203085163, 4921349.362210683],
      zoom: 7,
    }),
    layers: [raster, vector],
    target: 'js-map',
  });

  // map.on('click', function (e) {
  //   console.log(e.coordinate);
  // });

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

  // Handle change event
  typeSelect.onchange = function () {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
  };

  addInteractions();
}
