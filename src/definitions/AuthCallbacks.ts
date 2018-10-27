import {Request, Response} from "express";

export type AuthSuccessFunction = ((req: Request, res: Response, user: string) => Promise<any>);
export type AuthFailureFunction = ((req: Request, res: Response, error: any) => Promise<any>);