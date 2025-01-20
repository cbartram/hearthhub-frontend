const BASE_URL: string = "https://k3mkh4ly97.execute-api.us-east-1.amazonaws.com"

const isProd = () => {
    return window.location.hostname !== "localhost"
}


export {
    isProd,
    BASE_URL
}