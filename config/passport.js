/**
@author Daniel Leandro <a21800566>
No passport.js está toda configuração das estratégias necessárias para autenticação definidas no passport.
Os canais vai ser via local, google, facebook e github. 
Os clientID e clientSecret estão definidos no ficheiro keys.js.
*/

const keys = require('./keys'); 
const bcrypt = require('bcryptjs');
const colors = require('colors');

/* 
Importação da biblioteca que permite configurar e implementar uma estratégia.
Criação de uma variavél que nos permite aceder há tabela de utilizadores criada na mongoDB.
*/   


const FacebookStrategy = require('passport-facebook').Strategy;   
const Facebook = require('../models/facebook');

const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const Google = require('../models/google');

const GitHubStrategy = require('passport-github2').Strategy;
const Github = require('../models/github');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
/*
O module.exports é um objeto que é incluído em todos os arquivos JS no Node.js por defeito. 
O module é uma variável que representa o módulo atual e o exports é um objeto que será exposto como um módulo. 
Então, o que designarmos para o module.exports será exposto como um módulo, neste caso as 4 estratégias da APP
*/

module.exports = function(passport){

    /* 
    Configuração da estratégia para a autenticação na aplicação
    */  
    passport.use(new LocalStrategy(function(username, password, done){
        
        const query = {username:username};   
        // Verificar se o utilizador existe na base de dados
        console.log('\nAutenticação Local'.cyan); 
        User.findOne(query, function(error, user){
            if(error) throw error;

            if(!user){
                console.log('Utilizador não encontrado'.red); 
                return done(null, false, {message: 'Utilizador não encontrado!'});

            // Verificar se a password é a correcta
            } else { 
                bcrypt.compare(password, user.password, function (error, isMatch) {
                    if(error) throw error;

                    if(isMatch) {
                        console.log('Username e Password correctas!'.green); 
                        return done(null, user);

                    } else {
                        console.log('Password incorreta'.red); 
                        return done(null, false, {message: 'Password Incorreta!'});
                    }
                });
            } 
        });
    }));

    /* 
    Configuração da estratégia para a autenticação através do Google
    */   
    passport.use(new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/users/google/redirect'
   
    }, (accessToken, refreshToken, profile, done) => { 
           
        // Verificar se o utilizador já se autenticou anteriormente pelo Google na nossa aplicação
        console.log('\nAutenticação Google'.cyan);
        Google.findOne({googleId: profile.id}).then((currentUser) => { 
            
            if(currentUser){                                   
                console.log('Login efectuado novamente no Google. Dados de utilizador: \n'.cyan);
                console.log(currentUser);
                done(null, currentUser);                              
            
            // Primeira autenticação pelo Google, é necessário guardar a sua informação na base de dados
            } else {                                                  
                
                new Google({                                         
                    googleId: profile.id,                             
                    username: profile.displayName,
                    given_name: profile._json.given_name,
                    family_name: profile._json.family_name,                     
                    email: profile.emails[0].value,
                    email_verified: profile._json.email_verified,
                    thumbnail: profile.photos[0].value

                }).save().then((newGoogle) => {     

                    console.log('Login efectuado no Google por um novo utilizador: \n'.cyan);
                    console.log(newGoogle);
                    done(null, newGoogle);                         
                });
            }
        });
    }));

    /* 
    Configuração da estratégia para a autenticação através do Facebook
    */   
    passport.use(new FacebookStrategy({
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: "/users/facebook/callback"
    
    }, function(accessToken, refreshToken, profile, done) {

        // Verificar se o utilizador já se autenticou anteriormente pelo Facebook na nossa aplicação
        console.log('\nAutenticação Facebook'.cyan);
        Facebook.findOne({facebookId: profile.id}).then((currentUser) => {
            
            if(currentUser){
                console.log('Login efectuado novamente no Facebook. Dados de utilizador: \n'.cyan);
                console.log(currentUser);
                done(null, currentUser);  
            
            // Primeira autenticação pelo Facebook, é necessário guardar a sua informação na base de dados
            } else {
                
                new Facebook({
                    facebookId: profile.id,
                    username: profile.displayName 
                
                }).save().then((newFacebook) => { 

                    console.log('Login efectuado no Facebook por um novo utilizador: \n'.cyan);
                    console.log(newFacebook);
                    done(null, newFacebook);
                });
            }
        });
    }));

    /* 
        Configuração da estratégia para a autenticação através do GitHub
    */   
    passport.use(new GitHubStrategy({
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        callbackURL: "/users/github/callback"
    
    }, function(accessToken, refreshToken, profile, done) {

        // Verificar se o utilizador já se autenticou anteriormente pelo Google na nossa aplicação
        console.log('\nAutenticação GitHub'.cyan);
        Github.findOne({gitId: profile.id}).then((currentUser) => {    
            
            if(currentUser) {
                console.log('Login efectuado novamente no GitHub. Dados de utilizador: \n'.cyan);
                console.log(currentUser);
                done(null, currentUser);
            
            // Primeira autenticação pelo Github, é necessário guardar a sua informação na base de dados
            } else {
                
                new Github({ 
                    gitId: profile.id,
                    username: profile.username,
                    company: profile._json.company,
                    bio: profile._json.bio,
                    location: profile._json.location
                
                }).save().then((newGit) => {   

                    console.log('Login efectuado no GitHub por um novo utilizador: \n'.cyan);
                    console.log(newGit);
                    done(null, newGit);
                });
            }
        });
    }));

    /*      
    A função SerializeUser() determina quais são os dados do objeto do utilizador que devem ser armazenados na sessão, 
    para posterior ser usado para recuperar todo objeto por meio da função deserializeUser 
    O resultado do método é anexado à sessão como req.user = { }. Neste caso para o { } passo os dados do user.
    */
    passport.serializeUser(function(user, done) {
        console.log('\nSerialize Utilizador... '.cyan);
        done(null, user);
    });
      
    /*
    No deserializeUser() o primeiro argumento que enviamos é o mesmo que foi definido no serializeUser(). 
    O utilizador é redirecionado de volta para o /login/<provider>/return, onde podemos aceder ás informações 
    do perfil do utilizador no req.user.
    */
    passport.deserializeUser(function(user, done) {
        //console.log('Deserialize Utilizador... '.cyan);
        done(null, user);
    });
}


