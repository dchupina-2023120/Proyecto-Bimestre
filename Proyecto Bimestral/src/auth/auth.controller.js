//Gestionar lógica de autenticación
import User from '../user/user.model.js'
import { encrypt, checkPassword } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const test = (req, res)=>{
    console.log('La prueba se esta ejecutando ')
    res.send({message: 'La prueba se esta ejecutando'})
}

//Registrar
export const register = async(req, res)=>{
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        user.role = 'ADMIN'
        await user.save()

        return res.send({message: `Registrado con exito , se puede registrar con nombre de usuario: ${user.username}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error general con el registro del usuario', err})
    }
}

//Login
export const login = async(req, res)=>{
    try {
        
        let {userLoggin, password} = req.body
        
        let user = await User.findOne(
            {
                $or: [
                        {email: userLoggin},
                        {username: userLoggin}
                ]
            }
        ) 
        
        
        if(user && await checkPassword(user.password, password)){
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
                })
        } 
        //Responder al usuario
        return res.status(400).send({message: 'Credenciales no validas '})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error general con la funcion de login ', err})
    }
}