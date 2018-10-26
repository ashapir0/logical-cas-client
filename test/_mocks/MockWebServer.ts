import http from "http";
import express from "express";

export class MockWebServer {

  public readonly application: express.Application;
  private httpInstance: http.Server | null;

  constructor() {
    this.application = express();
    this.httpInstance = null;
  }

  public async start(port: number): Promise<void> {
    this.httpInstance = this.application.listen(port);
  }

  public async stop(): Promise<void> {
    if (this.httpInstance) this.httpInstance.close();
  }

}