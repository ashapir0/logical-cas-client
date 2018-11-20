import { CASClientFactory } from "./client/CASClientFactory";

export { CASClientV2 } from "./client/CASClientV2";
export { ClientConfig } from "./definitions/ClientConfig";

export default CASClientFactory.getVersionedClient;