import {CONF} from "./photoloader";
import {loadPreOrNextGallery} from "./gallery";

let lightboxContainer = $('#lightbox_container');

export function displayLightbox(photoID) {
    let url = getURLbyID(photoID);
    generateDOM(url);

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

function generateDOM(url) {
    lightboxContainer.empty();

    lightboxContainer.append($(
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

        '        </div>')
    );
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
    $('#lightbox_full_img').attr('src', getURLbyID(photoID));
}


/*
<table class="table table-dark">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
            </tr>
            </tbody>
        </table>
 */