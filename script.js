// Cross-platform mobile contact saving function
function saveContactToDevice(contactDetails) {
    // Check if the browser supports Web Contact API
    if ('contacts' in navigator && 'ContactsManager' in window) {
        saveViaWebContactsAPI(contactDetails);
    }
    // Fallback for iOS and Android
    else if (isMobileDevice()) {
        saveViaFallbackMethods(contactDetails);
    }
    else {
        alert('Contact saving not supported on this device.');
    }
}

// Detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Web Contacts API (Most modern approach)
async function saveViaWebContactsAPI(contact) {
    try {
        const contactProperties = [
            'name',
            'tel',
            'email'
        ];

        const newContact = await navigator.contacts.select(contactProperties, { multiple: false });

        if (newContact) {
            navigator.contacts.save({
                name: contact.name,
                tel: contact.phone,
                email: contact.email
            });
            alert('Contact saved successfully!');
        }
    } catch (error) {
        console.error('Web Contacts API Error:', error);
        saveViaFallbackMethods(contact);
    }
}

// Fallback methods for mobile browsers
function saveViaFallbackMethods(contact) {
    // iOS Safari method
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        saveContactForIOS(contact);
    }
    // Android Chrome method
    else if (/Android/i.test(navigator.userAgent)) {
        saveContactForAndroid(contact);
    }
    else {
        fallbackManualCopy(contact);
    }
}

// iOS Contact Saving (Pseudo-direct method)
function saveContactForIOS(contact) {
    // Create a temporary anchor to trigger iOS contact creation
    const anchorTag = document.createElement('a');
    anchorTag.href = `tel:${contact.phone}`;

    // Attempt to create contact via tel link
    const tempInput = document.createElement('input');
    tempInput.type = 'hidden';
    tempInput.value = JSON.stringify({
        name: contact.name,
        phone: contact.phone,
        email: contact.email
    });

    document.body.appendChild(anchorTag);
    document.body.appendChild(tempInput);

    try {
        // Trigger iOS contact prompt
        anchorTag.click();
        alert('Please save the contact in the iOS prompt');
    } catch (error) {
        fallbackManualCopy(contact);
    }
}

const contact = {
    firstName: "Derik",
    lastName: "Stenerson",
    fullName: "Derik Stenerson",
    organization: "Microsoft Corporation",
    title: "Software Engineer",
    birthday: "1963-09-21", // Correct date format YYYY-MM-DD
    address: {
        street: "One Microsoft Way",
        city: "Redmond",
        state: "WA",
        zip: "98052-6399",
        country: "USA"
    },
    workPhone: "+1-425-936-5522",
    workFax: "+1-425-936-7329",
    mobilePhone: "+1-425-936-0000",
    email: "deriks@Microsoft.com"
}

// Android Contact Saving
function saveContactForAndroid(contactData) {
    // Create a structured contact string
    const contactString = `BEGIN:VCARD
    VERSION:3.0
    N:${contact.lastName}${contact.firstName}
    FN:${contact.fullName}
    ORG:${contact.organization}
    TITLE:${contact.title}
    BDAY:${contact.birthday}
    ADR;TYPE=WORK:;;${contact.address.street};${contact.address.city};${contact.address.state};${contact.address.zip};${contact.address.country}\r\n\
    TEL;TYPE=WORK,MSG:${contact.workPhone}
    TEL;TYPE=WORK,FAX:${contact.workFax}
    TEL;TYPE=CELL:${contact.mobilePhone}
    EMAIL;TYPE=INTERNET:${contact.email}
    END:VCARD`

    // Create a Blob with vCard data
    const blob = new Blob([contactString], { type: 'text/vcard' });

    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${contact.name}.vcf`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    alert('Download the .vcf file and save to contacts');
}

// Absolute last resort manual copy method
function fallbackManualCopy(contact) {
    const contactDetails = `Name: ${contact.name}\nPhone: ${contact.phone}\nEmail: ${contact.email}`;

    navigator.clipboard.writeText(contactDetails)
        .then(() => {
            alert('Contact details copied. Please manually save in your contacts app.');
        })
        .catch(err => {
            prompt('Unable to copy. Please manually copy these details:', contactDetails);
        });
}

// Example usage
document.getElementById('saveContactBtn').addEventListener('click', (e) => {
    e.preventDefault();

    const contactDetails = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };

    saveContactToDevice(contactDetails);
});