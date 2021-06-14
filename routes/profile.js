/**
@author Daniel Leandro <a21800566>  

Este é o ficheiro que contém todas as renderizações, redirecionamentos e validações da profile dos utilizadores.
Este ficheiroserve para mostrar os dados dos utilizadores nas diferentes autenticações.
*/

const router = require('express').Router();
const authenticated = require('../middlewares/authenticated');

/* 
Profile - GET
Este método permite que quando o utilizador clica no botão de Profile seja redirecionado para essa mesma página.
Em /middlewares/authenticated.js está descrito o comportamento do método auxiliar utilizado.
*/  

router.get('/', [authenticated], (req, res) => {
    console.log('Redirecionado para a página da profile!'.cyan);
    res.render('profile',{
        user: req.user,
        username: req.user.username,
        thumbnail: req.user.thumbnail,
        email: req.user.email,
        googleId: req.user.googleId,
        facebookId: req.user.facebookId,
        gitId: req.user.gitId,
        company: req.user.company,
        bio: req.user.bio,
        location: req.user.location
    });
});

/*
O module.exports é um objeto que é incluído em todos os arquivos JS no Node.js por defeito. 
O module é uma variável que representa o módulo atual e o exports é um objeto que será exposto como um módulo. 
Então, o que designarmos para o module.exports será exposto como um módulo.
*/
module.exports = router;