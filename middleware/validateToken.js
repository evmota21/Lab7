const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function validateToken(req, res, next){

    let token = req.headers.authorization;
    let tokenParam = req.query.apiKey;
    let tokenHeader = req.get("book-api-key");

    if( !token && !tokenParam && !tokenHeader){
        res.statusMessage = "You need to send the 'authorization' token."
        return res.status( 401 ).end();
    }
    if( token ){
        if( token !== `Bearer ${TOKEN}`){
            res.statusMessage = "The 'authorization' TOKEN is invalid.";
            return res.status( 401 ).end();
        }
    }
    else if( tokenParam ){
        if( tokenParam !== TOKEN ){
            res.statusMessage = "The query TOKEN is invalid.";

            return res.status( 401 ).end();
        }
    }
    else if( tokenHeader ){
        if( tokenHeader !== TOKEN ){
            res.statusMessage = "The header TOKEN is invalid.";

            return res.status( 401 ).end();
        }
    }

    next();

}

module.exports = validateToken;