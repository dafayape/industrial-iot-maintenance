class IndustrialAssetAPIClient {
  constructor(baseURL = "/api/assets") {
    this.baseURL = baseURL;
  }

  async executeRequest(endpoint, options = {}) {
    const requestURL = `${this.baseURL}${endpoint}`;
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const requestConfiguration = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(requestURL, requestConfiguration);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Request failed");
      }

      return responseData;
    } catch (error) {
      console.error("[API] Request error:", error);
      throw error;
    }
  }

  async fetchAllAssets() {
    return this.executeRequest("", {
      method: "GET",
    });
  }

  async fetchAssetByIdentifier(assetIdentifier) {
    return this.executeRequest(`/${assetIdentifier}`, {
      method: "GET",
    });
  }

  async createNewAsset(assetPayload) {
    return this.executeRequest("", {
      method: "POST",
      body: JSON.stringify(assetPayload),
    });
  }

  async updateExistingAsset(assetIdentifier, assetPayload) {
    return this.executeRequest(`/${assetIdentifier}`, {
      method: "PUT",
      body: JSON.stringify(assetPayload),
    });
  }

  async deleteAssetByIdentifier(assetIdentifier) {
    return this.executeRequest(`/${assetIdentifier}`, {
      method: "DELETE",
    });
  }
}

export default new IndustrialAssetAPIClient();
