import { IncomingMessage } from "http";
import { EventEmitter } from "events";

export const RESPONSE_COMPLETE = "RESPONSE_COMPLETE";
export const RESPONSE_ERROR = "RESPONSE_ERROR";

export class TicketResponseHandler extends EventEmitter {

  private responseBody: string;

  constructor() {
    super();
    this.responseBody = "";
    this.handle = this.handle.bind(this);
  }

  handle(response: IncomingMessage) {
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