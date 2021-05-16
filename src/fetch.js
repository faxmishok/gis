const asyncHandler = require('./async');
const dbgeo = require('dbgeo');

const fetchDataToServe = (app, client) => {
  app.get(
    '/fetch',
    asyncHandler(async (req, res, next) => {
      var arrayOfTableNames = [];
      var featureCollection = [];

      await client
        .query(
          `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name!='spatial_ref_sys'`
        )
        .then((resultArray) => {
          const arrayOfTables = resultArray.rows;
          for (const arrayItem of arrayOfTables) {
            arrayOfTableNames.push(arrayItem.table_name);
          }
        })
        .catch((e) => console.log(e.stack));

      for (const tableName of arrayOfTableNames) {
        await client
          .query(`SELECT * FROM ${tableName}`)
          .then((resultFeature) => {
            dbgeo.parse(
              resultFeature.rows,
              {
                outputFormat: 'geojson',
              },
              function (err, resultGeoJSON) {
                featureCollection.push(resultGeoJSON);
              }
            );
          });
      } // query end
      await res.status(200).send(featureCollection);
    })
  );
};

module.exports = fetchDataToServe;
