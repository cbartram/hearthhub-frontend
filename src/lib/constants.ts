// The prod base url for the API gateway/lambda backed hearthhub API.
const K8S_BASE_URL: string = "http://hearthhub.duckdns.org"

const isProd = () => {
    return window.location.hostname !== "localhost"
}

export {
    isProd,
    K8S_BASE_URL
}