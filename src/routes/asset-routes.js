import express from "express";
import AssetManagementController from "../controllers/asset-controller.js";

const assetManagementRouter = express.Router();

assetManagementRouter.get(
  "/",
  AssetManagementController.handleGetAllAssets.bind(AssetManagementController)
);

assetManagementRouter.get(
  "/:id",
  AssetManagementController.handleGetSingleAsset.bind(AssetManagementController)
);

assetManagementRouter.post(
  "/",
  AssetManagementController.handleCreateAsset.bind(AssetManagementController)
);

assetManagementRouter.put(
  "/:id",
  AssetManagementController.handleUpdateAsset.bind(AssetManagementController)
);

assetManagementRouter.delete(
  "/:id",
  AssetManagementController.handleDeleteAsset.bind(AssetManagementController)
);

export default assetManagementRouter;
