import app from "./app.js";
import * as config from "./utils/config.js";
import * as logger from "./utils/logger.js";

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});