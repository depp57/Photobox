import {CONF, loadDetails} from "./photoloader";
import {loadPreOrNextGallery} from "./gallery";

let lightboxContainer = $('#lightbox_container');

export function displayLightbox(photoID) {
    generateDOM(photoID);

    lightboxContainer.fadeIn().css("display","flex");
    $(document.body).css('overflow-y', 'hidden');

    $('#lightbox_close').click(() => {
        lightboxContainer.fadeOut().css("display","flex");
        $(document.body).css('overflow-y', 'auto');
        lightboxContainer.empty();
    });

    $('#lightbox_prev').click(() => loadPreOrNextImg(false));
    $('#lightbox_next').click(() => loadPreOrNextImg(true));
}

function getURLbyID(photoID) {
    CONF.currentPhoto = photoID;
    return CONF.server_url + CONF.data.photos[photoID].photo.original.href;
}

function generateDOM(photoID) {
    let url = getURLbyID(photoID);
    lightboxContainer.empty();

    lightboxContainer.append(
        '        <div id="lightbox_content" class="lightbox_content">\n' +
            '        <div id="lightbox-head">\n' +
            '            <p id="lightbox_close" class="text-white display-3 lightbox_close">-X-</p>\n' +
            '            <h1 id="lightbox_title" class="text-white">titre photo</h1>\n' +
            '        </div>\n' +
            '        <div id="lightbox-img" class="lightbox_img pt-2 mb-1">\n' +
            '            <a id="lightbox_prev" class="text-white lightbox_arrow lightbox_arrow_left ml-4">&#10094;</a>\n' +
            `            <img id="lightbox_full_img" src="${url}">\n` +
            '            <a id="lightbox_next" class="text-white lightbox_arrow lightbox_arrow_right mr-4">&#10095;</a>\n' +
            '        </div>' +

        //Là où il faut insérer la table

        '        </div>'
    );

    generatePhotoDetailsDOM(photoID);
}

function generatePhotoDetailsDOM(photoID) {
    let promise = loadDetails(CONF.data.photos[photoID].photo.id);
    promise.then((details) => {
        let lightBoxContent = $('#lightbox_content');
        //Table contenant les détails
        let table = $('<table class="table table-dark">');

        //Header de la table
        table.append('<thead><tr><th scope="col" class="h4">Nom du champ</th><th scope="col" class="h4">Description</th></tr></thead>');

        //Contenu de la table
        let body = $('<tbody id="tbody">');
        let photo = details.data.photo;
        //On change le titre de la photo
        $('#lightbox_title').text(photo.titre);

        Object.keys(photo).forEach((detail) => {
            if (detail !== 'url')
                body.append(`<tr><td id="champ_${detail}" class="font-weight-bold">${detail}</td><td id="desc_${detail}">${photo[detail]}</td></tr>`);
            else
                body.append(`<tr><td id="champ_${detail}" class="font-weight-bold">${detail}</td><td id="desc_${detail}">${CONF.server_url}${photo[detail].href}</td></tr>`);
        });

        table.append(body);
        lightBoxContent.append(table);
    })
        .catch(() => displayError('Erreur du chargement des détails de la photo'));
}

function displayError(error) {
    $('#lightbox_content').append(`<div class="text-center h1 alert alert-danger">${error}</div>`);
}

function loadPreOrNextImg(next=true) {
    //Si on switch de gallerie
    if (next && parseInt(CONF.currentPhoto) === CONF.data.photos.length-1) {
        loadPreOrNextGallery(true).then(() => {
            CONF.currentPhoto = 0;
            changePhoto(CONF.currentPhoto);
        });
    }
    else if (!next && parseInt(CONF.currentPhoto) === 0) {
        loadPreOrNextGallery(false).then(() => {
            CONF.currentPhoto = CONF.data.photos.length-1;
            changePhoto(CONF.currentPhoto);
        });
    }
    else
        next ? changePhoto(++CONF.currentPhoto) : changePhoto(--CONF.currentPhoto);
}

function changePhoto(photoID) {
    //Met à jour la photo
    $('#lightbox_full_img').attr('src', getURLbyID(photoID));

    //Met à jour les détails de la photo sans recréer le DOM
    let promise = loadDetails(CONF.data.photos[photoID].photo.id);
    promise.then((details) => {
        let tableBody = $('#tbody');
        let photo = details.data.photo;

        //On change le titre de la photo
        $('#lightbox_title').text(photo.titre);

        Object.keys(photo).forEach((detail) => {
            if (detail !== 'url')
                tableBody.find(`#desc_${detail}`).text(photo[detail]);
            else
                tableBody.find(`#desc_${detail}`).text(photo[detail].href);

        });
    })
        .catch(() => displayError('Erreur du chargement des détails de la photo'));
}