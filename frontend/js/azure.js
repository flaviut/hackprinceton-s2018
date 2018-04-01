window.Lib = window.Lib || {};
(function () {
    Lib.azure = {};

    let FACE_URL = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/';

    function setHeaders(isJson) {
        return (xhrObj) => {
            if (isJson) {
                xhrObj.setRequestHeader('Content-Type', 'application/json');
            }
            xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', '22c83acf03654264809ff64693f7dd99');
        }
    }

    /** returns Promise -> List */
    Lib.azure.getPeople = function () {
        return $.ajax({
            url: FACE_URL + 'persongroups/lockpeople/persons',
            beforeSend: setHeaders(),
            type: 'GET',
        });
    };

    /** name: string, image: string (data uri) */
    Lib.azure.addPerson = function (name, image) {
        const resize = new Lib.Resize();
        resize.init();

        const result = new $.Deferred();
        resize.resize(image, 240, 'dataURL', (resizedImage) => {
            $.ajax({
                url: FACE_URL + 'persongroups/lockpeople/persons?',
                data: JSON.stringify({
                    name: name,
                    userData: resizedImage,
                }),
                beforeSend: setHeaders(true),
                type: 'POST',
            }).then((data) => {
                return fetch(image).then((res) => res.blob()).then((blob) => {
                    return $.ajax({
                        url: `${FACE_URL}persongroups/lockpeople/persons/${data.personId}/persistedFaces`,
                        beforeSend: (xhrObj) => {
                            setHeaders()(xhrObj);
                            xhrObj.setRequestHeader('Content-Type', 'application/octet-stream');
                        },
                        type: 'POST',
                        data: blob,
                        processData: false,
                    })
                        .done(function (data) {
                            return data.personId;
                        });
                });
            }).then(() => {
                return $.ajax({
                    url: FACE_URL + '/persongroups/lockpeople/train',
                    beforeSend: setHeaders(),
                    type: 'POST',
                });
            }).done(() => {
                result.resolveWith(this, arguments);
            }).fail(() => {
                result.rejectWith(this, arguments);
            });
        });

        return result;
    };

    /** */
    Lib.azure.getPeople = function () {
        return $.ajax({
            url: `${FACE_URL}/persongroups/lockpeople/persons`,
            beforeSend: setHeaders(),
            type: 'GET',
        })
            .then(function (data) {
                return data.map((v) => ({
                    name: v.name,
                    img: v.userData,
                    id: v.personId,
                }));
            });
    };

})();
