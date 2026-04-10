import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
      lowercase: true,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Invalid email format"
      }
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

// Hash the password before it saves
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next(); 
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
