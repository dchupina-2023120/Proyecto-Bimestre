import { body } from "express-validator";
import { validateErrors} from "../middlewares/validated.errors.js";
import {existEmail, existUsername } from "../utils/db.validators.js";


export const registerValidator = [
  body('name', 'Name cannot be empty')
      .notEmpty(),
  body('surname', 'Surname cannot be empty')
      .notEmpty(),
      body('username', 'Username cannot be empty')
      .notEmpty()
      .toLowerCase(),
  body('email', 'Email cannot be empty')
      .notEmpty()
      .isEmail()
      .custom(existEmail),
  body('username')
      .notEmpty()
      .toLowerCase()
      .custom(existUsername),
  body('password', 'Password cannot be empty')
      .notEmpty()
      .isStrongPassword()
      .withMessage('Password must be strong')
      .isLength({min: 8})
      .withMessage('Password need min characters'),
  validateErrors
]



export const updatePasswordValidator = [
    body("currentPassword", "Current password is required").notEmpty(),
    body("newPassword", "New password is required")
      .notEmpty()
      .isStrongPassword()
      .withMessage(
        "Password must be strong: at least 8 characters, 1 uppercase, 1 number, 1 special character"
      ),
    validateErrors,
  ];
  