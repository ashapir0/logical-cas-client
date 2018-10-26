import { Response } from "express";

export async function MockAuthError(userResponse: Response): Promise<void> {
  userResponse.json({ success: false });
}