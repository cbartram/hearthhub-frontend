import {K8S_BASE_URL, BASE_URL} from "@/lib/constants.ts";


class ApiClient {
    constructor(user) {
        this.user = user
    }

    /**
     * Makes a generic asynchronous request to an API endpoint using the fetch API.
     * @param endpoint The endpoint to make a request to not including the base URL. i.e. /api/v1/health
     * @param options Any fetch options to pass along to the request including request method and body.
     * @returns {Promise<Response|any>}
     */
    async request(endpoint, options = {}) {
        const url = `${this.getBaseUrl()}${endpoint}`;
        const headers = this.getHeaders();

        const config = {
            headers,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                console.error("error during http fetch")
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

    getHeaders() {
        throw new Error("Method getHeaders() must be implemented.")
    }

    getBaseUrl() {
        throw new Error("Method getBaseUrl() must be implemented.")
    }
}

/**
 * HearthHub API client provides a frontend abstraction for:
 * - The Lambda API client responsible for discord sign-up, login, and file upload / fetching from S3.
 */
class HearthHubApiClient extends ApiClient {
    constructor(user) {
        super(user);
        this.baseURL = BASE_URL
    }

    getBaseUrl() {
        return this.baseURL
    }

    getHeaders() {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${this.user.credentials.id_token}`);
        headers.append("Content-Type", "application/json");
        return headers;
    }

    async listFiles(type) {
        const validTypes = {
            "mods": "",
            "mods/": "",
            "configs": "",
            "configs/": "",
            "backups": "",
            "backups/": ""
        }

        if(!(type in validTypes)) {
            console.error(`${type} is not a valid file prefix.`)
            return Promise.reject(`${type} is not a valid file prefix`)
        }

        return this.request(`/prod/api/v1/file?discordId=${this.user.discordId}&prefix=${type}&refreshToken=${this.user.credentials.refresh_token}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${this.user.credentials.id_token}`,
                "Content-Type": "application/json"
            }
        });
    }
}


/**
 * Functions as the client for the Kubernetes API client hosted on the kubernetes cluster.
 * This API is responsible for all server, file install, and backup operations.
 */
class KubeApiClient extends ApiClient {
    constructor(user) {
        super(user)
        this.baseURL = K8S_BASE_URL;
    }

    getHeaders() {
        const headers = new Headers();
        headers.append("Authorization", `Basic ${btoa(this.user.discordId + ":" + this.user.credentials.refresh_token)}`);
        headers.append("Content-Type", "application/json");
        return headers;
    }

    getBaseUrl() {
        return this.baseURL
    }

    async getServers() {
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

    async patchServer(serverConfig) {
        return this.request('/api/v1/server/update', {
            method: 'PUT',
            body: JSON.stringify(serverConfig)
        })
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
export {
    KubeApiClient,
    HearthHubApiClient
};
