export type ClientConfig = {
  host: string,
  port?: number,
  secure: boolean,
  endpoints: {
    loginRedirectPath: string,
    ticketVerificationPath: string
  },
  server: {
    host: string,
    port?: number,
    secure: boolean,
    version: string
  }
}