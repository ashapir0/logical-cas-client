import { Request, Response } from "express";

export type AuthSuccessFunction = ((req: Request, res: Response, user: string) => any);
export type AuthFailureFunction = ((req: Request, res: Response, error: any) => any);