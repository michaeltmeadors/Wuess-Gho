const images = document.querySelectorAll('.choice__image');
const nameInputs = document.querySelectorAll('.choice__info input:nth-of-type(1)');
const imageUrlInputs = document.querySelectorAll('.choice__info input:nth-of-type(2)');
const templateDropdownItems = document.querySelectorAll('#template-dropdown-content .navbar__dropdown-item');

// Set event listeners to change images from user input
for (let i = 0; i < imageUrlInputs.length && i < images.length; i++) {
    imageUrlInputs[i].addEventListener('blur', (e) => {
        if (e.target.value === '') {
            images[i].setAttribute('src', "img/placeholder-img.png"); // If empty replace with the placeholder image
        } else {
            images[i].setAttribute('src', e.target.value);
        }
    });
}

// Set event listeners to apply choice templates
for (let i = 0; i < templateDropdownItems.length; i++) {
    templateDropdownItems[i].addEventListener('click', (e) => {
        // AJAX call to get the json data
        $.getJSON("templates.json", function (result) {
            if (result.templates.length > i) {
                const choices = result.templates[i].choices;
                // Set the choices with the json data
                for (let j = 0; j < choices.length && j < nameInputs.length && j < imageUrlInputs.length && j < images.length; j++) {
                    nameInputs[j].value = choices[j].name; // name
                    imageUrlInputs[j].value = choices[j].imageUrl; // image input
                    images[j].setAttribute('src', choices[j].imageUrl); // image src
                }
            }
        });
    });
}
