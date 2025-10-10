const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["reader", "author", "admin"],
      default: "reader",
    },
  },
  {
    timestamps: true,
  }
);

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

userSchema.methods.comparePassword = async function (mainpassword) {
  return await bcrypt.compare(mainpassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
