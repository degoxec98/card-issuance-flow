import "dotenv/config";
import app from "./app";
import { logger } from "./commons/utils/Logger";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

bootstrap();