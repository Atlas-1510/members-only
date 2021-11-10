const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 100 },
  lastName: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true },
  isMember: { type: Boolean, required: true },
  isAdmin: { type: Boolean },
});

// Virtual for user full name
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);
