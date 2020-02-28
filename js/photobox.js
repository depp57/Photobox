import {init as initLoader} from "./photoloader";
import {init as initGallery, loadData, loadPreOrNextGallery} from "./gallery";
import {displayLightbox} from "./lightbox";

$(document).ready(function () {
    initLoader('https://webetu.iutnc.univ-lorraine.fr');
    initGallery();
    initHandlers();
});

function initHandlers() {
    let bLoad =  $('#load_gallery');
    bLoad.click(() => loadData('/www/canals5/photobox/photos/?size=12'));

    $('#gallery').on('click', 'img', (e) => displayLightbox(e.target.src));
    $('#previous').click(() => loadPreOrNextGallery(false));
    $('#next').click(() => loadPreOrNextGallery(true));
}