const asyncHandler = require('./async');
const ogr2ogr = require('ogr2ogr');
const fs = require('fs');

exports.downloadSHPFile = (express, app) => {
  app.post(
    '/downloadSHP',
    asyncHandler(async (req, res, next) => {
      const featureCollection = req.body.geojson;
      //   const options = {
      //     layer: 'my-layer',
      //     targetCrs: 2154,
      //   };

      var shapefile = ogr2ogr('C:\\Users\\Fahmin\\Downloads\\features.geojson')
        .format('ESRI Shapefile')
        .skipfailures()
        .stream();
      shapefile.pipe(
        fs.createWriteStream('C:\\Users\\Fahmin\\Downloads\\shapefile.zip')
      );
    })
  );
};
