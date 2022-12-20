const { clinicNameExists,
        clinicStateExists,
        isInClinicAvailability,
        updateVetClinicsKeys,
        filterClinics
      } = require('./logic.js');

const dentalClinicsUrl = 'https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json';
const vetClinicsUrl = 'https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json';

const list = async (req, res) => {
  const queryName = req.query.name;
  const queryState = req.query.state;
  const queryFrom = req.query.from;
  const queryTo = req.query.to;

  try {
    let [dentalClinics, vetClinics] = await Promise.all([
      fetch(dentalClinicsUrl).then(r => r.json()),
      fetch(vetClinicsUrl).then(r => (r.json()))
    ]);

    const allClinics = dentalClinics.concat(updateVetClinicsKeys(vetClinics));

    const filteredClinics = filterClinics(allClinics, req.query);

    res.send(filteredClinics);
  }
  catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = { list };
