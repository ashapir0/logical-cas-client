import xml from "xml2js";
import util from "util";

import { Response, Request } from "express";

import { ClientConfig } from "..";
import { GenericCASClient } from "./GenericCASClient";
import { TicketValidator } from "../services/TicketValidator";

type AuthSuccessFunction = ((userId: string, authResponse: Response) => Promise<any>);
type AuthFailureFunction = ((error: any, authResponse: Response) => Promise<any>);

export class CASClientV2 extends GenericCASClient {

  private readonly parseXmlAsync: Function;

  private readonly onAuthSuccess: AuthSuccessFunction;
  private readonly onAuthFailure: AuthFailureFunction;

  public constructor(config: ClientConfig, onAuthSuccess: AuthSuccessFunction, onAuthFailure: AuthFailureFunction) {
    super(config);

    this.onAuthSuccess = onAuthSuccess;
    this.onAuthFailure = onAuthFailure;
    this.parseXmlAsync = util.promisify(xml.parseString);

    this.verifyTicket = this.verifyTicket.bind(this);
  }

  async redirectToCASLogin(req: Request, res: Response): Promise<void> {
    void (req);
    const ticketEndpoint = this.config.endpoints.ticketVerificationPath;
    const returnUrl  = `?service=${encodeURIComponent(this.getClientUrl() + `${ticketEndpoint}`)}`;
    const redirectUrl = `${this.getServerUrl()}/cas/login${returnUrl}`;
    res.redirect(redirectUrl);
  }

  async verifyTicket(req: Request, res: Response): Promise<void> {
    const ticket = req.query.ticket;
    try {
      const ticketValidator = new TicketValidator(this.parseXmlAsync, this.config, this.getClientUrl(), ticket);
      const user = await ticketValidator.validate();
      await this.onAuthSuccess(user, res);
    }
    catch (error) {
      await this.onAuthFailure(error, res);
    }
  }

}