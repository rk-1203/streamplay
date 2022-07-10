// Set Request Header jQuery Ajax
export const  getRequestSettings = ({route, user, method, data} = {}) => {
    const BACKEND_HOST = "http://localhost:8080";
    const settings = {
        url: BACKEND_HOST + route,
        method: method,
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
        
    };
    if (user) {
        settings.headers.Authorization = user.token;
    }
    if (data) {
        settings.data = JSON.stringify(data);
    }
    console.log(settings);
    return settings;
};
