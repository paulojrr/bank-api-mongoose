const express = require('express');
const routes = express.Router();

const AccountController = require('./controllers/AccountController');

routes.put('/accounts', AccountController.deposit);
routes.patch('/accounts', AccountController.withdraw);
routes.get('/accounts', AccountController.getBalance);
routes.delete('/accounts', AccountController.destroy);
routes.put('/accounts/transfer', AccountController.transfer);

module.exports = routes;
