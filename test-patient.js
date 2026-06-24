const patientRepo = require("./packages/backend/repositories/patientRepo");
patientRepo.searchPatients({ search: "", page: 1, limit: 10 }).then(console.log).catch(console.error);
