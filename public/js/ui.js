class UserInterfaceController {
  renderAssetsTable(assetsCollection) {
    const tableBodyElement = document.getElementById("assets-table-body");

    if (!assetsCollection || assetsCollection.length === 0) {
      tableBodyElement.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <div class="empty-state-icon">⚙</div>
                        <div class="empty-state-text">No assets found</div>
                    </td>
                </tr>
            `;
      return;
    }

    const tableRowsHTML = assetsCollection
      .map(
        (asset) => `
            <tr data-asset-id="${asset.id}">
                <td>${this.escapeHTML(asset.serial_number)}</td>
                <td>${this.escapeHTML(asset.asset_name)}</td>
                <td>${this.renderStatusBadge(asset.status)}</td>
                <td>${this.formatDateDisplay(asset.last_maintenance_date)}</td>
                <td>${this.formatOEEScore(asset.oee_score)}</td>
                <td>
                    <div class="action-buttons-group">
                        <button class="button-icon edit-asset-button" data-asset-id="${
                          asset.id
                        }">
                            ✎
                        </button>
                        <button class="button-icon button-danger delete-asset-button" data-asset-id="${
                          asset.id
                        }">
                            ✕
                        </button>
                    </div>
                </td>
            </tr>
        `
      )
      .join("");

    tableBodyElement.innerHTML = tableRowsHTML;
  }

  renderStatusBadge(statusValue) {
    const statusClassMap = {
      RUNNING: "running",
      MAINTENANCE: "maintenance",
      DOWN: "down",
    };

    const statusClass = statusClassMap[statusValue] || "running";
    return `<span class="status-badge ${statusClass}">${statusValue}</span>`;
  }

  formatDateDisplay(dateString) {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  formatOEEScore(scoreValue) {
    return `${parseFloat(scoreValue).toFixed(2)}%`;
  }

  updateAssetCountDisplay(totalCount) {
    const assetCountElement = document.getElementById("asset-count");
    const pluralizedLabel = totalCount === 1 ? "Asset" : "Assets";
    assetCountElement.textContent = `${totalCount} ${pluralizedLabel}`;
  }

  updateSystemTimestamp() {
    const timestampElement = document.getElementById("system-timestamp");
    const currentTimestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    timestampElement.textContent = currentTimestamp;
  }

  openModalDialog(modalMode = "create", assetData = null) {
    const modalOverlay = document.getElementById("asset-modal-overlay");
    const modalTitle = document.getElementById("modal-title");
    const assetForm = document.getElementById("asset-form");

    if (modalMode === "create") {
      modalTitle.textContent = "Create New Asset";
      assetForm.reset();
      document.getElementById("asset-id-field").value = "";
    } else if (modalMode === "edit" && assetData) {
      modalTitle.textContent = "Edit Asset";
      this.populateFormWithAssetData(assetData);
    }

    modalOverlay.classList.add("active");
  }

  closeModalDialog() {
    const modalOverlay = document.getElementById("asset-modal-overlay");
    const assetForm = document.getElementById("asset-form");

    modalOverlay.classList.remove("active");
    assetForm.reset();
    document.getElementById("asset-id-field").value = "";
  }

  populateFormWithAssetData(assetData) {
    document.getElementById("asset-id-field").value = assetData.id;
    document.getElementById("asset-name-field").value = assetData.asset_name;
    document.getElementById("serial-number-field").value =
      assetData.serial_number;
    document.getElementById("status-field").value = assetData.status;
    document.getElementById("maintenance-date-field").value =
      this.formatDateForInput(assetData.last_maintenance_date);
    document.getElementById("oee-score-field").value = assetData.oee_score;
  }

  getFormData() {
    return {
      asset_name: document.getElementById("asset-name-field").value.trim(),
      serial_number: document
        .getElementById("serial-number-field")
        .value.trim(),
      status: document.getElementById("status-field").value,
      last_maintenance_date: document.getElementById("maintenance-date-field")
        .value,
      oee_score: parseFloat(document.getElementById("oee-score-field").value),
    };
  }

  formatDateForInput(dateString) {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split("T")[0];
  }

  escapeHTML(unsafeString) {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return unsafeString.replace(/[&<>"']/g, (char) => escapeMap[char]);
  }

  displayNotification(messageText, notificationType = "success") {
    console.log(`[${notificationType.toUpperCase()}] ${messageText}`);
    alert(messageText);
  }
}

export default new UserInterfaceController();
