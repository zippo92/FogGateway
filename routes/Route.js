/**
 * Created by Caim03 on 12/09/17.
 */
module.exports = function (app) {

    var gatewayController = require('../controllers/gatewayController');
    var loginController = require('../controllers/loginController');
    var registrationController = require('../controllers/registrationController');



    app.post('/api/lb/edge/subscribe',gatewayController.subscribe);


    app.get('/api/lb/edge/subscribe',gatewayController.findMaster);

    app.post('/api/lb/edge/login', loginController.login);
    app.post('/api/lb/edge/registration', registrationController.addUserIfNotExists);

};
