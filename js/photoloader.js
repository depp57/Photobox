export let CONF = {};

export function init(server_url) {
    CONF.server_url = server_url;
    CONF.withCredentials = true;
}

export function load(uri) {
    uri = CONF.server_url + uri;
    return axios.get(uri, {withCredentials:CONF.withCredentials});
}