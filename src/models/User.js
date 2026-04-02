import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value),
        message:
          "Losenordet maste vara minst 8 tecken langt och innehalla minst en liten bokstav, en stor bokstav, en siffra och ett specialtecken."
      }
    },
    isAdmin: {
      type: Boolean,
      default: false
    }, 
    address: {
      street: {
        type: String,
        trim: true
      },
      postalCode: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true
      } 
    }
  }, 
  {
    timestamps: true
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // TODO: Add salt and hash password
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
