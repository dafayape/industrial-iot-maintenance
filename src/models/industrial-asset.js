import { databaseConnectionPool } from "../config/database.js";
import { v4 as generateUniqueIdentifier } from "uuid";

class IndustrialAssetRepository {
  async getAllIndustrialAssets() {
    const sqlQuerySelectAllAssets = `
            SELECT
                id,
                asset_name,
                serial_number,
                status,
                last_maintenance_date,
                oee_score,
                created_at,
                updated_at
            FROM industrial_assets
            ORDER BY created_at DESC
        `;

    const [assetRecordsResultSet] = await databaseConnectionPool.execute(
      sqlQuerySelectAllAssets
    );
    return assetRecordsResultSet;
  }

  async getIndustrialAssetByIdentifier(assetIdentifier) {
    const sqlQuerySelectSingleAsset = `
            SELECT
                id,
                asset_name,
                serial_number,
                status,
                last_maintenance_date,
                oee_score,
                created_at,
                updated_at
            FROM industrial_assets
            WHERE id = ?
        `;

    const [assetRecordsResultSet] = await databaseConnectionPool.execute(
      sqlQuerySelectSingleAsset,
      [assetIdentifier]
    );

    return assetRecordsResultSet[0] || null;
  }

  async createNewIndustrialAsset(assetDataPayload) {
    const newAssetUniqueIdentifier = generateUniqueIdentifier();

    const sqlQueryInsertAsset = `
            INSERT INTO industrial_assets (
                id,
                asset_name,
                serial_number,
                status,
                last_maintenance_date,
                oee_score
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;

    const assetInsertionParameters = [
      newAssetUniqueIdentifier,
      assetDataPayload.asset_name,
      assetDataPayload.serial_number,
      assetDataPayload.status,
      assetDataPayload.last_maintenance_date,
      assetDataPayload.oee_score,
    ];

    await databaseConnectionPool.execute(
      sqlQueryInsertAsset,
      assetInsertionParameters
    );

    return this.getIndustrialAssetByIdentifier(newAssetUniqueIdentifier);
  }

  async updateExistingIndustrialAsset(assetIdentifier, assetUpdatePayload) {
    const sqlQueryUpdateAsset = `
            UPDATE industrial_assets
            SET
                asset_name = ?,
                serial_number = ?,
                status = ?,
                last_maintenance_date = ?,
                oee_score = ?
            WHERE id = ?
        `;

    const assetUpdateParameters = [
      assetUpdatePayload.asset_name,
      assetUpdatePayload.serial_number,
      assetUpdatePayload.status,
      assetUpdatePayload.last_maintenance_date,
      assetUpdatePayload.oee_score,
      assetIdentifier,
    ];

    const [updateOperationResult] = await databaseConnectionPool.execute(
      sqlQueryUpdateAsset,
      assetUpdateParameters
    );

    if (updateOperationResult.affectedRows === 0) {
      return null;
    }

    return this.getIndustrialAssetByIdentifier(assetIdentifier);
  }

  async deleteIndustrialAssetByIdentifier(assetIdentifier) {
    const sqlQueryDeleteAsset = `DELETE FROM industrial_assets WHERE id = ?`;

    const [deleteOperationResult] = await databaseConnectionPool.execute(
      sqlQueryDeleteAsset,
      [assetIdentifier]
    );

    return deleteOperationResult.affectedRows > 0;
  }

  async checkSerialNumberUniqueness(
    serialNumber,
    excludeAssetIdentifier = null
  ) {
    let sqlQueryCheckSerial = `
            SELECT id FROM industrial_assets WHERE serial_number = ?
        `;

    const queryParameters = [serialNumber];

    if (excludeAssetIdentifier) {
      sqlQueryCheckSerial += ` AND id != ?`;
      queryParameters.push(excludeAssetIdentifier);
    }

    const [existingRecords] = await databaseConnectionPool.execute(
      sqlQueryCheckSerial,
      queryParameters
    );

    return existingRecords.length === 0;
  }
}

export default new IndustrialAssetRepository();
