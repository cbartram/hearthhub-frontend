import {K8S_BASE_URL, isProd} from "@/lib/constants.ts";


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
                throw new Error(`error: ${errorData?.error}, status code: ${response.status}, message: ${errorData?.message}`);
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
        if(isProd()) {
            return this.baseURL
        } else {
            return "http://localhost:8080"
        }
    }

    async createCheckoutSession(item) {
        return this.request(`/api/v1/stripe/create-checkout-session?key=${item.name}`, {
            method: 'GET'
        })
    }

    async createBillingSession(sessionId, customerId) {
        if(sessionId == null) {
            return this.request(`/api/v1/stripe/create-billing-session?customerId=${customerId}`, {
                method: 'GET'
            })
        }

        return this.request(`/api/v1/stripe/create-billing-session?sessionId=${sessionId}`, {
            method: 'GET'
        })
    }

    async listFiles() {
        return this.request("/api/v1/file", {
            method: 'GET'
        });
    }

    async getServers() {
        return this.request('/api/v1/server/', {
            method: 'GET'
        });
    }

    async generatePresignedUrls(files) {
        return this.request("/api/v1/file/generate-signed-url", {
            method: 'POST',
            body: JSON.stringify({
                files
            }),
        })
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

    async fileOperation(fileConfig) {
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

export {
    KubeApiClient
};
