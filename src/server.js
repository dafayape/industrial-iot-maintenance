import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { testDatabaseConnection } from "./config/database.js";
import assetManagementRouter from "./routes/asset-routes.js";

dotenv.config();

const currentFileDirectory = path.dirname(fileURLToPath(import.meta.url));
const applicationInstance = express();
const serverListeningPort = process.env.PORT || 3000;

applicationInstance.use(cors());
applicationInstance.use(express.json());
applicationInstance.use(express.urlencoded({ extended: true }));

applicationInstance.use(
  express.static(path.join(currentFileDirectory, "../public"))
);

applicationInstance.use("/api/assets", assetManagementRouter);

applicationInstance.get("/health", (request, response) => {
  response.status(200).json({
    status: "operational",
    timestamp: new Date().toISOString(),
  });
});

async function initializeAndStartServer() {
  try {
    const isDatabaseConnected = await testDatabaseConnection();

    if (!isDatabaseConnected) {
      console.error("[SERVER] Cannot start: Database connection failed");
      process.exit(1);
    }

    applicationInstance.listen(serverListeningPort, () => {
      console.log(
        `[SERVER] Industrial IoT System running on port ${serverListeningPort}`
      );
      console.log(`[SERVER] Frontend: http://localhost:${serverListeningPort}`);
      console.log(
        `[SERVER] API: http://localhost:${serverListeningPort}/api/assets`
      );
    });
  } catch (error) {
    console.error("[SERVER] Initialization failed:", error);
    process.exit(1);
  }
}

initializeAndStartServer();
