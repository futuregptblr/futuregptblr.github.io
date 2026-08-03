const mongoose = require('mongoose');

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function isValidDate(value) {
  if (!value) return true;
  return !Number.isNaN(new Date(value).getTime());
}

function sanitizeNote(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, 2000);
}

module.exports = {
  isValidDate,
  isValidObjectId,
  sanitizeNote
};
