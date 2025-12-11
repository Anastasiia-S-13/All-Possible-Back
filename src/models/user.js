import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: [2, "Ім'я має бути не менше 2 символів"],
      maxlength: [32, "Ім'я має бути не більше 32 символів"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email обов'язковий"],
      unique: true,
      maxlength: [64, 'Email має бути не більше 64 символів'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Невірний формат email'],
    },
    password: {
      type: String,
      required: [true, "Пароль обов'язковий"],
      minlength: [8, 'Пароль має бути не менше 8 символів'],
      select: false,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: set username to email if not provided
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model('User', userSchema);
