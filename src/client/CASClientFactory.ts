import { CASClientV2 } from "./CASClientV2";
import { GenericCASClient } from "./GenericCASClient";

import { ClientConfig } from "../definitions/ClientConfig";
import { AuthSuccessFunction, AuthFailureFunction } from "../definitions/AuthCallbacks";

export class CASClientFactory {

  public static getVersionedClient(clientConfig: ClientConfig, onAuthSuccess: AuthSuccessFunction, onAuthFailure: AuthFailureFunction): GenericCASClient {
    switch (clientConfig.server.version) {
      case "2.0":
        return new CASClientV2(clientConfig, onAuthSuccess, onAuthFailure);
      default:
        throw Error("Unsupported CAS Client Version");
    }
  }

}