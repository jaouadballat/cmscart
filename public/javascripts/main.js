
function openfile(file) {
    const input = file.target;

    const reader = new FileReader();
    reader.onload = function () {
        const dataURL = reader.result;
        const output = document.getElementById('output');
        output.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

