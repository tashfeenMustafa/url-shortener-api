var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var bodyparser = require('body-parser')
var config = require('./config')
var base58 = require('./base58')

// Pull the Urls Model
var Urls = require('./models/url.js')

var port = process.env.PORT || 8080

var app = express()

// Create connection to MongoDB 
mongoose.connect('mongodb://' + config.db.dbhost + '/' + config.db.name, function(err) 
{
    if(err)
        console.error(err)
    else
        console.log('Connected to database.')
})

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'public')))

// Serve the homepage
app.get('/', function(request, response) 
{
    response.sendFile(path.join(__dirname, 'views/index.html'))
})

// Route to create and return the short url
app.post('/api/shorten', function(request, response) 
{
    var longUrl = request.body.url
    var shortUrl = ''
    
    // Check if Url already exists in the database
    Urls.findOne({long_url: longUrl}, function(err, doc) 
    {
        if(err)
            console.error(err)
        if(doc)
        {
            // URL is in the database, already been shortened before
            shortUrl = config.webhost + base58.decode(doc.longUrl)
            
            // Return shortUrl without creating new entry since it is already present
            // in the database
            response.send({'short_url': shortUrl, 'long_url': longUrl})
        }
        else
        {
            // Create new entry, shorten URL & send to user
            var newUrl = Urls({ long_url: longUrl })
            
            // Save the new URL
            newUrl.save(function(err) 
            {
                if(err)
                    console.error(err)
                    
                shortUrl = config.webhost + base58.encode(newUrl._id)
                
                response.send({'short_url': shortUrl, 'long_url': newUrl.long_url})    
            })
        }
    })
})

// Route to redirect the user to their original link 
app.get('/:encoded_id', function(request, response) 
{
    var base58URL = request.params.encoded_id
    var id = base58.decode(base58URL)
    console.log('encoded id')
    
    Urls.findOne({_id: id}, function(err, doc) 
    {
        if(err)
            console.error(err)
        
        if(doc)
        {
            // Entry exists, redirect user to original link
            response.redirect('http://' + doc.long_url)
        }
        else
        {
            // Redirect user to homepage
            response.redirect(config.webhost)
        }
    })
})

var server = app.listen(port, function() 
{
    console.log('Listening on port %d...', port)
})