import {K8S_BASE_URL} from "@/lib/constants.ts";

class ApiClient {
    constructor(user) {
        this.baseURL = K8S_BASE_URL;
        this.user = user
    }

    getHeaders() {
        const headers = new Headers();
        headers.append("Authorization", `Basic ${btoa(this.user.discordId + ":" + this.user.credentials.refresh_token)}`);
        headers.append("Content-Type", "application/json");
        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders();

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }

            return response;

        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async getServer() {
        return this.request('/api/v1/server/', {
            method: 'GET'
        });
    }

    async createServer(serverConfig) {
        return this.request('/api/v1/server/create', {
            method: 'POST',
            body: JSON.stringify(serverConfig)
        });
    }

    async deleteServer() {
        return this.request('/api/v1/server/delete', {
            method: 'DELETE'
        });
    }

    async installFile(fileConfig) {
        return this.request('/api/v1/file/install', {
            method: 'POST',
            body: JSON.stringify(fileConfig)
        });
    }

    async scaleServer(replicas) {
        return this.request('/api/v1/server/scale', {
            method: 'PUT',
            body: JSON.stringify({replicas})
        });
    }
}

// Create and export a singleton instance
export default ApiClient;
