export let CONF = {};

export function init(server_url) {
    CONF.server_url = server_url;
}

export function load(uri) {
    uri = CONF.server_url + uri;
    return axios.get(uri, {withCredentials:true});
}

export function loadDetails(photoID) {
    let url = CONF.server_url + '/www/canals5/photobox/photos/' + photoID;
    return axios.get(url, {withCredentials:true});
}

export function loadComments(photoID) {
    let url = CONF.server_url + '/www/canals5/photobox/photos/' + photoID + '/comments';
    return axios.get(url, {withCredentials:true});
}

export function postComment(photoID, comment) {
    let url = CONF.server_url + '/www/canals5/photobox/photos/' + photoID + '/comments';
    return axios.post(url, comment, {withCredentials:true});
}