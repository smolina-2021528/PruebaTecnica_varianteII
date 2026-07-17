import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [80, 'El nombre no debe superar 80 caracteres'],
    },

    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [120, 'El correo no debe superar 120 caracteres'],
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const user = this.toObject();

  delete user.passwordHash;
  delete user.__v;

  return user;
};

export const User = mongoose.model('User', userSchema);