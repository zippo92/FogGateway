/**
 * Created by Debora on 12/09/17.
 */


var request = require('request');
var user = require('../model/users');
var master = require('../model/masterServer');

exports.login = loginFn;

// Load the SDK for JavaScript
var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2",
    endpoint: "https://dynamodb.us-east-2.amazonaws.com"
});

function loginFn(req, res)
{
    var list = master.getMasterServerList();

    if(req.body.type === 'LOGIN')
    {
        console.log(req.body.idUser+" wants to login.");

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
                if(user.isEmptyObject(data))
                {
                    console.log("UserId doesn't exists!");
                    res.send({
                        status: "WRONG_USER_ID"
                    });
                }
                else {
                    if(data.Item.password === req.body.password)
                    {
                        console.log("Login success!");
                        res.send({
                            status: "LOGIN_SUCCESS",
                            masterIp: list[0].ip   // restituisco solo il primo per ora
                        });
                    }
                    else{
                        console.log("Password error!");
                        res.send({
                            status: "WRONG_PASSWORD"
                        });
                    }
                }
            }
        });
    }
}