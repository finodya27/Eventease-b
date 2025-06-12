const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  jenisUsaha: { type: String, required: true },
  namaUsaha: { type: String, required: true },
  deskripsiUsaha: { type: String, required: true },
  nomorWhatsApp: { type: String, required: true },
  ktpNpwpUrl: { type: String, required: true },
  fotoUsahaUrl: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Form', formSchema);