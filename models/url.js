var mongoose = require('mongoose')
var Schema = mongoose.Schema

// Create a 'counters' Schema fields of _id and seq
var counterSchema = Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 0}
})

// Create a 'Url' Schema with fields of _id, long_url & created_at
var urlSchema = Schema({
    _id: {type: Number, index: true},
    long_url: String,
    created_at: Date
})

// Create model for counterSchema
var counter = mongoose.model('counter', counterSchema)

// The pre('save', callback) middleware executes the callback function
// every time before an entry is saved to the urls collection.
urlSchema.pre('save', function(next) 
{
    var doc = this
    
    // Find 'url_count' & increment it by 1
    counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, counter) 
    {
        if(error)
            return next(error)
        
        // Set the _id of the urls collection to the incremented value of the counter
        doc._id = counter.seq
        doc.created_at = new Date()
        next()
    })
})

// Create model for urlSchema
var urls = mongoose.model('urls', urlSchema)

module.exports = urls

