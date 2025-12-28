import IndustrialAssetRepository from "../models/industrial-asset.js";

class AssetManagementController {
  async handleGetAllAssets(request, response) {
    try {
      const allIndustrialAssets =
        await IndustrialAssetRepository.getAllIndustrialAssets();

      return response.status(200).json({
        success: true,
        data: allIndustrialAssets,
        total: allIndustrialAssets.length,
      });
    } catch (error) {
      console.error("[CONTROLLER] Error fetching assets:", error);
      return response.status(500).json({
        success: false,
        message: "Internal server error while retrieving assets",
      });
    }
  }

  async handleGetSingleAsset(request, response) {
    try {
      const assetIdentifier = request.params.id;
      const retrievedAsset =
        await IndustrialAssetRepository.getIndustrialAssetByIdentifier(
          assetIdentifier
        );

      if (!retrievedAsset) {
        return response.status(404).json({
          success: false,
          message: "Asset not found with provided identifier",
        });
      }

      return response.status(200).json({
        success: true,
        data: retrievedAsset,
      });
    } catch (error) {
      console.error("[CONTROLLER] Error fetching single asset:", error);
      return response.status(500).json({
        success: false,
        message: "Internal server error while retrieving asset",
      });
    }
  }

  async handleCreateAsset(request, response) {
    try {
      const assetCreationPayload = request.body;

      const validationResult = this.validateAssetPayload(assetCreationPayload);
      if (!validationResult.isValid) {
        return response.status(400).json({
          success: false,
          message: validationResult.errorMessage,
        });
      }

      const isSerialNumberUnique =
        await IndustrialAssetRepository.checkSerialNumberUniqueness(
          assetCreationPayload.serial_number
        );

      if (!isSerialNumberUnique) {
        return response.status(409).json({
          success: false,
          message: "Serial number already exists in the system",
        });
      }

      const newlyCreatedAsset =
        await IndustrialAssetRepository.createNewIndustrialAsset(
          assetCreationPayload
        );

      return response.status(201).json({
        success: true,
        message: "Asset created successfully",
        data: newlyCreatedAsset,
      });
    } catch (error) {
      console.error("[CONTROLLER] Error creating asset:", error);
      return response.status(500).json({
        success: false,
        message: "Internal server error while creating asset",
      });
    }
  }

  async handleUpdateAsset(request, response) {
    try {
      const assetIdentifier = request.params.id;
      const assetUpdatePayload = request.body;

      const validationResult = this.validateAssetPayload(assetUpdatePayload);
      if (!validationResult.isValid) {
        return response.status(400).json({
          success: false,
          message: validationResult.errorMessage,
        });
      }

      const isSerialNumberUnique =
        await IndustrialAssetRepository.checkSerialNumberUniqueness(
          assetUpdatePayload.serial_number,
          assetIdentifier
        );

      if (!isSerialNumberUnique) {
        return response.status(409).json({
          success: false,
          message: "Serial number already exists in the system",
        });
      }

      const updatedAsset =
        await IndustrialAssetRepository.updateExistingIndustrialAsset(
          assetIdentifier,
          assetUpdatePayload
        );

      if (!updatedAsset) {
        return response.status(404).json({
          success: false,
          message: "Asset not found with provided identifier",
        });
      }

      return response.status(200).json({
        success: true,
        message: "Asset updated successfully",
        data: updatedAsset,
      });
    } catch (error) {
      console.error("[CONTROLLER] Error updating asset:", error);
      return response.status(500).json({
        success: false,
        message: "Internal server error while updating asset",
      });
    }
  }

  async handleDeleteAsset(request, response) {
    try {
      const assetIdentifier = request.params.id;
      const wasDeleted =
        await IndustrialAssetRepository.deleteIndustrialAssetByIdentifier(
          assetIdentifier
        );

      if (!wasDeleted) {
        return response.status(404).json({
          success: false,
          message: "Asset not found with provided identifier",
        });
      }

      return response.status(200).json({
        success: true,
        message: "Asset deleted successfully",
      });
    } catch (error) {
      console.error("[CONTROLLER] Error deleting asset:", error);
      return response.status(500).json({
        success: false,
        message: "Internal server error while deleting asset",
      });
    }
  }

  validateAssetPayload(payload) {
    const requiredFields = [
      "asset_name",
      "serial_number",
      "status",
      "last_maintenance_date",
      "oee_score",
    ];
    const validStatuses = ["RUNNING", "MAINTENANCE", "DOWN"];

    for (const field of requiredFields) {
      if (!payload[field]) {
        return {
          isValid: false,
          errorMessage: `Missing required field: ${field}`,
        };
      }
    }

    if (!validStatuses.includes(payload.status)) {
      return {
        isValid: false,
        errorMessage: "Invalid status. Must be RUNNING, MAINTENANCE, or DOWN",
      };
    }

    const oeeScore = parseFloat(payload.oee_score);
    if (isNaN(oeeScore) || oeeScore < 0 || oeeScore > 100) {
      return {
        isValid: false,
        errorMessage: "OEE score must be a number between 0 and 100",
      };
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(payload.last_maintenance_date)) {
      return {
        isValid: false,
        errorMessage: "Invalid date format. Use YYYY-MM-DD",
      };
    }

    return { isValid: true };
  }
}

export default new AssetManagementController();
