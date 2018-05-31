import * as express from 'express';
import { CustomerController } from "./customer.controller";
import { UserController } from "./user.controller";

const controllers = express.Router();

controllers.use('/api/customers', new CustomerController().getRouter());
controllers.use('/api/users', new UserController().getRouter());

export default controllers;

