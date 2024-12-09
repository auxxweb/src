// Enhanced Contact Saving with Extended Details
function saveContactToDevice(contactDetails) {
    // Expanded contact object with more fields
    const fullContactDetails = {
        name: contactDetails.name,
        givenName: contactDetails.givenName || '',
        familyName: contactDetails.familyName || '',
        phone: {
            mobile: contactDetails.phone || '',
            work: contactDetails.workPhone || '',
            home: contactDetails.homePhone || ''
        },
        email: {
            personal: contactDetails.email || '',
            work: contactDetails.workEmail || ''
        },
        address: {
            street: contactDetails.street || '',
            city: contactDetails.city || '',
            state: contactDetails.state || '',
            postalCode: contactDetails.postalCode || '',
            country: contactDetails.country || ''
        },
        organization: {
            name: contactDetails.businessName || '',
            title: contactDetails.jobTitle || '',
            department: contactDetails.department || ''
        },
        website: contactDetails.website || '',
        notes: contactDetails.notes || ''
    };

    // Web Contacts API with extended fields
    async function saveViaWebContactsAPI(contact) {
        try {
            const contactProperties = [
                'name',
                'tel',
                'email',
                'address',
                'organization'
            ];

            const newContact = await navigator.contacts.select(contactProperties, { multiple: false });

            if (newContact) {
                navigator.contacts.save({
                    name: [contact.name],
                    tel: [
                        { value: contact.phone.mobile, type: 'mobile' },
                        { value: contact.phone.work, type: 'work' },
                        { value: contact.phone.home, type: 'home' }
                    ],
                    email: [
                        { value: contact.email.personal, type: 'personal' },
                        { value: contact.email.work, type: 'work' }
                    ],
                    address: [{
                        streetAddress: contact.address.street,
                        locality: contact.address.city,
                        region: contact.address.state,
                        postalCode: contact.address.postalCode,
                        country: contact.address.country
                    }],
                    organization: {
                        name: contact.organization.name,
                        title: contact.organization.title,
                        department: contact.organization.department
                    }
                });
                alert('Contact saved successfully!');
            }
        } catch (error) {
            console.error('Web Contacts API Error:', error);
            alert("error")
            saveViaFallbackMethods(contact);
        }
    }

    // Enhanced vCard Generation for Android
    function createVCard(contact) {
        return `BEGIN:VCARD
VERSION:3.0
N:${contact.familyName || ''};${contact.givenName || ''};;
FN:${contact.name}
ORG:${contact.organization.name}
TITLE:${contact.organization.title}
TEL;TYPE=WORK,VOICE:${contact.phone.work}
TEL;TYPE=CELL,VOICE:${contact.phone.mobile}
TEL;TYPE=HOME,VOICE:${contact.phone.home}
ADR;TYPE=WORK:;;${contact.address.street};${contact.address.city};${contact.address.state};${contact.address.postalCode};${contact.address.country}
EMAIL;TYPE=PREF,INTERNET:${contact.email.personal}
EMAIL;TYPE=WORK,INTERNET:${contact.email.work}
URL:${contact.website}
NOTE:${contact.notes}
END:VCARD`;
    }

    // Fallback iOS Method with More Details
    function saveContactForIOS(contact) {
        // Create a more comprehensive approach for iOS
        const anchorTag = document.createElement('a');
        anchorTag.href = `tel:${contact.phone.mobile}`;

        const tempInput = document.createElement('input');
        tempInput.type = 'hidden';
        tempInput.value = JSON.stringify({
            fullName: contact.name,
            businessName: contact.organization.name,
            jobTitle: contact.organization.title,
            phoneNumbers: [
                contact.phone.mobile,
                contact.phone.work,
                contact.phone.home
            ],
            emails: [
                contact.email.personal,
                contact.email.work
            ],
            address: `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.postalCode}`
        });

        document.body.appendChild(anchorTag);
        document.body.appendChild(tempInput);

        try {
            alert('Please save the contact in the iOS prompt');
            anchorTag.click();
        } catch (error) {
            alert("error")
            fallbackManualCopy(contact);

        }
    }

    // Detect mobile device
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Main saving logic
    if ('contacts' in navigator && 'ContactsManager' in window) {
        alert("contacts")
        saveViaWebContactsAPI(fullContactDetails);
    }
    else if (isMobileDevice()) {
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            alert("iphone")
            saveContactForIOS(fullContactDetails);

        }
        else if (/Android/i.test(navigator.userAgent)) {
            alert("ok")
            const vCardContent = createVCard(fullContactDetails);
            const blob = new Blob([vCardContent], { type: 'text/vcard' });

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${fullContactDetails.name}.vcf`;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            alert('Download the .vcf file and save to contacts');
        }
    }
    else {
        alert('Contact saving not supported on this device.');
    }
}

// Example Usage with Extended Form
document.getElementById('saveContactBtn').addEventListener('click', (e) => {
    e.preventDefault();

    const contactDetails = {
        // Personal Details
        name: document.getElementById('fullName').value,
        givenName: document.getElementById('firstName').value,
        familyName: document.getElementById('lastName').value,

        // Phone Numbers
        phone: document.getElementById('mobilePhone').value,
        workPhone: document.getElementById('workPhone').value,
        homePhone: document.getElementById('homePhone').value,

        // Emails
        email: document.getElementById('personalEmail').value,
        workEmail: document.getElementById('workEmail').value,

        // Address
        street: document.getElementById('streetAddress').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        postalCode: document.getElementById('postalCode').value,
        country: document.getElementById('country').value,

        // Business Details
        businessName: document.getElementById('businessName').value,
        jobTitle: document.getElementById('jobTitle').value,
        department: document.getElementById('department').value,

        // Additional Info
        website: document.getElementById('website').value,
        notes: document.getElementById('notes').value
    };

    alert("initial")

    saveContactToDevice(contactDetails);
});