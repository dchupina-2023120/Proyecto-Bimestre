//Validar campos en las rutas
import { body } from "express-validator"
import { validateErrors, validateErrorsWithoutFiles } from "../middlewares/validated.errors.js"
import { 
    existCategoryName, 
    existCategoryNameU, 
    existEmail, 
    existProductName, 
    existUsername, 
    isValidCategoryId, 
    isValidPrice, 
    isValidStock, 
    notRequiredField
} from "../utils/db.validators.js"

//Arreglo de validaciones (por cada ruta)
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
    body('password')
        .notEmpty().withMessage('Password cannot be empty')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'), 
    validateErrors
]

export const updateUserValidator = [
    body('username')
        .optional() //Parámetro opcional, puede llegar como no puede llegar
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('password')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    body('role')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    validateErrorsWithoutFiles 
]

export const userUpdate = [
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom(existEmail),
validateErrorsWithoutFiles 
]

export const productValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty()
        .custom(existProductName), 
    body('description', 'Description cannot be empty')
        .notEmpty()
        .isLength({ min: 8 })
        .isLength({ max: 100 }),
    body('price', 'Price cannot be empty')
        .notEmpty()
        .isNumeric().withMessage('Price must be a number')
        .custom(isValidPrice),
    body('stock', 'Stock cannot be empty')
        .notEmpty()
        .isNumeric().withMessage('Stock must be a number')
        .custom(isValidStock), 
    body('category', 'Category ID cannot be empty')
        .notEmpty()
        .custom(isValidCategoryId), 
    validateErrors 
]



export const validarCatego = [
    body('name', 'Name cannot be empty')
        .notEmpty()
        .custom(existCategoryName),
    body('description', 'Description cannot be empty')
        .notEmpty()
        .isLength({ min: 5 }).withMessage('Description must be at least 5 characters long')
        .isLength({ max: 100 }).withMessage('Description must be at most 100 characters long'),
    validateErrors
]

export const updateCategoryValidator = [
    body('name')
        .optional()
        .notEmpty().withMessage('Name cannot be empty') 
        .custom(existCategoryNameU), 
    body('description')
        .optional()
        .notEmpty().withMessage('Description cannot be empty')
        .isLength({ min: 5 }).withMessage('Description must be at least 5 characters long')
        .isLength({ max: 100 }).withMessage('Description must be at most 100 characters long'),
    validateErrors
]