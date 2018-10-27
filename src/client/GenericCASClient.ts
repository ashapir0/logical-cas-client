import { ClientConfig } from "..";
import { Request, Response } from "express";

export abstract class GenericCASClient {

  protected readonly config: ClientConfig;

  protected constructor(config: ClientConfig) {
    this.config = config;
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