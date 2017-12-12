var user = require('../model/users');

var dynamoController = require('./dynamoController');

exports.addUserIfNotExists = addUserIfNotExistsFn;
exports.addUser = addUserFn;

function addUserIfNotExistsFn(req, res)
{
    var docClient = dynamoController.getDynamoDocumentClient();

    console.log("Bo "+req.body.idUser);

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

function addUserFn(req, res)
{

    console.log("Arrived request to add "+req.body.idUser+" - "+req.body.password);
    var ddb = dynamoController.getDynamoDb;

    if(req.body.type === "REGISTRATION") {
        //Crea la table solo se ancora non esiste.
        var exists = false;

        //Controllo che la table non esista prima di crearla.
        ddb.listTables({}, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                // successful response
                data.TableNames.forEach(function (t) {
//                console.log("----"+t);
                    if (t === 'Users') {
                        exists = true;
                        console.log("Table Users already exists\n");
                    }

                });
                //Se la table non esiste, la creo.
                if (!exists) {
                    //TODO Momentaneamente non usata perché bisogna far eseguire addUserIfNotExistsFn solo dopo la prima funzione. Non sonon riuscita a farlo.
                    user.createUsersTable();
                    addUserIfNotExistsFn(req, res);
                }
                else {
                    addUserIfNotExistsFn(req, res);
                }
            }
        });


    }
}

