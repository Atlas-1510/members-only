const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 100 },
  lastName: { type: String, required: true, maxlength: 100 },
  name: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true },
  membershipStatus: { type: Boolean, required: true },
});

// Virtual for user full name
User.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);
