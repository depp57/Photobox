import {load} from "./photoloader";

let CONF = {};

export function init() {
    CONF.galleryID = 'TODO';
}

function displayError(error) {
    let gallery = $('#gallery');
    gallery.empty();

    gallery.append($(`<div class="text-center display-1">${error}</div>`));
}

export function loadData(uri) {
    let promise = load(uri);
    promise.then(photos => {
            CONF.currentUri = uri;
            CONF.data = photos.data;
            displayGallery()
        })
        .catch(() => displayError('Erreur lors du chargement de la gallerie'));
}

/**
 * Utilise l'objet CONF qui contient les données chargées par la requete AJAX
 */
function displayGallery() {
    let gallery = $('#gallery');
    gallery.empty();

    let container = $('<div class="d-flex flex-wrap justify-content-center align-content-center">');
    gallery.append(container);

    CONF.data.photos.forEach(photo => {
        let img = $('<div class="m-2">');
        img.append($(`<img src="https://webetu.iutnc.univ-lorraine.fr/${photo.photo.original.href}" height="265">`));
        img.append($(`<p class="text-center">${photo.photo.titre}</p>`));
        container.append(img);
    });
}

/**
 * Charge la gallerie précédente/suivante
 * @param next True si on veut charger la gallerie suivante
 */
export function loadPreOrNextGallery(next = true) {
    if (CONF.data === undefined)
        displayError('Veuillez d\'abord charger une gallerie');
    else {
        let links = CONF.data.links;
        let uri;

        if (next)
            CONF.currentUri !== links.next.href ? uri = links.next.href : uri = links.first.href;
        else
            CONF.currentUri !== links.prev.href ? uri = links.prev.href : uri = links.last.href;

        uri = uri.split('size')[0] + 'size=12';
        if (uri === '/www/canals5/photobox/photos/?offset=108&size=12')
            uri = '/www/canals5/photobox/photos/?offset=96&size=12';

        loadData(uri);
    }
}