const { statesByCode, statesByName } = require('./states');

const clinicNameExists = (clinicName, queryName) =>
  (!queryName || (clinicName == queryName));

const clinicStateExists = (clinicState, queryState) =>
  (!queryState
   || (clinicState == queryState
       || queryState == statesByCode[clinicState]
       || queryState == statesByName[clinicState]));

const isInClinicAvailability = (clinicAvailability, queryFrom, queryTo) =>
   (!queryFrom || !queryTo
    || (clinicAvailability.from >= queryFrom && clinicAvailability.to <= queryTo));

const updateVetClinicsKeys = (vetClinics) =>
  vetClinics.map(({ clinicName: name,
                    stateCode: stateName,
                    opening: availability }) => ({name, stateName, availability}));

const filterClinics = (allClinics, { name: queryName, state: queryState, from: queryFrom, to: queryTo }) =>
  allClinics.filter(({name, stateName, availability}) =>
    clinicNameExists(name, queryName)
    && clinicStateExists(stateName, queryState)
    && isInClinicAvailability(availability, queryFrom, queryTo));

module.exports = {
  clinicNameExists,
  clinicStateExists,
  isInClinicAvailability,
  updateVetClinicsKeys,
  filterClinics
};
