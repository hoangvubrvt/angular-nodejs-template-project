import { AbstractController } from "./abstract.controller";
import { Request, Response, Router } from 'express';

export class UserController extends AbstractController {
    constructor() {
        super();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.route('/').get((req, res: Response) => {
            this.returnSuccess(res, 'Hello User!');
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}