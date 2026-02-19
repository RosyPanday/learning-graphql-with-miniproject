import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Request } from 'express';
import db from '../database/models/index.js';


export interface IContext {
    user?:JwtPayload;
    models: typeof db;
}
export const verifyTokenContext = async ({ req }: { req: Request }) :Promise<IContext>=> {
    const authHeader:string|undefined = req.get('authorization');
    const token:string|undefined =authHeader?.split(' ')[1];
    if(!token) {
        return { models: db };
    }
    try {
        const jwtSecret:string = process.env.jwtSecret as string;
        const decoded =jwt.verify(token, jwtSecret);
        if(typeof decoded === 'string' && decoded !== null) {   
             throw new Error('invalid data in payload')
        }
        const user= decoded; 
        return { user ,models:db};
    } catch (err) {
        throw new Error('Invalid token');
    }
}
