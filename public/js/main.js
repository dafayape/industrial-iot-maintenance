import IndustrialAssetAPIClient from "./api.js";
import UserInterfaceController from "./ui.js";

class IndustrialAssetManagementApplication {
  constructor() {
    this.currentAssets = [];
    this.initializeApplication();
  }

  initializeApplication() {
    this.attachEventListeners();
    this.loadAllAssets();
    this.startTimestampUpdater();
  }

  attachEventListeners() {
    document
      .getElementById("open-create-modal-button")
      .addEventListener("click", () => {
        UserInterfaceController.openModalDialog("create");
      });

    document
      .getElementById("modal-close-button")
      .addEventListener("click", () => {
        UserInterfaceController.closeModalDialog();
      });

    document
      .getElementById("modal-cancel-button")
      .addEventListener("click", () => {
        UserInterfaceController.closeModalDialog();
      });

    document
      .getElementById("asset-modal-overlay")
      .addEventListener("click", (event) => {
        if (event.target.id === "asset-modal-overlay") {
          UserInterfaceController.closeModalDialog();
        }
      });

    document
      .getElementById("modal-submit-button")
      .addEventListener("click", () => {
        this.handleFormSubmission();
      });

    document
      .getElementById("assets-table-body")
      .addEventListener("click", (event) => {
        this.handleTableActions(event);
      });
  }

  async loadAllAssets() {
    try {
      const response = await IndustrialAssetAPIClient.fetchAllAssets();
      this.currentAssets = response.data || [];
      UserInterfaceController.renderAssetsTable(this.currentAssets);
      UserInterfaceController.updateAssetCountDisplay(
        this.currentAssets.length
      );
    } catch (error) {
      UserInterfaceController.displayNotification(
        "Failed to load assets",
        "error"
      );
    }
  }

  async handleFormSubmission() {
    const assetIdentifier = document.getElementById("asset-id-field").value;
    const formData = UserInterfaceController.getFormData();

    if (!this.validateFormData(formData)) {
      UserInterfaceController.displayNotification(
        "Please fill all required fields correctly",
        "error"
      );
      return;
    }

    try {
      if (assetIdentifier) {
        await IndustrialAssetAPIClient.updateExistingAsset(
          assetIdentifier,
          formData
        );
        UserInterfaceController.displayNotification(
          "Asset updated successfully",
          "success"
        );
      } else {
        await IndustrialAssetAPIClient.createNewAsset(formData);
        UserInterfaceController.displayNotification(
          "Asset created successfully",
          "success"
        );
      }

      UserInterfaceController.closeModalDialog();
      await this.loadAllAssets();
    } catch (error) {
      UserInterfaceController.displayNotification(
        error.message || "Operation failed",
        "error"
      );
    }
  }

  async handleTableActions(event) {
    const targetElement = event.target;

    if (targetElement.classList.contains("edit-asset-button")) {
      const assetIdentifier = targetElement.dataset.assetId;
      await this.handleEditAsset(assetIdentifier);
    }

    if (targetElement.classList.contains("delete-asset-button")) {
      const assetIdentifier = targetElement.dataset.assetId;
      await this.handleDeleteAsset(assetIdentifier);
    }
  }

  async handleEditAsset(assetIdentifier) {
    try {
      const response = await IndustrialAssetAPIClient.fetchAssetByIdentifier(
        assetIdentifier
      );
      UserInterfaceController.openModalDialog("edit", response.data);
    } catch (error) {
      UserInterfaceController.displayNotification(
        "Failed to load asset details",
        "error"
      );
    }
  }

  async handleDeleteAsset(assetIdentifier) {
    const confirmDeletion = confirm(
      "Are you sure you want to delete this asset? This action cannot be undone."
    );

    if (!confirmDeletion) {
      return;
    }

    try {
      await IndustrialAssetAPIClient.deleteAssetByIdentifier(assetIdentifier);
      UserInterfaceController.displayNotification(
        "Asset deleted successfully",
        "success"
      );
      await this.loadAllAssets();
    } catch (error) {
      UserInterfaceController.displayNotification(
        "Failed to delete asset",
        "error"
      );
    }
  }

  validateFormData(formData) {
    if (
      !formData.asset_name ||
      !formData.serial_number ||
      !formData.status ||
      !formData.last_maintenance_date ||
      isNaN(formData.oee_score)
    ) {
      return false;
    }

    if (formData.oee_score < 0 || formData.oee_score > 100) {
      return false;
    }

    return true;
  }

  startTimestampUpdater() {
    UserInterfaceController.updateSystemTimestamp();
    setInterval(() => {
      UserInterfaceController.updateSystemTimestamp();
    }, 1000);
  }
}

new IndustrialAssetManagementApplication();
