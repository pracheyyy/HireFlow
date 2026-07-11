const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter"),
  validate,
];

const loginValidation = [
  body("email").trim().notEmpty().isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const forgotPasswordValidation = [
  body("email").trim().notEmpty().isEmail().withMessage("Invalid email").normalizeEmail(),
  validate,
];

const resetPasswordValidation = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter"),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
