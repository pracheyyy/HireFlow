const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // never return password by default
    },
    avatar: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: [
        {
          institution: String,
          degree: String,
          year: String,
        },
      ],
      default: [],
    },
    profile: {
      personal: {
        fullName: String,
        phone: String,
        city: String,
        linkedIn: String,
        github: String,
      },
      academic: {
        cgpa: String,
        tenth: String,
        twelfth: String,
        currentSemester: String,
        activeBacklogs: { type: Number, default: 0 },
      },
      codingProfiles: {
        leetCode: String,
        codeChef: String,
        codeforces: String,
        problemsSolved: { type: Number, default: 0 },
      },
      projects: {
        type: [
          {
            name: String,
            description: String,
            techStack: [String],
            githubLink: String,
            liveLink: String,
          },
        ],
        default: [],
      },
      experience: {
        type: [
          {
            company: String,
            role: String,
            duration: String,
            description: String,
          },
        ],
        default: [],
      },
      careerPreferences: {
        dreamRole: String,
        domains: { type: [String], default: [] },
        employmentType: String,
        preferredLocations: { type: [String], default: [] },
      },
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
