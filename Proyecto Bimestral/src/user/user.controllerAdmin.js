'use stric'

import User from '../user/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
//Obtener todos
export const listarUsuario = async(req,res)=>{
    try{
        //Configuraciones de paginación
        const { limit = 20, skip = 0 } = req.query
        //Consultar
        const users = await User.find()
            .skip(skip)
            .limit(limit)
            
        if(users.length === 0){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Usuario no encontrado'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Usuario encontrado:', 
                users
            }   
        )
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error', err})
    }
}

//Obtener uno
export const buscarUsuarioId = async(req, res)=>{
    try {
        //obtener el id del Producto a mostrar
        let { id } = req.params
        let user = await User.findById(id)

        if(!user) return res.status(404).send(
            {
                success: false,
                message: 'Usuario no encontrado'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Usuario encontrado: ', 
                user
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}

//Actualizar datos generales
export const editarUsuario = async (req, res) => {
    try {
        const loggedUser  = {
            uid: req.user.uid,
            username: req.user.username,
            name: req.user.name,
            role: req.user.role
        }

        const data = req.body

        
        const updatedUser  = await User.findByIdAndUpdate(
            loggedUser .uid,
            data,
            { new: true }
        )

        if (!updatedUser ) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Usuario no encontrado'
                }
            )
        }

        return res.send(
               {
                success: true,
                message: 'Usuario actualizado',
                user: updatedUser 
                }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}


const agregarUsuarioPorDefecto = async () => {
    try {
        const adminExistente = await User.findOne({ role: "ADMIN" })

        if (!adminExistente) {
            const passwordHash = await encrypt("P@ssw0rd!2024", 10)

            const usuarioAdmin = new User({
                name: "Joel ",
                surname: "chavez",
                username: "jchavez",
                email: "jchavez-2023120@kinal.edu.gt",
                password: passwordHash,
                role: "ADMIN",
            })

            await usuarioAdmin.save()
            console.log("Usuario Por defecto Agregrado")
        }
    } catch (error) {
        console.error("Error al agregar usuario por defecto:", error)
    }
}

agregarUsuarioPorDefecto();