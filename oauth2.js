/**
@author Daniel Leandro <a21800566>
Sistemas de Gestão de Identidade
Universidade Lusófona
Docente: Doutor José Rogado
*/


const keys = require('./config/keys');
const express = require('express');
const colors = require('colors');

/*
O código das importações das bibliotecas, as views, as routes e as pastas públicas.
Encontra-se também a ligação e configuração à base de dados mongoDB.
O mongoose permite modelar o nosso mongodb pelo node.js.
Ele gerencia relacionamentos entre dados, fornece validação de esquema e é usado para traduzir entre objetos no código e a representação desses objetos no MongoDB.
Criar ligação à base de dados pela nossa instância local do MongoDB. 
A base de dados está alojada na cluster e bastante fácil de usar, o dbURI é fornecida pelo MongoDB e está inseridano ficheiro de keys).
Abaixo o código reflete o estado da ligação à base de dados e consoante esse estado menciona uma mensagem com uma cor diferente.
Estado do mongoose: 0) disconnected, 1) connected
*/   

const mongoose = require('mongoose');

const db = mongoose.connect(keys.mongodb.dbURI, {useNewUrlParser: true}, function(error){
    
console.log('Ligar à base de dados...'.yellow);
if (mongoose.connection.readyState == 0 || error){
     console.log('Não é possível ligar à base de dados.\n'.bgRed);
}else {
    console.log('\nLigação com sucesso!'.bgGreen);
}
});

/* 
Express.js é um framework para Node.js que fornece recursos mínimos para construção de servidores web. 
De seguida é criada uma instância de uma express application.
*/    

const app = express();

/* 
O express.static middleware serve para reconhecer ficheiros estáticos como imagens, css, js.
O path que o express.static cria é relativamente à directoria do processo do node. No entanto há uma directoria
criada apenas para o efeitos de views e outra para efeitos de bibliotecas de frontend, assim para o express reconhecer essas
directorias temos de devolver o absolute path.
*/ 

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

/* 
Pug.js é um mecanismo de modelagem HTML. Permite gerar templates.
O Pug.js  é configurado abaixo como sendo o mecanismo de visualização da nossa Express application.
https://pugjs.org/api/getting-started.html (Dúvidas sobre o Pug.js)
*/  

app.set('view engine', 'pug');

/* 
Body Parser middleware é responsável por analisar os corpos da solicitação de entrada em um middleware antes de manipulá-lo. 
O body-parser extrai a parte inteira do corpo de um fluxo de solicitação de entrada e expõe no corpo de req.
O app.use (bodyParser.json ()) transmite ao sistema informação para que o Json seja utilizado.
O bodyParser.urlencoded ({extended: ...}) transmite ao sistema se usa um algoritmo simples para
análise (false) ou um algoritmo complexo para uma análise mais profunda (true).
*/  

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/*
Entre os pedidos de HTTP, tem que se armazenar os dados do utilizador.
Os cookies e os parâmetros de URL são formas de transportar dados entre o servidor e o cliente, através das sessões.
É atribuido um ID ao cliente e todos solicitações tem esse ID associado que é armazendo no servidor com esse ID.
*/

const session = require('express-session');
app.use(session({
    secret: 'keyboard daniel',
    resave: true,
    saveUninitialized: true
}));
  
/*
O connect-flash é uma biblioteca que permite enviar mensagens flash sempre que você for redirecionado para outra página da web. 
Normalmente, quando você faz login em um site, uma mensagem 'pisca' no topo da tela indicando o sucesso ou falha no login.
*/

app.use(require('connect-flash')());
    app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

/* 
Passport é middleware de autenticação para Node.js . 
Um conjunto abrangente de estratégias oferece suporte à autenticação usando um nome de usuário e senha , Facebook , Twitter e muito mais .
Numa Express-based app, o passport.initialize() middleware é necessário para iniciar o Passport na app e o passport.session() middleware é necessário caso seja necessário sessões de login (nest caso, por cookie).
*/

const passport = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

/* 
No Express.js cria routes depois da criação da nossa instância. 
Assim aqui pode ser gerido e definido todos os routes e paths da mesma.
Quando ocorrer o acesso à aplicação é criada a route principal.
O app.get(), faz parte do routing do Express, faz a comparação e gere um especifico route quando requesitado por um HTTP GET/.
O res.render envia a view renderizada ao cliente.
*/ 

const Planet = require('./models/planet');
app.get('/', function(req, res) {
    Planet.find({}, function(error, planets){
        if(error){
            console.log('Aconteceu um erro ao abrir a página inicial! '.red + error + '\n');
        } else {
            console.log('\nPágina principal!'.cyan);
            res.render('index', {
                user: req.user,
                title:'Planetas',
                planets:planets
            });
       } 
   });
});

/* 
De seguida é definir os paths para as restantes páginas.
Há uma pasta com ficheiros específicos criados para gerir as routes de cada um dos paths.
Ao especificarmos o mount path /, o app.use() vai responder a qualquer path que comece com /.
*/ 

const planets = require('./routes/planets');
app.use('/planets', planets);

const users = require('./routes/users');
app.use('/users', users);

const profile = require('./routes/profile');
app.use('/profile', profile);

const oauth2 = require('./routes/oauth2');
app.use('/oauth2', oauth2);  

/* 
A porta da aplicação fica definida na porta 3000
*/  

const port = process.env.PORT || 3000;
app.listen(port, () => {                
    console.log('\nAVISO: A App está a correr na porta: '.red + port + '\n');
});