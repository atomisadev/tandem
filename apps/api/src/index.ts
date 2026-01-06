import { createApp } from "./app";
import { config } from "./config";
import { Logger } from "./common/logger";

export type { App } from "./app";

const app = createApp();

app.listen(config.port, () => {
  Logger.info(
    `Server running at http://${app.server?.hostname}:${app.server?.port} in ${config.env} mode`,
  );
});
