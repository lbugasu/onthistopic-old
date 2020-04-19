const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Topic = new mongoose.Schema({
    title: String,
    added_by: {type: Schema.Types.ObjectId, ref: 'User'},
    rating:[0,0,0,0,0],
    tags:[String],//Consider making this an object??
    resources: [{type: Schema.Types.ObjectId, ref: 'Resource'}],
    notes: [{type: Schema.Types.ObjectId, ref: 'Note'}]
});
const Resource = new mongoose.Schema({
    embed_link: String,
    type: Number,
    added_by: {type: Schema.Types.ObjectId, ref: 'User'},
    rating:[0,0,0,0,0]
});
const User = new mongoose.Schema({
    notes: [{type: Schema.Types.ObjectId, ref: 'Note'}],
    resources: [{type: Schema.Types.ObjectId, ref: 'Resource'}],
    topics: [{type: Schema.Types.ObjectId, ref: 'Topic'}]
    /**
     * _TODO_: 
     * Add Favourites?
     */
});
User.plugin(passportLocalMongoose);

const Note = new mongoose.Schema({
    resource: {type: Schema.Types.ObjectId, ref: 'Resource'},
    content: String,
    rating:[0,0,0,0,0]
});
// "Register" the schema so that mongoose knows about it
mongoose.model('Topic', Topic);
mongoose.model('Resource', Resource);
mongoose.model('User', User);
mongoose.model('Note', Note);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, '../config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/fnp';
}
mongoose.connect(dbconf,{ useNewUrlParser: true, useUnifiedTopology: true });