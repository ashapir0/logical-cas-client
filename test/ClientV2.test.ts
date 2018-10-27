import {CASClientV2} from "../src/client/CASClientV2";
import {ClientConfig} from "../src/definitions/ClientConfig";
import {MockWebServer} from "./_mocks/MockWebServer";
import { Request, Response } from "express";
import {MockAuthSuccess} from "./_mocks/MockAuthSuccessFunction";
import {MockAuthError} from "./_mocks/MockAuthErrorFunction";
const PORT = 8181;

describe("CASClientV2", () => {

  let webServer: MockWebServer;

  beforeAll(async () => {
    webServer = new MockWebServer();
    await webServer.start(PORT);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("stuff", (done) => {
    const config: ClientConfig = {
      host: "localhost",
      port: PORT,
      secure: false,
      endpoints: {
        loginRedirectPath: "/auth/login",
        ticketVerificationPath: "/auth/ticket"
      },
      server: {
        host: "cas-auth.rpi.edu",
        secure: true,
        version: "2.0",
      }
    };

    const c = new CASClientV2(config, MockAuthSuccess, MockAuthError);
    webServer.application.use("/auth/ticket", c.verifyTicket);
    webServer.application.use("/", c.redirectToCASLogin);

  });
});
