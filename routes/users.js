/**
@author Daniel Leandro <a21800566> 

Este é o ficheiro que contém todas as renderizações, redirecionamentos e validações dos utilizadores.
Sendo elas referentes ao registo, login, logout e autenticação com o facebook, google e github.
*/

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');

/* 
Registo - GET
Este método permite que quando o utilizador clica no botão de Registo seja redirecionado para essa mesma página.
*/  

router.get('/register', function(req, res){
    console.log('Redirecionado para a página de registo!'.cyan + '\n');
    res.render('register');
});

/* 
Registo - POST
Neste método está definida toda a lógica de implementação e validação dos campos no registo.
Se o registo não for bem efectuado são enviadas mensagens de alerta através de mensagens flash.
No sentido oposto, se for bem sucedido, é adicionado na base de dados o novo utilizador e a password é protegida
através de um hash com a ajuda do middleware Bcryptjs.
Nota: Um Salt são dados aleatórios que são adicionados como inputs extra no hash da password.
*/  

const { check, validationResult } = require('express-validator');
router.post('/register', 
    [
        check('name').isString().not().isEmpty(), 
        check('email').isString().not().isEmpty(),
        check('email').isEmail(),
        check('username').isString().not().isEmpty(),
        check('password').isString().not().isEmpty(),
        check('password2').isString().not().isEmpty()
    ], function(req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('Atenção', 'Preencha todos os campos!');
        res.redirect('/users/register');
    
    } else if (password != password2) {
        req.flash('Atenção', 'Password não corresponde!');
        res.redirect('/users/register');

    } else {
    
    const newUser = new User({
        name:name,
        email:email,
        username:username,
        password:password
    });

        bcrypt.genSalt(10, function(error, salt){
            bcrypt.hash(newUser.password, salt, function(error, hash) {
                
                if(error){
                    console.log("Aconteceu um erro na encriptação da password: " + error);
                } 
                newUser.password = hash;
                newUser.save(function(error){

                    if(error){
                        console.log("Aconteceu um erro na criação do utilizador: " + error);
                        return;

                    } else {
                        req.flash('sucesso','Utilizador registado com sucesso!');
                        console.log('Página de login!'.cyan);
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

/* 
Login - GET
Este método permite que quando o utilizador clica no botão de Login seja redirecionado para essa mesma página.
*/  

router.get('/login', function(req, res){
    console.log('Redirecionado para a página de login!'.cyan);
    res.render('login');
});

/* 
Login - POST
Neste método está definida toda a lógica de implementação e validação do login.
A validação do login é efectuada com a ajuda do middleware passport que nos permite criar estratégias de 
autenticação. Neste caso, o login foi criado com a estratégia 'local'. A lógica dessa estratégia está a ser
definida no ficheiro /config/passport.
Caso o login seja bem sucedido o utilizador é redirecionado para a home page, caso contrário para a página de login.
*/  

router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next);
});

/* 
Este método permite que o utilizador possa efectuar o logout.
Neste caso, como estamos a utilizar sessions, temos de garantir que a session seja destruida para que o utilizador
não fique com a sessão activa. Caso o logout seja bem sucedido o utilizador é redirecionado para a página de login.
*/  

router.get('/logout', function(req, res, next){
    if(req.session){
        req.session.destroy(function(error) {

            if(error) {
                console.log('Ups, aconteceu um erro a efectuar o logout: '.red + error + '\n');
                return next(error);

            } 
            console.log('Logout efectuado com sucesso!'.red);
            return res.redirect('/users/login');
        });
    }
});

/* 
Este método permite que seja efectuada uma autenticação através de uma conta google.
Tal como no login, este método foi criado com recurso ao middleware passport e neste caso a estratégia
utilizada foi a da google. A lógica dessa estratégia está a ser definida no ficheiro /config/passport.
Caso o login seja bem sucedido o utilizador é redirecionado para a home page.
*/                    

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/redirect', passport.authenticate('google'), (req, res) => { 
    res.redirect('/');                                    
}); 

/* 
Este método permite que seja efectuada uma autenticação através de uma conta facebook.
Tal como no login, este método foi criado com recurso ao middleware passport e neste caso a estratégia
utilizada foi a do facebook. A lógica dessa estratégia está a ser definida no ficheiro /config/passport.
Caso o login seja bem sucedido o utilizador é redirecionado para a home page, caso contrário para a página de login.
*/  

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { 
    successRedirect: '/',                    
    failureRedirect: '/login'
}));

/* 
Este método permite que seja efectuada uma autenticação através de uma conta github.
Tal como no login, este método foi criado com recurso ao middleware passport e neste caso a estratégia
utilizada foi a do github. A lógica dessa estratégia está a ser definida no ficheiro /config/passport.
Caso o login seja bem sucedido o utilizador é redirecionado para a home page, caso contrário para a página de login.
*/  

router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),function(req, res) {
    res.redirect('/');
});

/*
O module.exports é um objeto que é incluído em todos os arquivos JS no Node.js por defeito. 
O module é uma variável que representa o módulo atual e o exports é um objeto que será exposto como um módulo. 
Então, o que designarmos para o module.exports será exposto como um módulo.
*/

module.exports = router;