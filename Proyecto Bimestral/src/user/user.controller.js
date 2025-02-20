import { encrypt } from "../../utils/encrypt.js";
import User from "../user/user.model.js"
import { hash } from "argon2";


//Crear un nuevo Usuario 
export const createUser = async (req, res) => {
    try {
        const { name,surname, email, username, password, role } = req.body;

        //Verificar si el ususario ya existe 
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "User already exists"})
        //Encriptar la contraseña 
        const hashedPassword = await hash(password, 10);

        //Crear nuevo usuario 
        const newUser = new User({
            name,
            surname,
            username,
            email,
            password: hashedPassword,
            role
        })
        await newUser.save();
        res.status(201).json(
            {
            message: 'Usuario Agregado',
            user:newUser
            }
        );
    } catch (err) {
        // Maneja cualquier error que pueda ocurrir durante la creación del usuario
        console.error('Error al agregar el usuario: ', err);
        res.status(400).json({ message: 'Error al agregar el usuario', err});
    }
};


//Obtener todo
export const getUsers = async(req,res)=>{
    try{
        //Configuraciones depaginación
        const {limit = 20, skip = 0} = req.query
        //Consultar
        const users=await User.find()
            .skip(skip)
            .limit(limit)

        if(users.length === 0){
            return res.status(400).send(
                {
                    success: false,
                    message: 'Usuario no encontrado'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Usuario Encontrado :',
                users
            }
        )
            
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error General',err})
    }
}


//Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al recuperar el usuario ", error });
    }
}


// Actualizar  usuario
export const update = async(req, res)=>{
    try {
        const { id } = req.params

        const data = req.body

        const update = await User.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )

        if(!update) return res.status(404).send(
            {
                success: false,
                message: 'Usuario no encontrado '
            }
        )

        return res.send(
            {
                success: true,
                message: 'Usuario editado ',
                user: update

            }
        )
    } catch (err) {
        console.error('Error General', err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error General ',
                err
            }
        )
    }
}

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar Usuario", error });
    }
}



const agregarUsuarioPorDefecto = async () => {
    try {
        // Verificar si ya existe un usuario administrador
        const adminExistente = await User.findOne({ role: "ADMIN" });

        if (!adminExistente) {
            // Encriptar contraseña
            const passwordHash = await encrypt("Admin1234", 10);

            // Crear usuario por defecto
            const usuarioAdmin = new User({
                name: "Diego ",
                surname: "Chupina",
                username: "dchupina",
                email: "dchupina-2023120@kinal.edu.gt",
                password: passwordHash,
                role: "ADMIN",
            });

            await usuarioAdmin.save();
            console.log("Usuario administrador por defecto agregado");
        }
    } catch (error) {
        console.error("Error al agregar usuario por defecto:", error);
    }
};

// Llamar a la función
agregarUsuarioPorDefecto();



export const updatePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id).select("+password");
      if (!user) return res.status(404).json({ message: "User not found" });
   
      const isMatch = await checkPassword(user.password, currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
   
      const hashedNewPassword = await encrypt(newPassword);
      user.password = hashedNewPassword;
      await user.save();
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("❌ Error updating password:", error);
      res
        .status(500)
        .json({ message: "Error updating password", error: error.message });
    }
  };
