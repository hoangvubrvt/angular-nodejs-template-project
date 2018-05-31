import { Request, Response, Router } from 'express';
import { AbstractController } from './abstract.controller';
import { Customer } from '../models/customer.model';

export class CustomerController extends AbstractController {
    constructor() {
        super();
        this.setRoutes();
    }

    private setRoutes() {
        let mockCustomer: Customer = Object.create(null);
        mockCustomer.address = "Test Adddess";
        mockCustomer.id = "1";
        mockCustomer.name = "Test customer";

        this.router.route('/')
            .get((req, res: Response) => {
                this.returnSuccess(res, mockCustomer);
            });
    }

    public getRouter(): Router {
        return this.router;
    }
}