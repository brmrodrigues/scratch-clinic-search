const { statesByCode, statesByName } = require('./states.js');

const express = require('express');

const app = express();

const dentalClinicsUrl = 'https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json';
const vetClinicsUrl = 'https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json';

app.get('/search', async (req, res) => {
  const queryName = req.query.name;
  const queryState = req.query.state;
  const fromQuery = req.query.from;
  const toQuery = req.query.to;

  try {
    let [dentalClinics, vetClinics] = await Promise.all([
      fetch(dentalClinicsUrl).then(r => r.json()),
      fetch(vetClinicsUrl).then(r => (r.json()))
    ]);
    const updatedVetClinics = vetClinics.map(({clinicName: name,
                                               stateCode: stateName,
                                               opening: availability}) => ({name, stateName, availability}));
    const allClinics = dentalClinics.concat(updatedVetClinics);

    const filteredClinics = allClinics.filter(({name, stateName, availability}) => {
      if (queryName && name != queryName) {
        return false;
      }
      if (queryState && !(stateName == queryState || queryState == statesByCode[stateName] || queryState == statesByName[stateName])) {
        return false;
      }
      if (fromQuery && toQuery && !(availability.from <= fromQuery && availability.to >= toQuery)) {
        return false;
      }
      return true;
    });

    res.send(filteredClinics);
  }
  catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('API listening on port 3000');
});
