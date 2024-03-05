import express from 'express';
import mongoose from 'mongoose'; //mongoose is a ORM(Object Relation Method), it helps us to use mongoDB in nodeJS
import ejs from 'ejs';
import bodyParser from 'body-parser';
const app = express();

mongoose.connect('mongodb+srv://kashish:Kashish1234@node.yr0the8.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log('MongoDB is connected!')
})
app.set('view engine','ejs'); //for ejs
app.use(bodyParser.urlencoded({extended: true})) //for bodyParser
app.use(express.static('public'))

// schema - what we need inside the collections(data)
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    
})
// To store the data we need model, model have the access to mongoose as well as mongoDB
//model name should always start with capital letter
const User = mongoose.model('users',userSchema); //1st->By which name it will store the data & 2nd->what is schema model has to follow


// routes
app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/add',(req,res)=>{
    res.render('add');
})

app.post('/save-user',(req,res)=>{
    let {name,email} = req.body;
    let data = new User({
        name: name,
        email: email
    })
    data.save();
    res.redirect('/users')
})

app.post('/delete',async (req,res)=>{
    let {email} = req.body;
    let data = await User.deleteOne({email : email})
    res.redirect('/users')
})

app.get('/users', async (req,res)=>{
    let data = await User.find({}); //for specific data
    res.render('users',{users: data});
})

app.post('/edit', async (req,res)=>{
    let {email} = req.body;
    let data = await User.findOne({email: email}); //for specific data
    res.render('edit',{user: data});
})




app.post('/update',async (req,res)=>{
    let {name,email,oldEmail} = req.body;
    let data = await User.updateOne(
        {email: oldEmail},
        {
        $set: {
            name: name,
            email:email
        }
        })
    res.redirect('/users')
})


// api calls
app.get('/api-users',async(req,res)=>{
    let users = await User.find();
    res.json(users);
})



//add new user
const addUser = async ()=>{
    let data = new User({
        name: 'kk',
        email: 'kk@gmail.com'
    })
    data.save();
    console.log('User added successfully')
}
// addUser()

// reading data from database
const findUser = async ()=>{
    // let data = await User.find(); //await-available data and find-all the data
    let data = await User.find({name: 'kk'}); //for specific data
    console.log(data);
}
// findUser()

//  Delete the user
const deleteUser = async ()=>{
    let data = await User.deleteOne({email: 'kk@gmail.com'})
    console.log('User Deleted')
}
// deleteUser();

// Update the user
const updateUser = async ()=>{
    let data = await User.updateOne({name: 'Kashish'},{name: 'kash'}) //where to update, what to update
    console.log('User Updated')
}
// updateUser();

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})