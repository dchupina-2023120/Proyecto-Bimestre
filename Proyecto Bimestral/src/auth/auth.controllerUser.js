import User from '../user/user.model.js'
import { generateJwt } from '../../utils/jwt.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'

export const register = async(req, res) => {
    try {    
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
      
        await user.save()
        return res.send({message: `Registrado exitosamente, puedes iniciar sesión con el nombre de usuario: ${user.username}`})
    } catch(err) {
        console.error(err)
        return res.status(500).send({message: 'Error general al registrar usuario', err})
    }
}

export const login = async(req, res) => {
    try {
        let { userLoggin, password } = req.body
        
        let user = await User.findOne(
            {
                $or: [ 
                    {email: userLoggin},
                    {username: userLoggin}
                ]
            }
        ) 
        console.log(user)
        
        if(user && await checkPassword(user.password, password)){
            //Generar el token
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Bienvenido ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        //Responder al usuario
        return res.status(400).send({message: 'Credenciales inválidas'})
    } catch(err) {
        console.error(err)
        return res.status(500).send({message: 'Error general en la función de inicio de sesión', err})
    }
}

export const editarcontrasena = async (req, res) => {
    try {
        const { uid } = req.user
        const { currentPassword, newPassword } = req.body

        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Usuario no encontrado'
                }
            )
        }

        const isMatch = await checkPassword(user.password, currentPassword)
        if (!isMatch) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'La contraseña actual es incorrecta'
                }
            )
        }

        user.password = await encrypt(newPassword)
        const updatedUser  = await user.save()

        return res.send(
            {
                success: true,
                message: 'Contraseña actualizada exitosamente',
                user: updatedUser  
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error general en la función de actualización de contraseña',
                e: err
            }   
        )
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.user
        const { ...data } = req.body

        // Verificar si el usuario existe
        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Usuario no encontrado'
            })
        }

        // Evitar cambios no permitidos
        delete data.role
        delete data.password

        // Actualizar usuario con los nuevos datos
        const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true, runValidators: true })

        return res.send({
            success: true,
            message: 'Usuario actualizado exitosamente',
            user: updatedUser
        })
    } catch (error) {
        console.error('Error general', error)
        return res.status(500).send({
            success: false,
            message: 'Error general en la función de actualización de usuario',
            error
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.user

        // Verificar si el usuario existe
        const user = await User.findById(uid)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Usuario no encontrado'
            })
        }

        // Eliminar usuario por ID
        await User.findByIdAndDelete(uid)

        return res.send({
            success: true,
            message: 'Cuenta de usuario eliminada exitosamente'
        })
    } catch (error) {
        console.error('Error general', error)
        return res.status(500).send({
            success: false,
            message: 'Error general en la función de eliminación de usuario',
            error
        })
    }
}
