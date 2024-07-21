const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const resultDiv = document.getElementById('result');
const classInfo = document.getElementById('class-info');
const confidenceInfo = document.getElementById('confidence-info');
const actionInfo = document.getElementById('action-info');

const actions = {
    healthy: ["No action needed. Keep monitoring the chickens regularly."],
    coccidiosis: [
        "Administer anticoccidial medication immediately.",
        "Clean and disinfect the coop thoroughly."
    ],
    salmonella: [
        "Isolate the infected chickens.",
        "Contact a veterinarian for appropriate antibiotics.",
        "Ensure thorough hygiene to prevent the spread."
    ]
};

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = event.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
        displayImage(files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
        displayImage(fileInput.files[0]);
    }
});

function displayImage(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        dropZone.innerHTML = `<img src="${event.target.result}" alt="Uploaded Image">`;
    };
    reader.readAsDataURL(file);
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const actionList = actions[result.class.toLowerCase()] || ["No specific action recommended."];

        classInfo.textContent = `Class: ${result.class}`;
        confidenceInfo.textContent = `Confidence: ${(result.confidence * 100).toFixed(2)}%`; // Display confidence as percentage
        actionInfo.innerHTML = actionList.map(action => `<li>${action}</li>`).join('');

        resultDiv.classList.add('show'); // Show the result section
        resultDiv.style.opacity = 1; // Set opacity to 1
        resultDiv.scrollIntoView({ behavior: 'smooth' }); // Scroll to the result section
    } catch (error) {
        console.error('Error:', error);
    }
});

function sendMail(){
    let userName = document.getElementById('name').value
    let email = document.getElementById('email').value
    let subject= document.getElementById('subject').value
    let message=document.getElementById('message').value
    let params ={
        user_name:userName,
        user_email:email,
        user_subject:subject,
        user_message:message
    }
    emailjs.send("service_9da7tni","template_csammlm",params).then(alert('message sent'))




 }