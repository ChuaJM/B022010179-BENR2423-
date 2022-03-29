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

    let Name = []
    let Username = []
    let Password = []
    let Address = []

    for (let j = 0; j < 100; j++) {
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        const username = faker.internet.userName();
        const user_password = faker.internet.password();
        const user_address = faker.address.city();
        Name.push(name);
        Username.push(username);
	    Password.push(user_password);
	    Address.push(user_address);
    }

    console.log(Name);
	console.log(Username);
	console.log(Password);
    console.log(Address);

    try{
		for(let i=0; i<100; i++) {
			client.db("utem_portal").collection("users").insertOne({
				Name: Name[i],
                Username: Username[i],
				Password: Password[i],
				City: Address[i]
			})
		}

        const saltRounds = 10        
        bcrypt.genSalt(saltRounds, function (saltError, salt){
            if(saltError){
                throw saltError
            }
            else{
                for(let i=0; i<100; i++) {
                    bcrypt.hash(Password[i], salt, function(hashError, hash){
                        if (hashError){
                            throw hashError
                        }
                        else {
                            client.db("utem_portal").collection("users").updateOne({Name: Name[i]}, {$set: {Password: hash}})
                        }
                    })
                }
            }
        })
    }
    catch(error) {
        console.log(error)
    }
});