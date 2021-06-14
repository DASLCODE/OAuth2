/**
@author Daniel Leandro <a21800566>

Desta forma os dados do utilizador não se perdem no processo de mudança de página
e para garantir que utilizadores sem sessão são redirecionados para a homepage e percam a visualização de alguns menus.
*/

module.exports = (req, res, next) => {          
    
    if(!req.user){                              
        res.redirect('/');
        return;             
    }                                  
    next();     
};
