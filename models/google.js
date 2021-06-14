/**
@author Daniel Leandro <a21800566> 
Este é o ficheiro que contém o nosso modelo de BD dos utilizadores autenticados pela conta da Google.
*/

const mongoose = require('mongoose');      // importar a biblioteca mongoose
const Schema = mongoose.Schema;            // criar a constante schema 

  
const GoogleSchema = new Schema({ 
    username: String, 
    googleId: String, 
    given_name: String,
    family_name: String,
    email: String,
    email_verified: Boolean,
    thumbnail: String
});

/*
O module.exports é um objeto que é incluído em todos os arquivos JS no Node.js por defeito. 
O module é uma variável que representa o módulo atual e o exports é um objeto que será exposto como um módulo. 
Então, o que designarmos para o module.exports será exposto como um módulo, nest caso o nosso GoogleSchema.
*/

const Google = module.exports = mongoose.model('Google', GoogleSchema);