const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const {v4 : uuidv4 } = require( 'uuid' );
const validateToken = require( './middleware/validateToken'); 

const app = express();
const jsonParser = bodyParser.json();
const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

app.use( morgan( 'dev' ) );
app.use( validateToken );

let listOfBookmarks = [
    {
        id: uuidv4(),
        title : "First BookMark",
        description : "This is the first bookmark.",
        url: "www.google.com",
        rating: 50
    }
];

app.get( '/lab7/bookmarks', ( req, res ) => { //Return all bookmarks with code 200.
    console.log("Getting all bookmarks.");

    return res.status( 200 ).json( listOfBookmarks);
});

app.get( '/lab7/bookmark' , ( req, res ) => {
    console.log( "Getting a bookmark by title." );

    console.log( req.query );

    let title = req.query.title; 

    if( !title ){
        res.statusMessage = "Please send the 'title' as a parameter.";
        return res.status( 406 ).end();
    }

    let result = listOfBookmarks.find( ( bookmark ) => {
        if( bookmark.title ===  ( title ) ){
            return bookmark;
        }
    });

    if( !result ){
        res.statusMessage = `There are no bookmarks with the provided 'title=${title}'.`;
        return res.status( 404 ).end();
    }

    return res.status( 200 ).json( result ); 
});

app.post( '/lab7/bookmarks' , jsonParser, ( req, res ) => {
    console.log("Adding a new bookmark to the list...");
    console.log( "Body" , req.body );

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if( !title || !description || !url || !rating ){
        res.statusMessage = "One parameter is missing.";

        return res.status( 406 ).end();
    }

    if( typeof(rating) !== 'number' ){
        res.statusMessage = "rating must be a number!";

        return res.status( 409 ).end();
    }

    let flag = true;

    for( let i = 0; i < listOfBookmarks.length; i++){
        if( listOfBookmarks[i].title === title ){
            flag = !flag;
            break;
        }

        if( flag ){
            let id = uuidv4();
            let newBookmark = {id, title, description, url, rating};

            listOfBookmarks.push( newBookmark );
            
            return res.status( 201 ).json( newBookmark );
        }
        else{
            res.statusMessage = "The 'title' provided is already on the list."

            return res.status( 409 ).end();
        }
    }

});

app.delete( '/lab7/bookmark/:id' , ( req, res ) => {
    console.log( req.params );
    let id = req.params.id;

    if( !id ){
        res.statusMessage = "Please send a 'id'.";

        return res.status( 406 ).end();
    }

    let bookmarkToRemove = listOfBookmarks.findIndex( (bookmark) => {
        if(bookmark.id === id){
            return true;
        }
    });

    if( bookmarkToRemove < 0 ){
        res.statusMessage = "The bookmark was not found on the list."

        return res.status( 404 ).end();
    }

    listOfBookmarks.splice( bookmarkToRemove, 1 );

    return res.status( 200 ).end();

});

app.patch( '/lab7/bookmark/:id' , jsonParser, ( req, res ) => {
    console.log("Updating a bookmark on the list...");
    console.log( "Body" , req.body );

    let id = req.params.id;
    let idBody = req.body.id;

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if( !req.body ){
        res.statusMessage = "Please send a body with the correct data.";

        return res.status( 406 ).end();
    }

    if( id !== idBody){
        res.statusMessage = "Id on path parameter and body are not equal.";

        return res.status( 409 ).end();
    }

    let bookmarkToEdit = listOfBookmarks.findIndex( (bookmark) => {
        if(bookmark.id === id){
            return true;
        }
    });

    if( title ){
        listOfBookmarks[bookmarkToEdit].title = title;
    }
    if( description ){
        listOfBookmarks[bookmarkToEdit].description = description;
    }
    if( url ){
        listOfBookmarks[bookmarkToEdit].url = url;
    }
    if( rating ){
        listOfBookmarks[bookmarkToEdit].rating = rating;
    }

    return res.status( 202 ).json( listOfBookmarks[bookmarkToEdit] );

});



app.listen( 8080, () => {
    console.log(`Running server "bookmarks-app" on port 8080...`);
});
