import {init as initLoader, load} from "./photoloader.js";
import {loadData, loadPreOrNextGallery} from "./gallery.js";
import {displayLightbox} from "./lightbox.js";

$(document).ready(() => {
    initLoader('https://webetu.iutnc.univ-lorraine.fr');
    initHandlers();
});

function initHandlers() {
    let bLoad =  $('#load_gallery');
    bLoad.click(() => {
        let uri = '/www/canals5/photobox/photos/?offset=0&size=12';
        loadData(load(uri), uri);
    });

    $('#gallery').on('click', 'img', (e) => displayLightbox(e.target.getAttribute('photoid')));
    $('#previous').click(() => loadPreOrNextGallery(false));
    $('#next').click(() => loadPreOrNextGallery(true));

    //Pour changer le thème (dark/light)
    $('#theme-icon').click((e) => {
        let icon = $(e.target);
        const speed = 300;
        icon.fadeOut(speed, () => {
            icon.toggleClass('moon-icon');
            icon.toggleClass('sun-icon');

            $(document.body).toggleClass('dark-theme');
            $(document.body).toggleClass('white-theme');

            icon.fadeIn(speed);
        });
    });
}