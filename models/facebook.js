/**
@author Daniel Leandro <a21800566>

Este é o ficheiro que contém o modelo de Base de dados dos utilizadores autenticados pela conta de facebook.
*/

const mongoose = require('mongoose');    // importar a biblioteca mongoose
const Schema = mongoose.Schema;         // criar a constante schema 

const FacebookSchema = new Schema({
    username: String,
    facebookId: String 
});

/*
O module.exports é um objeto que é incluído em todos os arquivos JS no Node.js por defeito. 
O module é uma variável que representa o módulo atual e o exports é um objeto que será exposto como um módulo. 
Então, o que designarmos para o module.exports será exposto como um módulo, nest caso o nosso FacebookSchema.
*/

const Facebook = module.exports = mongoose.model('Facebook', FacebookSchema);