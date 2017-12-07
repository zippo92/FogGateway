/**
 * Created by Caim03 on 12/09/17.
 */



var master = require('../model/masterServer');

exports.subscribe = subscribeFn;
exports.findMaster = findMasterFn;

//iscrizione dei master degli edge servers.
function subscribeFn(req, res) {

    var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;

    if (req.body.type === "MASTER") {
        master.pushMasterServer({ip: ip});
    }
    else if(req.body.type === "PROCLAMATION") {

        var oldMasterPos = findPositionFn(req.body.oldMaster);

        if(oldMasterPos === -1) {
            // master non in lista (non saprei come)
            master.pushMasterServer({ip: ip});
        }
        else {
            master.setMasterServerIpByPos(oldMasterPos, ip);
            console.log("Proclamation by: " + ip);
            res.send({status: 'ACK'});
        }
    }
    else
        res.send({status: "BAD_REQUEST"});

}


function findMasterFn(req, res) {
    var list = master.getMasterServerList();
    var masterIp = list[0].ip;  // restituisco il primo per ora

    var i = 1;
    while (!masterIp){
        masterIp = list[i].ip;
        i++;

        if (i === list.length) {
            res.send({status: "NO_MASTER"});
            return;
        }
    }

    res.send({
        status: "ACK",
        masterIp: masterIp
    });

}

function findPositionFn(ip) {
    var list = master.getMasterServerList();
    for(var i = 0; i < list.length; i++) {
        if (list[i].ip === ip) {
            return i;
        }
    }

    return -1;
}



