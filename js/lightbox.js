import {CONF, loadComments, loadDetails} from "./photoloader";
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
        '        <div id="lightbox_content" class="lightbox_content">' +
                    '<div id="lightbox-head">' +
                        '<p id="lightbox_close" class="text-white display-3 lightbox_close">-X-</p>' +
                        '<h1 id="lightbox_title" class="text-white">titre photo</h1>' +
                    '</div>' +
                    '<div id="lightbox-img" class="lightbox_img pt-2 mb-1">' +
                        '<a id="lightbox_prev" class="text-white lightbox_arrow lightbox_arrow_left ml-4">&#10094;</a>' +
                        `<img id="lightbox_full_img" src="${url}">` +
                        '<a id="lightbox_next" class="text-white lightbox_arrow lightbox_arrow_right mr-4">&#10095;</a>' +
                    '</div>' +

                    '<ul class="bg-dark menu">' +
                        '<li id="menu-details"><p class="text-white h4">Afficher les détails de la photo</p>'+
                        '<li id="menu-comments"><p class="text-white h4">Afficher ou ajouter un commentaire à la photo</p>' +
                '</div>'
    );

    generatePhotoDetailsDOM(photoID);
    generateCommentsDOM(photoID);
}

function generatePhotoDetailsDOM(photoID) {
    let promise = loadDetails(CONF.data.photos[photoID].photo.id);
    promise.then((details) => {
        let lightBoxContent = $('#lightbox_content');
        //Table contenant les détails
        let table = $('<table id="table-details" class="table table-dark" style="display:none">');

        //Header de la table
        table.append('<thead><tr><th scope="col" class="h4">Nom du champ</th><th scope="col" class="h4">Description</th></tr></thead>');

        //Contenu de la table
        let body = $('<tbody id="tbody-details">');
        let photo = details.data.photo;
        //On change le titre de la photo
        $('#lightbox_title').text(photo.titre);

        Object.keys(photo).forEach((detail) => {
            if (detail !== 'url')
                body.append(`<tr><td class="font-weight-bold">${detail}</td><td id="desc_d_${detail}">${photo[detail]}</td></tr>`);
            else
                body.append(`<tr><td class="font-weight-bold">${detail}</td><td id="desc_d_${detail}">${CONF.server_url}${photo[detail].href}</td></tr>`);
        });

        table.append(body);
        lightBoxContent.append(table);

        //Ajout du handler pour afficher les commentaires
        $('#menu-details').click(() => $('#table-details').toggle('slow'));

    })
        .catch(() => displayError('Erreur lors du chargement des détails de la photo'));
}

function generateCommentsDOM(photoID) {
    let promise = loadComments(CONF.data.photos[photoID].photo.id);
    promise.then((comments) => {
        let lightBoxContent = $('#lightbox_content');
        //Table contenant les commentaires
        let table = $('<table id="table-comments" class="table table-dark" style="display:none">');

        //Header de la table
        table.append('<thead><tr>' +
                        '<th scope="col" class="h4">No</th>' +
                        '<th scope="col" class="h4">Titre</th>' +
                        '<th scope="col" class="h4">Pseudo</th>' +
                        '<th scope="col" class="h4">Corps</th>' +
                        '<th scope="col" class="h4">Date</th>' +
                    '</tr></thead>');

        //Contenu de la table
        let body = $('<tbody id="tbody-comments">');


        let num = 1;
        comments.data.comments.forEach((comment) => {
            body.append(`<tr>
                            <td class="font-weight-bold">${num++}</td>
                            <td id="desc_c_title">${comment.titre}</td>
                            <td id="desc_c_nickname">${comment.pseudo}</td>
                            <td id="desc_c_content">${comment.content}</td>
                            <td id="desc_c_date">${comment.date}</td>`)});

        table.append(body);
        lightBoxContent.append(table);
        //Ajout du handler pour afficher les commentaires
        $('#menu-comments').click(() => $('#table-comments').toggle('slow'));
    })
        .catch((e) => displayError('Erreur lors du chargement des commentaires de la photo' + e));
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
    let promiseDetails = loadDetails(CONF.data.photos[photoID].photo.id);
    promiseDetails.then((details) => {
        let tableBody = $('#tbody-details');
        let photo = details.data.photo;

        //On change le titre de la photo
        $('#lightbox_title').text(photo.titre);

        Object.keys(photo).forEach((detail) => {
            if (detail !== 'url')
                tableBody.find(`#desc_d_${detail}`).text(photo[detail]);
            else
                tableBody.find(`#desc_d_${detail}`).text(photo[detail].href);

        });
    })
        .catch(() => displayError('Erreur lors du chargement des détails de la photo'));


    //Met à jour les commentaires de la photo sans recréer le DOM
    let promiseComments = loadComments(CONF.data.photos[photoID].photo.id);
    promiseComments.then((data) => {
        let tableBody = $('#tbody-comments');
        tableBody.empty();

        let num = 1;
        data.data.comments.forEach((comment) => {
            tableBody.append(`<tr>
                            <td class="font-weight-bold">${num++}</td>
                            <td id="desc_c_title">${comment.titre}</td>
                            <td id="desc_c_nickname">${comment.pseudo}</td>
                            <td id="desc_c_content">${comment.content}</td>
                            <td id="desc_c_date">${comment.date}</td>`)});
    })
        .catch((e) => displayError('Erreur lors du chargements des commentaires de la photo' + e));
}