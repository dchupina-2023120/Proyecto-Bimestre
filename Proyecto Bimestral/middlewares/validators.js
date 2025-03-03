import { body } from "express-validator";
import { validateErrors} from "../middlewares/validated.errors.js";
import {existEmail, existUsername } from "../utils/db.validators.js";


export const registerValidator=[
    body('name',`Name can't not be empty`)
    .notEmpty(),
    
    body('surname',`Surname can't not be empty`)
    .notEmpty(),
    
    body('email',`Email can't not be empty`)
    .notEmpty()
    .isEmail()
    .custom(existEmail),

    body('username',`Username can't not be empty`)
    .notEmpty().
    toLowerCase().
    custom(existUsername),
    
    body('password',`Password can't not be empty`)
    .notEmpty()
    .isStrongPassword()
    .withMessage('Password must be most strong')
    .isLength({min:8}),
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
  