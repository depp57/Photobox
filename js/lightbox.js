let lightboxContainer = $('#lightbox_container');

export function displayLightbox(url) {
    generateDOM(url);

    lightboxContainer.fadeIn().css("display","flex");
    $(document.body).css('overflow-y', 'hidden');

    $('#lightbox_close').click(function () {
        lightboxContainer.fadeOut().css("display","flex");
        $(document.body).css('overflow-y', 'auto');
        lightboxContainer.empty();
    });

    $('#lightbox_prev').click(function () {
        loadPreOrNextImg(false);
    });

    $('#lightbox_next').click(function () {
        loadPreOrNextImg(true);
    });
}

function loadPreOrNextImg(next=true) {
    console.log(next)
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