/**
 * Created by Caim03 on 12/09/17.
 */
module.exports = function (app) {

    var gatewayController = require('../controllers/gatewayController');

    app.post('/api/lb/edge/subscribe',gatewayController.subscribe);


    app.get('/api/lb/edge/subscribe',gatewayController.findMaster)
};
