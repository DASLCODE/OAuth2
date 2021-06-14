/**
@author Daniel Leandro <a21800566> 
Este é o ficheiro que contém o nosso modelo de BD dos utilizadores autenticados localmente.
*/

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({    
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
});

/*
O module.exports é um objeto que é incluído em todos os arquivos JS no Node.js por defeito. 
O module é uma variável que representa o módulo atual e o exports é um objeto que será exposto como um módulo. 
Então, o que designarmos para o module.exports será exposto como um módulo, nest caso o nosso UserSchema.
*/
const User = module.exports = mongoose.model('User', UserSchema);