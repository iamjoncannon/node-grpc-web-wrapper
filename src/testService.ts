/* istanbul ignore file */

import GrpcWebServer from ".";
import { getMockGrpcService } from "./mock/server/service";

/**
 * mock service to test locally
 */
const mockService = () => {
  const mockService = getMockGrpcService();

  GrpcWebServer(mockService, { cors: "*" }).listen(1337, () => {
    console.log("started test service");
  });
};

if (require.main === module) {
  mockService();
}
