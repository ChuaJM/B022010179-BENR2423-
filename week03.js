const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs")

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.kldlb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
    if (err) {
        console.log(err.message)
        return
    }
    console.log('Connected to MongoDB')

    for (let j = 1; j <= 100; j++) {
    let name = []
    //Array to store all the names
    const username = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const user_password = faker.internet.password();
    const user_address = faker.address.city();


    const saltRounds = 10   
    bcrypt.genSalt(saltRounds, function (saltError, salt){
        if(saltError){
            throw saltError
        }
        else{
            bcrypt.hash(user_password, salt, function(hashError, hash){
                if (hashError){
                    throw hashError
                }
                else {
                    const hash_password = hash                    
                    name.push({username, user_address, hash_password});

                client.db("utem_portal").collection("user").insertMany(name).then(result => {
                        console.log(result);
                    
                    });
                }
            })
        }

    })
}
});