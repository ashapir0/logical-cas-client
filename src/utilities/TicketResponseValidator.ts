const RESPONSE_PROPERTY = "cas:serviceResponse";
const CAS_AUTH_SUCCESS = "cas:authenticationSuccess";
const CAS_USER = "cas:user";

export class TicketResponseValidator {

  private static isResponseFormValid(casResponse: any): boolean {
    return casResponse.hasOwnProperty(RESPONSE_PROPERTY);
  }

  private static isResponseSuccessful(casResponse: any): boolean {
    return casResponse[RESPONSE_PROPERTY].hasOwnProperty(CAS_AUTH_SUCCESS)
    && Array.isArray(casResponse[RESPONSE_PROPERTY][CAS_AUTH_SUCCESS])
    && casResponse[RESPONSE_PROPERTY][CAS_AUTH_SUCCESS].length > 0;
  }

  private static isResponseUserValid(casResponse: any): boolean {
   return casResponse[RESPONSE_PROPERTY][CAS_AUTH_SUCCESS][0].hasOwnProperty(CAS_USER)
     && Array.isArray(casResponse[RESPONSE_PROPERTY][CAS_AUTH_SUCCESS][0][CAS_USER])
     && casResponse[RESPONSE_PROPERTY][CAS_AUTH_SUCCESS][0][CAS_USER].length > 0;
  }

  private static isCasAuthSuccessful(casResponse: any) {
    return TicketResponseValidator.isResponseFormValid(casResponse)
      && TicketResponseValidator.isResponseSuccessful(casResponse)
      && TicketResponseValidator.isResponseUserValid(casResponse);
  }

  public static extractUser(casResponse: any): string {
    if (!TicketResponseValidator.isCasAuthSuccessful(casResponse))
      throw Error("invalid cas response");
    return casResponse[RESPONSE_PROPERTY][CAS_AUTH_SUCCESS][0][CAS_USER][0];
  }

}