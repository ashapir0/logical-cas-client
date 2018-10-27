export type ClientConfig = {
  host: string,
  port?: number,
  secure: boolean,
  endpoints: {
    ticketVerificationPath: string
  },
  server: {
    host: string,
    port?: number,
    secure: boolean,
    version: string
  }
}