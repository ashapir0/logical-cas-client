import { EventEmitter } from "events";
import { IncomingMessage } from "http";

export const RESPONSE_COMPLETE = "RESPONSE_COMPLETE";
export const RESPONSE_ERROR = "RESPONSE_ERROR";

/**
 * CAS TicketResponse Handler
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 *
 * The class is used to make the generic responses from http or https run asynchronously and utilize Node.js' highly
 * performant event loop; also provides predictable failure states.
 */
export class TicketResponseHandler extends EventEmitter {

  private responseBody: string;

  constructor() {
    super();
    this.responseBody = "";
    this.handle = this.handle.bind(this);
  }

  /**
   * Agnostically handle incoming response messages.
   * @author Aaron J. Shapiro <shapia4@rpi.edu>
   *
   * This class will emit a complete event once the underlying end event is fired.
   * This class will emit an error event if the underlying error event is fired.
   *
   * @param response {IncomingMessage}
   * @returns <void>
   */
  handle(response: IncomingMessage): void {
    response.on("data", (chunk: string) => {
      this.responseBody += chunk;
    });
    response.on("end", () => {
      this.emit(RESPONSE_COMPLETE, this.responseBody);
    });
    response.on("error", (error: any) => {
      this.emit(RESPONSE_ERROR, error);
    });
  }

}