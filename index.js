const express = require('express');
const clinics = require('./clinics')

const app = express();

app.get('/clinicSearch', clinics.list)

app.listen(3000, () => {
  console.log('API listening on port 3000');
});

module.exports = app;
