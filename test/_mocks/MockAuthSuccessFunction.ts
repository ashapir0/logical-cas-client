import { Response } from "express";

export async function MockAuthSuccess(userId: string, userResponse: Response): Promise<void> {
  console.log(userId);
  userResponse.json({ success: true });
}