import { Request, Response } from "express";

import { ClientConfig } from "../definitions/ClientConfig";
import { AuthFailureFunction, AuthSuccessFunction } from "../definitions/AuthCallbacks";

/**
 * Abstract CAS Client
 */
export abstract class GenericCASClient {

  protected readonly config: ClientConfig;

  protected readonly onAuthSuccess: AuthSuccessFunction;
  protected readonly onAuthFailure: AuthFailureFunction;

  protected constructor(config: ClientConfig, onAuthSuccess: AuthSuccessFunction, onAuthFailure: AuthFailureFunction) {
    this.config = config;
    this.onAuthSuccess = onAuthSuccess;
    this.onAuthFailure = onAuthFailure;
  }

  protected getClientUrl(): string {
    const protocol = this.config.secure ? "https" : "http";
    const port = this.config.port ? `:${this.config.port}` : "";
    return `${protocol}://${this.config.host}${port}`;
  }

  protected getServerUrl(): string {
    const protocol = this.config.server.secure ? "https" : "http";
    const port = this.config.server.port ? `:${this.config.server.port}` : "";
    return `${protocol}://${this.config.server.host}${port}`;
  }

  public async abstract redirectToCASLogin(req: Request, res: Response): Promise<void>;
  public async abstract verifyTicket(req: Request, res: Response): Promise<void>;

}