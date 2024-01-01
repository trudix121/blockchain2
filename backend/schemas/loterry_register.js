const mongoose = require('mongoose');

const numereLoterieSchema = new mongoose.Schema({
  numereCastigatoare: [Number],
  dataExtragere: { type: Date, default: Date.now }
});

const lotterynb = mongoose.model('blockchain', numereLoterieSchema, 'lottery');

module.exports = lotterynb