window.onload = init;

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [5316116.203085163, 4921349.362210683],
      zoom: 7,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: 'js-map',
  });

  map.on('click', function (e) {
    console.log(e.coordinate);
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
}
