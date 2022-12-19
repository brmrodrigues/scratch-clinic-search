const express = require('express');

const app = express();

app.get('/search', async (req, res) => {
  const name = req.query.name;
  const state = req.query.state;
  const from = req.query.from;
  const to = req.query.to;

  try {
    let [dentalClinics, vetClinics] = await Promise.all([
      fetch('https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json').then(r => r.json()),
      fetch('https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json').then(r => r.json())
    ]);
    res.send(vetClinics);
  }
  catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('API listening on port 3000');
});
