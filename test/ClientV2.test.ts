import CasClient, { ClientConfig } from "../src";

import { MockWebServer } from "./_mocks/MockWebServer";

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

  test("stuff", () => {
    const config: ClientConfig = {
      host: "localhost",
      port: PORT,
      secure: false,
      endpoints: {
        ticketVerificationPath: "/auth/ticket"
      },
      server: {
        host: "cas-auth.rpi.edu",
        secure: true,
        version: "2.0",
      }
    };

    const client = CasClient(config, webServer.handleAuthSuccess, webServer.handleAuthFailure);

    webServer.application.use(config.endpoints.ticketVerificationPath, client.verifyTicket);
    webServer.application.use("/auth/login", client.redirectToCASLogin);

  });
});
