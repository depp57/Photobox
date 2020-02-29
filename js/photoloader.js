export let CONF = {};

export function init(server_url) {
    CONF.server_url = server_url;
    CONF.withCredentials = true;
}

export function load(uri) {
    uri = CONF.server_url + uri;
    return axios.get(uri, {withCredentials:CONF.withCredentials});
}

export function loadDetails(photoID) {
    let url = CONF.server_url + '/www/canals5/photobox/photos/' + photoID;
    return axios.get(url, {withCredentials:CONF.withCredentials});
}

export function loadComments(photoID) {
    let url = CONF.server_url + '/www/canals5/photobox/photos/' + photoID + '/comments';
    return axios.get(url, {withCredentials:CONF.withCredentials});
}