
var user = require('../model/users');


exports.addUser = addUserFn;
var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-centrale-1",
    endpoint: "http://localhost:8000"
});

var ddb = new AWS.DynamoDB();


function addUserFn(req, res)
{

    console.log("Arrived request to add "+req.body.idUser+" - "+req.body.password);


    if(req.body.type === "REGISTRATION") {
        //Crea la table solo se ancora non esiste.
        user.createUsersTable();

        console.log("Dopo.");

        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: 'Users',
            Key: {
                "idUser": req.body.idUser
            }
        };

        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                if (user.isEmptyObject(data)) {
                    user.addUser(req.body.idUser, req.body.password);
                    console.log("Added in table Users ("+req.body.idUser+", "+req.body.password+")");
                    res.send({status: "REGISTRATION_SUCCESS"})
                }
                else{
                    console.log("User id "+req.body.idUser+" already exists!");
                    res.send({status: "USER_ID_EXISTS"});
                }
            }
        });
    }
}

