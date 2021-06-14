/**
@author Daniel Leandro <a21800566>

Contém todas as renderizações, redirecionamentos e validações da página do oauth2.
O oauth2 é uma página que serve para mostrar o flow do auth2 na aplicação.
*/

const router = require('express').Router();
const authenticated = require('../middlewares/authenticated');

/* 
Oauth2 - GET
Este método permite que quando o utilizador clica no botão de Oauth2 seja redirecionado para essa mesma página.
Em /middlewares/authenticated.js está descrito o comportamento do método auxiliar utilizado.
*/  

router.get('/', [authenticated], (req, res) => {
    console.log('Redirecionado para a página do oauth2!'.cyan);
    res.render('oauth2',{
        user: req.user
    });
});

/*
O module.exports é um objeto que é incluído em todos os arquivos JS no Node.js por defeito. 
O module é uma variável que representa o módulo atual e o exports é um objeto que será exposto como um módulo. 
Então, o que designarmos para o module.exports será exposto como um módulo.
*/

module.exports = router;