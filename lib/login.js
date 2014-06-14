var session=require('./session');

exports.URL_TOKEN_KEY='_token_';
exports.login=function(key){
    return session.generate(key);
};
exports.logout=function(req){
    return req.query&&req.query._token_&& session.remove(req.query._token_);
   // return session.remove();
};


exports.checkRequest=function(req){
    return req.query&&req.query._token_&& session.validate(req.query._token_);
};