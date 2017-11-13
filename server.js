var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));
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

app.get('/', function(req, res) {
    res.render('index');
})

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
})

app.get('/quotes', function(req,res){
    Quote.find({},null,{sort : {'createdAt':-1}}, function(err, quotes) { 
        if(err){
            console.log('something went wrong');
        }
        else{
            console.log('successfully displayed all the quotes!');
            res.render('quotes', {quotes : quotes});  
        }    
    })
})


app.listen(8000, function() {
    console.log("listening on port 8000");
})