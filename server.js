// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
//require mongoose
var mongoose = require('mongoose');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
//connect to mongodb
mongoose.connect('mongodb://localhost/quotes');
var QuoteSchema = new mongoose.Schema({
    name: String,
    quote: String
   },{
       timestamps : true
   })
mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'Quote'
   
var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'Quote'

// Routes
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the quotes from the database and include them in the view page we will be rendering.
    res.render('index');
})
// Add User Request 
app.post('/process', function(req, res) {
    console.log("POST DATA", req.body);
    // This is where we would add the quote from req.body to the database.
    var quote = new Quote({name : req.body.name, quote: req.body.quote});
    quote.save(function(err){
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('something went wrong');
        } 
        else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a quote!');
            res.redirect('/quotes');
        }
    })
    // res.redirect('/');
})

app.get('/quotes', function(req,res){
    Quote.find({},null,{sort : {'createdAt':-1}}, function(err, quotes) { 
        res.render('quotes', {quotes : quotes});      
    })
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})