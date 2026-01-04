import { Express } from 'express';

declare global {
    namespace Express {
        interface User {
            _id: any;
            email: string;
            role?: string | null;
            name?: string;
            // Add other properties as needed from your User model
        }

        interface Request {
            user?: User;
        }
    }
}
