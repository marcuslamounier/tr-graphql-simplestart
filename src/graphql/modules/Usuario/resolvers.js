const DB = require('../../../db')

function generateId(all) {
  let newId
  let lastId = all[all.length - 1]
  newId = lastId ? lastId.id : 0
  return ++newId 
}

module.exports = {
  Usuario: {
    perfil(usuario) {
      return DB.PERFIS.find(perfil => perfil.id === usuario.perfil)
    },
    salario(usuario) {
      return usuario.salario_acertado
    }
  },
  Query: {
    usuarios: () => DB.USUARIOS,
    usuario(_, args) {
      const { id, nome } = args
      let user = DB.USUARIOS.find(usuario => usuario.id === id)
      if (user) {
        return user
      } else {
        console.log('Não encontrou pelo id')
        return DB.USUARIOS.find(usuario => usuario.nome === nome)
      }
    }
  },
  Mutation: {
    createUser(_, { data }) {
      const { email } = data
      const existingUser = DB.USUARIOS.some(user => user.email === email)
      if (existingUser) {
        throw new Error(`Usuário existente: ${data.nome}`)
      }
      const newUser = {
        ...data,
        id: generateId(DB.USUARIOS),
        perfil: 2
      }
      DB.USUARIOS.push(newUser)
      return newUser
    },
    updateUser(_, { id, data }) {
      const user = DB.USUARIOS.find(user => user.id === id)
      const index = DB.USUARIOS.findIndex(user => user.id === id)
      const newUser = {
        ...user,
        ...data
      }
      DB.USUARIOS.splice(index, 1, newUser)
      return newUser
    },
    deleteUser(_, { filter: { id, email }}) {
      const prop = id ? { id } : { email }

      const key = Object.keys(prop)[0]
      const val = Object.values(prop)[0]

      const foundUser = DB.USUARIOS.find(user => user[key] === val)
      DB.USUARIOS = DB.USUARIOS.filter(user => user[key] !== val)
      return !!foundUser
    }
  }
}
