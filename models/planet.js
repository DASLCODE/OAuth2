/**
@author Daniel Leandro <a21800566>

Este ficheiro contem o modelo de Base de dados dos planetas.
*/

const mongoose = require('mongoose');  // importar a biblioteca mongoose


const planetSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});

/*
O module.exports é um objeto que é incluído em todos os arquivos JS no Node.js por defeito. 
O module é uma variável que representa o módulo atual e o exports é um objeto que será exposto como um módulo. 
Então, o que designarmos para o module.exports será exposto como um módulo, nest caso o nosso planetSchema.
*/

const Planet = module.exports = mongoose.model('Planet', planetSchema);