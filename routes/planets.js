/** 
@author Daniel Leandro <a21800566>

Contém todas as renderizações, redirecionamentos e validações dos planetas.
(Adicionar, Editar, Apagar)
Se o utilizador não estiver logado, apenas pode visualizar.
*/

const express = require('express');
const router = express.Router();
const authenticated = require('../middlewares/authenticated');
const Planet = require('../models/planet');
const User = require('../models/user');

/* 
ADICIONAR planeta - GET
Permite que quando o utilizador clica no botão de adicionar planeta seja redirecionado 
para essa mesma página. Para efeitos de exploração do pug.js decidi passar o parâmetro do titulo
através deste ficheiro em vez de estar hardcoded na view (a view vai receber este titulo através
do parâmetro #{title}). Passo também a informação do utilizador para saber se o mesmo está logado 
ou não e assim permitir gerir o que o mesmo pode visualizar ou não.
Em /middlewares/authenticated.js está descrito o comportamento do método auxiliar utilizado.
*/  

router.get('/add', [authenticated], function(req, res){
    console.log('Redirecionado para a página de adicionar planeta!'.cyan);
    res.render('add_planet', {
        user: req.user,
        title:'Adicionar Planeta'
     });
});
 
/* 
ADICIONAR planeta - POST
Definição de toda a lógica de implementação e validação de adicionar um novo planeta.
Assim todos os campos são mandatório, se os mesmos não forem preenchidos enviamos uma pop up que
informa o utilizador desse critério. No sentido inverso, se o planeta for adicionado com sucesso também
informamos o utilizador (sempre com recurso ao flash).
Em /middlewares/authenticated.js está descrito o comportamento do método auxiliar utilizado.
*/  

const { check, validationResult } = require('express-validator');
router.post('/add', [authenticated], [
    check('title').isString().not().isEmpty(),
    check('author').isString().not().isEmpty(),
    check('body').isString().not().isEmpty()
  ], function(req, res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('\nTem de preencher todos os campos!!'.gray);
        req.flash('atention', 'Por favor preencha todos os campos!');
        res.redirect('/planets/add');

    } else {
        const planet = new Planet();
        planet.title = req.body.title;
        planet.author = req.body.author;
        planet.body = req.body.body;
    
        planet.save(function(error){
            
            if(error){
                console.log('Aconteceu um erro na criação do planeta: '.red + error);
                req.flash('atention', 'Aconteceu um erro na criação do planeta');
            
            } else {
                console.log('planeta adicionado com sucesso!'.gray);
                req.flash('sucess', 'planeta adicionado com sucesso!');
                res.redirect('/');
            }
            
        });
    }
});

/* 
ADICIONAR planeta - GET
Este método permite que quando o utilizador clica no botão de editar planeta seja redirecionado 
para essa mesma página. Para efeitos de exploração do pug.js decidi passar o parâmetro do titulo
através deste ficheiro em vez de estar hardcoded na view (a view vai receber este titulo através
do parâmetro #{title}). Passo também a informação do utilizador para saber se o mesmo está logado 
ou não e assim permitir gerir o que o mesmo pode visualizar ou não. Passa também as informações do
planeta, para que quando o formos editar estejam lá os valores previamente adicionados.
Em /middlewares/authenticated.js está descrito o comportamento do método auxiliar utilizado.
*/  

router.get('/edit/:id', [authenticated], function(req, res){
    Planet.findById(req.params.id, function(err, planet){
        console.log('Redirecionado para a página de editar!'.cyan);
        res.render('edit_planet', {
            title:'Editar planeta',
            user: req.user,
            planet:planet
         });
    });
});

/* 
EDITAR planeta - POST
Neste método está definida toda a lógica de implementação e validação ao editar um novo planeta.
Fazemos uma query na base de dados para encontrar o planeta e posteriormente editamos.
Se um utilizador for editado com sucesso é redirecionado para a home page.
Em /middlewares/authenticated.js está descrito o comportamento do método auxiliar utilizado.
*/  

router.post('/edit/:id', [authenticated], function(req, res){
    const planet = {};
    planet.title = req.body.title;
    planet.author = req.body.author;
    planet.body = req.body.body;

    const query = {_id:req.params.id}
    Planet.updateOne(query, planet, function(error){
        
        if(error){
            console.log('Ups, aconteceu um erro na edição do planeta: '.red + error);
            req.flash('atention', 'Ups, aconteceu um erro na edição do planeta');
            return;
            
        } else {
            console.log('Planeta editado!'.gray);
            req.flash('sucess', 'Planeta editado!');
            res.redirect('/');
        }

    });
});

/* 
ELIMINAR planeta - DELETE
Neste método está definida toda a lógica de implementação e validação ao eliminar um novo planeta.
Fazemos uma query na base de dados para encontrar o planeta e posteriormente eliminamos.
Se um utilizador for eliminado com sucesso é redirecionado para a home page.
Em /middlewares/authenticated.js está descrito o comportamento do método auxiliar utilizado.
*/
  
router.delete('/:id', [authenticated], function(req, res){
    const query = {_id:req.params.id}

    Planet.findById(req.params.id, function(error, planet){
        Planet.deleteOne(query, function(error){

            if(error){
                console.log('Aconteceu um erro na eliminação do planeta: '.red + error);
                req.flash('atention', 'Aconteceu um erro na eliminação do planeta');
            
            } else {
                console.log('Planeta eliminado com sucesso!'.gray);
                req.flash('sucess', 'Planeta eliminado com sucesso!');
                res.send();
            }

        })
    });
});

/* 
VISUALIZAR planeta - GET
Este método permite que quando o utilizador clica num planeta seja redirecionado para uma página
com as informações do mesmo. Neste método passo a informação do utilizador para saber se o mesmo 
está logado  ou não e assim permitir gerir o que o mesmo pode visualizar ou não.
Em /middlewares/authenticated.js está descrito o comportamento do método auxiliar utilizado.
*/  

router.get('/:id', [], function(req, res){
    Planet.findById(req.params.id, function(err, planet){
        User.findById(planet.author, function(err, user){
            console.log('Redirecionado para a página do planeta!'.cyan);
            res.render('planet', {
                user: req.user,
                planet:planet,
            });
        })
    });
});

/*
O module.exports é um objeto que é incluído em todos os arquivos JS no Node.js por defeito. 
O module é uma variável que representa o módulo atual e o exports é um objeto que será exposto como um módulo. 
*/

module.exports = router;