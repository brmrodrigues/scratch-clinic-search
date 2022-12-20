const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');

const californiaClinics =
[
  {
    name: 'Mount Sinai Hospital',
    stateName: 'California',
    availability: { from: '12:00', to: '22:00' }
  },
  {
    name: 'Scratchpay Test Pet Medical Center',
    stateName: 'California',
    availability: { from: '00:00', to: '24:00' }
  },
  {
    name: 'National Veterinary Clinic',
    stateName: 'CA',
    availability: { from: '15:00', to: '22:30' }
  },
  {
    name: 'Scratchpay Test Pet Medical Center',
    stateName: 'CA',
    availability: { from: '00:00', to: '24:00' }
  }
];

const goodHealthHomeClinics =
[
  {
    name: 'Good Health Home',
    stateName: 'Alaska',
    availability: { from: '10:00', to: '19:30' }
  },
  {
    name: 'Good Health Home',
    stateName: 'FL',
    availability: { from: '15:00', to: '20:00' }
  }
];

const clinicsAvailableFrom10to22 =
[
  {
    name: 'Good Health Home',
    stateName: 'Alaska',
    availability: { from: '10:00', to: '19:30' }
  },
  {
    name: 'Cleveland Clinic',
    stateName: 'New York',
    availability: { from: '11:00', to: '22:00' }
  },
  {
    name: 'Mount Sinai Hospital',
    stateName: 'California',
    availability: { from: '12:00', to: '22:00' }
  },
  {
    name: 'UAB Hospital',
    stateName: 'Alaska',
    availability: { from: '11:00', to: '22:00' }
  },
  {
    name: 'Good Health Home',
    stateName: 'FL',
    availability: { from: '15:00', to: '20:00' }
  },
  {
    name: 'City Vet Clinic',
    stateName: 'NV',
    availability: { from: '10:00', to: '22:00' }
  }
];

const clinicsFromAlaskaAvailableFrom10to22 =
[
  {
    name: 'Good Health Home',
    stateName: 'Alaska',
    availability: { from: '10:00', to: '19:30' }
  },
  {
    name: 'UAB Hospital',
    stateName: 'Alaska',
    availability: { from: '11:00', to: '22:00' }
  }
];

const goodHealthHomeFromAlaskaAvailableFrom10to22 =
[
  {
    name: 'Good Health Home',
    stateName: 'Alaska',
    availability: { from: '10:00', to: '19:30' }
  }
];

describe('Testing list clinics endpoint', () => {
  // no filter
  it('returns all clinics when no filter is provided', async () => {
    const response = await request(app)
      .get('/clinicSearch')
    expect(response.status).equals(200);
    expect(response.body).to.be.have.lengthOf(15);
  });

  // empty results when filter doesn't match
  it('returns no clinics when name filter is not found', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ name: 'Non-existing clinic' })
    expect(response.status).equals(200);
    expect(response.body).to.be.have.lengthOf(0);
  });

  it('returns no clinics when state filter is not found', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ state: 'Non-existing state' })
    expect(response.status).equals(200);
    expect(response.body).to.be.have.lengthOf(0);
  });

  // single filter matches
  it('returns californiaClinics on filter state=CA', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ state: 'CA' })
    expect(response.status).equals(200);
    expect(response.body).to.have.deep.members(californiaClinics);
  });

  it('returns californiaClinics on filter state=California', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ state: 'California' })
    expect(response.status).equals(200);
    expect(response.body).to.have.deep.members(californiaClinics);
  });

  it('returns goodHealthHomeClinics on filter name=Good Health Home', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ name: 'Good Health Home' })
    expect(response.status).equals(200);
    expect(response.body).to.have.deep.members(goodHealthHomeClinics);
  });

  it('returns only clinics available from 10:00 to 22:00', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ from: '10:00', to: '22:00' })
    expect(response.status).equals(200);
    expect(response.body).to.have.deep.members(clinicsAvailableFrom10to22);
  });

  it('returns only clinics available from 10:00 to 22:00', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ from: '10:00', to: '22:00' })
    expect(response.status).equals(200);
    expect(response.body).to.have.deep.members(clinicsAvailableFrom10to22);
  });

  it('returns all clinics when only from filter is provided', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ from: '10:00' })
    expect(response.status).equals(200);
    expect(response.body).to.be.have.lengthOf(15);
  });

  it('returns all clinics when only to filter is provided', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ to: '23:30' })
    expect(response.status).equals(200);
    expect(response.body).to.be.have.lengthOf(15);
  });

  it('returns all clinics from 00:00 to 24:00', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ from: '00:00', to: '24:00' })
    expect(response.status).equals(200);
    expect(response.body).to.be.have.lengthOf(15);
  });

  // multiple filters match
  it('returns all clinics from Alaska that are available from 10:00 to 22:00', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ state: 'Alaska', from: '10:00', to: '22:00' })
    expect(response.status).equals(200);
    expect(response.body).to.be.deep.members(clinicsFromAlaskaAvailableFrom10to22);
  });

  it('returns all clinics from Alaska that are available from 10:00 to 22:00', async () => {
    const response = await request(app)
      .get('/clinicSearch')
      .query({ name: 'Good Health Home', state: 'Alaska', from: '10:00', to: '22:00' })
    expect(response.status).equals(200);
    expect(response.body).to.be.deep.members(goodHealthHomeFromAlaskaAvailableFrom10to22);
  });
});
