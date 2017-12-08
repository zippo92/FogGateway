
exports.onScan = onScanFn;
exports.getAllUsers = getAllUsersFn;
exports.addUser = addUserFn;
exports.getUser = getUserFn;
exports.deleteTable = deleteTableFn;
exports.createUsersTable = createUsersTableFn;
exports.pushResult = pushResultFn;
exports.getResult = getResultFn;


var idExists = false;

function pushResultFn(exists)
{
    idExists = exists;
}

function getResultFn()
{
    return idExists;
}


// Load the SDK for JavaScript
var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-centrale-1",
    endpoint: "http://localhost:8000"
});

var ddb = new AWS.DynamoDB();


function onScanFn(err, data) {
    var docClient = new AWS.DynamoDB.DocumentClient();

    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(user) {
            console.log(user.idUser+" - "+user.password);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScanFn);
        }
    }
}

function getAllUsersFn()
{
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: 'Users'
    };

    docClient.scan(params, onScanFn);
}

function addUserFn(idUser, password)
{
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log("Adding user "+idUser+" and password "+password+" in Users table");

    var params = {
        TableName: 'Users',
        Item: {
            "idUser": idUser,
            "password":  password
        }
    };
    docClient.put(params, function(err, data) {
        if (err){
            console.log(err); // an error occurred
        }else {
            console.log(data); // successful response
        }
    });
}

function getUserFn(idUser)
{
    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: 'Users',
           Key:{
               "idUser": idUser
           }
    };

    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            if(JSON.stringify(data, null, 2) !== {})
                pushResultFn(false);
            else pushResultFn(true);
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}

function createUsersTableFn()
{
    var params = {
        TableName : 'Users',
        KeySchema: [
            { AttributeName: 'idUser', KeyType: "HASH"}  //Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'idUser', AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    var exists = false;

    //Controllo che la table non esista prima di crearla.
    ddb.listTables({}, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else
        {
            // successful response
            data.TableNames.forEach(function (t) {
//                console.log("----"+t);
                if(t==='Users')
                {
                    exists = true;
//                    console.log("Table Users already exists\n");
                }

            });
            //Se la table non esiste, la creo.
            if(!exists) {
                ddb.createTable(params, function (err, data) {
                    if (err) {
                        console.error("Unable to create table: ", err.message);
                    } else {
                        console.log("Created table Users"); //. Table description JSON:", JSON.stringify(data, null, 2));
                    }
                });
            }
        }
    });
}

function deleteTableFn(tableName)
{
    var params = {
        TableName : tableName
    };

    ddb.deleteTable(params, function(err, data) {
        if (err) {
            console.error("Unable to delete table: ", err.message);//JSON.stringify(err, null, 2).message);
        } else {
            console.log("Deleted table "+tableName);
        }
    });
}


//getAllUsersFn();