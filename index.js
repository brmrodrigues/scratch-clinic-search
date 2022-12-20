const { statesByCode, statesByName } = require('./states.js');

const express = require('express');

const app = express();

const dentalClinicsUrl = 'https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json';
const vetClinicsUrl = 'https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json';

function clinicNameExists(clinicName, queryName) {
  return (!queryName ||
          (clinicName == queryName));
}

function clinicStateExists(clinicState, queryState) {
  return (!queryState ||
          (clinicState == queryState || queryState == statesByCode[clinicState] || queryState == statesByName[clinicState]));
}

function isInClinicAvailability(clinicAvailability, queryFrom, queryTo) {
  return (!queryFrom || !queryTo ||
          (clinicAvailability.from >= queryFrom && clinicAvailability.to <= queryTo));
}

function updateVetClinicsKeys(vetClinics) {
  return vetClinics.map(({clinicName: name,
                          stateCode: stateName,
                          opening: availability}) => ({name, stateName, availability}));
}

app.get('/search', async (req, res) => {
  const queryName = req.query.name;
  const queryState = req.query.state;
  const queryFrom = req.query.from;
  const queryTo = req.query.to;

  try {
    let [dentalClinics, vetClinics] = await Promise.all([
      fetch(dentalClinicsUrl).then(r => r.json()),
      fetch(vetClinicsUrl).then(r => (r.json()))
    ]);
    const updatedVetClinics = vetClinics.map(({clinicName: name,
                                               stateCode: stateName,
                                               opening: availability}) => ({name, stateName, availability}));

    const allClinics = dentalClinics.concat(updateVetClinicsKeys(vetClinics));

    const filteredClinics = allClinics.filter(({name, stateName, availability}) => {
       return (clinicNameExists(name, queryName) &&
               clinicStateExists(stateName, queryState) &&
               isInClinicAvailability(availability, queryFrom, queryTo));
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
