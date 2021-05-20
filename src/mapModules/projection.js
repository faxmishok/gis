import proj4 from 'proj4';
import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { register } from 'ol/proj/proj4';

export const getView = (projection) => {
  // Set custom projection
  proj4.defs('EPSG:32639', '+proj=utm +zone=39 +datum=WGS84 +units=m +no_defs');
  register(proj4);

  // Centered longitude & latitude for Azerbaijan
  const lonLatCoords = [47.55175983657498, 40.430962138673834];

  const webMercatorView = new View({
    center: fromLonLat(lonLatCoords, 'EPSG:3857'),
    projection: 'EPSG:3857',
    zoom: 8,
  });

  const geodeticView = new View({
    center: fromLonLat(lonLatCoords, 'EPSG:4326'),
    projection: 'EPSG:4326',
    zoom: 8,
  });

  const UTMAzerbaijanView = new View({
    center: fromLonLat(lonLatCoords, 'EPSG:32639'),
    projection: 'EPSG:32639',
    zoom: 8,
  });

  switch (projection) {
    case 'EPSG:3857':
      return webMercatorView;
      break;
    case 'EPSG:4326':
      return geodeticView;
      break;
    case 'EPSG:32639':
      return UTMAzerbaijanView;
      break;
    default:
      return null;
      break;
  }
};
