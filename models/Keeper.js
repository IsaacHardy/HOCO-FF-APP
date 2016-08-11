const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keeperSchema = new Schema({
  name: { type: String, required: true },
  round: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  ownerName: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now, required: true },
});

const Keeper = mongoose.model('Keeper', keeperSchema);

module.exports = Keeper;