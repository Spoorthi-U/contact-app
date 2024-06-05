document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.querySelector("#phone");
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "IN", 
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
    });

    setupNameValidation();
    setupAddContactButton();
});


let isEditing = false;

function setupNameValidation() {
    document.getElementById('name').addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 64);
    });
}

function setupAddContactButton() {
    document.getElementById('addContact').addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const phoneInput = document.getElementById('phone');
        const iti = window.intlTelInputGlobals.getInstance(phoneInput);
        const phone = iti.getNumber();
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        const email = document.getElementById('email').value;

        if (validateInputs(name, phone, email)) {
            addContact(name, phone, gender, email);
            clearForm();
        }
    });
}

function validateInputs(name, phone, email, isEditing = false) {
    const namePattern = /^[A-Za-z\s]{1,64}$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!namePattern.test(name)) {
        alert('Please enter a valid name (only alphabets and spaces, max 64 characters).');
        return false;
    }

    if (!phone.trim()) {
        alert('Please enter a phone number.');
        return false;
    }

    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    return true;
}

function addContact(name, phone, gender, email) {
    const contactTable = document.getElementById('contactTable');
    const row = contactTable.insertRow();

    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = phone;
    row.insertCell(2).innerHTML = gender;
    row.insertCell(3).innerHTML = email;
    const actions = row.insertCell(4);
    actions.innerHTML = `<button class="btn btn-warning btn-sm edit-btn">Edit</button>
                         <button class="btn btn-danger btn-sm delete-btn">Delete</button>`;

    addEditFunctionality(row);
    addDeleteFunctionality(row);
}

function addEditFunctionality(row) {
    const editButton = row.querySelector('.edit-btn');
    editButton.addEventListener('click', function editHandler() {
        const cells = row.getElementsByTagName('td');
        cells[0].setAttribute('contenteditable', 'true');
        cells[1].setAttribute('contenteditable', 'true');
        cells[2].setAttribute('contenteditable', 'true');
        cells[3].setAttribute('contenteditable', 'true');

        this.innerHTML = 'Save';
        this.classList.replace('btn-warning', 'btn-success');
        this.removeEventListener('click', editHandler);
        this.addEventListener('click', function saveHandler() {
            const name = cells[0].innerText;
            const phone = cells[1].innerText;
            const gender = cells[2].innerText;
            const email = cells[3].innerText;

            if (validateInputs(name, phone, email, true)) {
                cells[0].setAttribute('contenteditable', 'false');
                cells[1].setAttribute('contenteditable', 'false');
                cells[2].setAttribute('contenteditable', 'false');
                cells[3].setAttribute('contenteditable', 'false');

                this.innerHTML = 'Edit';
                this.classList.replace('btn-success', 'btn-warning');
                this.removeEventListener('click', saveHandler);
                this.addEventListener('click', editHandler);
            } else {
                alert('Invalid input. Please correct the errors and save again.');
            }
        });
    });
}

function addDeleteFunctionality(row) {
    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this contact?')) {
            row.remove();
        }
    });
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById('email').value = '';
}
