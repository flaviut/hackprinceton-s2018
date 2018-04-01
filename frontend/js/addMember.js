(function () {

    document.getElementById('submit-button').onclick = function () {
        const warningArea = document.getElementById('warn-invalid');
        console.log('got button click');

        const file = document.getElementById('image-upload').files[0];
        const name = document.getElementById('name-input').value;
        if (file && name) {
            warningArea.innerHTML = '';
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (() =>
                Lib.azure.addPerson(name, reader.result)
                    .done(() => document.location = "/index.html"))
        } else {
            warningArea.innerHTML = 'Invalid name or image';
        }
    };
})();