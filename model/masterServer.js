var masterServer = [];

exports.getMasterServer = getMasterServerFn;
exports.pushMasterServer = pushMasterServerFn;
exports.getMasterServerIp = getMasterServerIpFn;
exports.setMasterServerIp = setMasterServerIpFn;
exports.getMasterServerList = getMasterServerListFn;
exports.setMasterServerIpByPos = setMasterServerIpByPosFn;

function getMasterServerFn(server) {
    var pos = masterServer.indexOf(server);
    return masterServer[pos];
}

function pushMasterServerFn(server) {
    masterServer.push(server);
}

function getMasterServerIpFn(server) {
    var pos = masterServer.indexOf(server);
    return masterServer[pos].ip;
}

function setMasterServerIpFn(server, ip) {
    var pos = masterServer.indexOf(server);
    masterServer[pos].ip = ip;
}

function setMasterServerIpByPosFn(position, ip) {
    masterServer[position].ip = ip;
}

function getMasterServerListFn() {
    return masterServer;
}