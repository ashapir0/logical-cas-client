import http, { RequestOptions as RequestOptionsHttp } from "http";
import https, { RequestOptions as RequestOptionsHttps } from "https";

import { ClientConfig } from "../definitions/ClientConfig";
import { RESPONSE_COMPLETE, RESPONSE_ERROR, TicketResponseHandler } from "../handlers/TicketResponseHandler";
import { TicketResponseValidator } from "../utilities/TicketResponseValidator";

/**
 * Remote Ticket Validator Service
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class TicketValidator {

  private readonly xmlParser: Function;
  private readonly config: ClientConfig;

  private readonly clientUrl: string;
  private readonly ticket: string;

  constructor(xmlParser: Function, config: ClientConfig, clientUrl: string, ticket: string) {
    this.xmlParser = xmlParser;
    this.config = config;
    this.clientUrl = clientUrl;
    this.ticket = ticket;
  }

  public async validate(): Promise<string> {
    const isServerSecure = this.config.server.secure;
    const response = await this.requestValidation(isServerSecure);
    const parsedResponse = await this.xmlParser(response);
    return TicketResponseValidator.extractUser(parsedResponse);
  }

  private getRequestOptions(): RequestOptionsHttp | RequestOptionsHttps {
    const ticketPath = this.config.endpoints.ticketVerificationPath;
    const returnUrl = `${encodeURIComponent(this.clientUrl + `${ticketPath}`)}`;
    return {
      host: this.config.server.host,
      port: this.config.server.port,
      path: `/cas/serviceValidate?service=${returnUrl}&ticket=${this.ticket}`,
      agent: false
    };
  }

  private requestValidation(secure: boolean): Promise<string> {
    return new Promise<string>((resolve: Function, reject: Function) => {
      const handler = new TicketResponseHandler();
      handler.addListener(RESPONSE_COMPLETE, (response: string) => {
        handler.removeAllListeners();
        resolve(response);
      });
      handler.on(RESPONSE_ERROR, (error: any) => {
        handler.removeAllListeners();
        reject(error);
      });
      secure ? https.get(this.getRequestOptions(), handler.handle) : http.get(this.getRequestOptions(), handler.handle);
    });
  }

}