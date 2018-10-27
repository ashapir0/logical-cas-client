import xml from "xml2js";
import util from "util";

import { Response, Request } from "express";

import { ClientConfig } from "..";
import { GenericCASClient } from "./GenericCASClient";
import { TicketValidator } from "../services/TicketValidator";
import { AuthFailureFunction, AuthSuccessFunction } from "../definitions/AuthCallbacks";

/**
 * Central-Authentication-Client for CAS-V2
 */
export class CASClientV2 extends GenericCASClient {

  private readonly parseXmlAsync: Function;

  /**
   * CASClientV2 Constructor
   * @author Aaron J. Shapiro <shapia4@rpi.edu>
   *
   * For the onSuccess/onFailure functions you most likely want to redirect the user to a corresponding frontend handler.
   *
   * @param config {ClientConfig} - CAS / Service Configuration used to communicate with CAS.
   * @param onAuthSuccess {AuthSuccessFunction} - this function will be called whenever a user authenticates successfully.
   * @param onAuthFailure {AuthFailureFunction} - this function will be called whenever a user fails to authenticate.
   *
   * @returns {CASClientV2} - a new and configured instance of this CAS-Client;
   */
  public constructor(config: ClientConfig, onAuthSuccess: AuthSuccessFunction, onAuthFailure: AuthFailureFunction) {
    super(config, onAuthSuccess, onAuthFailure);
    this.parseXmlAsync = util.promisify(xml.parseString);
    this.verifyTicket = this.verifyTicket.bind(this);
  }

  /**
   * CAS Redirect Endpoint
   * @author Aaron J. Shapiro <shapia4@rpi.edu>
   *
   * Client-implementations should bind their login endpoint to this function, when a user visits the endpoint
   * they will be redirected to the CAS service, which will issue them a ticket and redirect them back to the client-service.
   *
   * @param req {Express.Request}
   * @param res {Express.Response}
   */
  public async redirectToCASLogin(req: Request, res: Response): Promise<void> {
    void (req);
    const ticketEndpoint = this.config.endpoints.ticketVerificationPath;
    const returnUrl  = `?service=${encodeURIComponent(this.getClientUrl() + `${ticketEndpoint}`)}`;
    const redirectUrl = `${this.getServerUrl()}/cas/login${returnUrl}`;
    res.redirect(redirectUrl);
  }

  /**
   * CAS Ticket Verification Endpoint
   * @author Aaron J. Shapiro <shapia4@rpi.edu>
   *
   * The client service needs to verify the ticket that the CAS issued and fetch the CAS-provided user identifier.
   * This function will make an asynchronous call to the CAS, verify the ticket and parse out the user-identifier.
   *
   * Depending on whether or not the verification was successful, the corresponding - client-implemented - callbacks
   * will be executed with the relevant user/error data.
   *
   * @param req {Express.Request}
   * @param res {Express.Response}
   *
   */
  public async verifyTicket(req: Request, res: Response): Promise<void> {
    const ticket = req.query.ticket;
    try {
      const ticketValidator = new TicketValidator(this.parseXmlAsync, this.config, this.getClientUrl(), ticket);
      const user = await ticketValidator.validate();
      await this.onAuthSuccess(req, res, user);
    }
    catch (error) {
      await this.onAuthFailure(req, res, error);
    }
  }

}