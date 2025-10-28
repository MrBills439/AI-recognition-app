// Default API endpoint from the user's original code
const DEFAULT_API_ENDPOINT = 'Your API link/analyze';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const imageUpload = document.getElementById('imageUpload');
    const uploadLabel = document.getElementById('uploadLabel');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('preview');
    const resultsContainer = document.getElementById('results');
    const loader = document.getElementById('loader');
    const resultContent = document.getElementById('resultContent');
    const descriptionEl = document.getElementById('description');
    const labelsEl = document.getElementById('labels');
    const appBody = document.querySelector('body');

    // Settings Modal Elements
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsModal = document.getElementById('settingsModal');
    const closeModalBtn = settingsModal.querySelector('.close-btn');
    const apiEndpointInput = document.getElementById('apiEndpoint');
    const themeToggle = document.getElementById('themeToggle');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    // --- State Variables ---
    let base64Image = null;
    let currentApiEndpoint = localStorage.getItem('apiEndpoint') || DEFAULT_API_ENDPOINT;
    let currentTheme = localStorage.getItem('theme') || 'dark';

    // --- Initialization Functions ---

    function initializeSettings() {
        // 1. Initialize Theme
        appBody.classList.remove('dark-mode', 'light-mode');
        appBody.classList.add(currentTheme + '-mode');
        themeToggle.checked = (currentTheme === 'light');

        // 2. Initialize API Endpoint in Modal
        apiEndpointInput.value = currentApiEndpoint;
    }

    // --- Settings Modal Logic ---

    settingsToggle.addEventListener('click', () => {
        settingsModal.classList.add('visible');
        // Ensure the input reflects the current active endpoint
        apiEndpointInput.value = currentApiEndpoint;
    });

    closeModalBtn.addEventListener('click', () => {
        settingsModal.classList.remove('visible');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('visible');
        }
    });

    saveSettingsBtn.addEventListener('click', () => {
        // Save API Endpoint
        const newEndpoint = apiEndpointInput.value.trim();
        if (newEndpoint) {
            currentApiEndpoint = newEndpoint;
            localStorage.setItem('apiEndpoint', newEndpoint);
            alert('Settings saved successfully!');
        } else {
            alert('Please enter a valid API Endpoint URL.');
            return;
        }
        settingsModal.classList.remove('visible');
    });

    // --- Theme Toggle Logic ---

    themeToggle.addEventListener('change', (e) => {
        currentTheme = e.target.checked ? 'light' : 'dark';
        appBody.classList.remove('dark-mode', 'light-mode');
        appBody.classList.add(currentTheme + '-mode');
        localStorage.setItem('theme', currentTheme);
    });

    // --- File Upload Logic (Enhanced) ---

    // Handle file selection via input
    imageUpload.addEventListener('change', handleFileSelect);

    // Handle Drag and Drop
    uploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadLabel.classList.add('drag-over');
    });

    uploadLabel.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadLabel.classList.remove('drag-over');
    });

    uploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadLabel.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            imageUpload.files = files; // Assign files to the input element
            handleFileSelect({ target: imageUpload });
        }
    });

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
                alert('Invalid file type. Please select a PNG or JPEG image.');
                imageUpload.value = '';
                return;
            }

            // Display image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                previewContainer.classList.remove('hidden');
                uploadLabel.querySelector('.label-text').textContent = file.name;
                analyzeBtn.disabled = false;
            };
            reader.readAsDataURL(file);

            // Convert image to base64 for sending to API
            const readerForBase64 = new FileReader();
            readerForBase64.onload = (e) => {
                // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
                base64Image = e.target.result.split(',')[1];
            };
            readerForBase64.readAsDataURL(file);
        } else {
            // Reset state if no file is selected
            previewContainer.classList.add('hidden');
            uploadLabel.querySelector('.label-text').textContent = 'Click or drag an image here (PNG or JPEG)';
            analyzeBtn.disabled = true;
            base64Image = null;
        }
    }

    // --- Analysis Logic ---

    analyzeBtn.addEventListener('click', async () => {
        if (!base64Image) {
            alert('Please select an image first.');
            return;
        }

        if (!currentApiEndpoint || currentApiEndpoint.includes('YOUR_API_GATEWAY_INVOKE_URL')) {
            alert('API Endpoint is not configured. Please open Settings (gear icon) and enter your AWS API Gateway URL.');
            return;
        }

        // Show loader and results section
        resultsContainer.classList.remove('hidden');
        loader.style.display = 'block';
        resultContent.classList.add('hidden'); // Hide content while loading
        descriptionEl.textContent = '';
        labelsEl.innerHTML = '';
        analyzeBtn.disabled = true; // Disable button during analysis

        try {
            const response = await fetch(currentApiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image }),
            });

            if (!response.ok) {
                // Attempt to parse error message from response body
                let errorMessage = `HTTP error! Status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            // Display results
            descriptionEl.textContent = data.description || "No detailed description was generated by Amazon Bedrock.";
            
            labelsEl.innerHTML = ''; // Clear previous labels
            if (data.labels && data.labels.length > 0) {
                data.labels.forEach(label => {
                    const labelTag = document.createElement('div');
                    labelTag.className = 'label-tag';
                    labelTag.textContent = label;
                    labelsEl.appendChild(labelTag);
                });
            } else {
                 labelsEl.textContent = "No labels were detected by AWS Rekognition.";
            }

        } catch (error) {
            console.error('Analysis Error:', error);
            descriptionEl.textContent = `An error occurred during analysis: ${error.message}`;
            labelsEl.innerHTML = '';
        } finally {
            // Hide loader and show content
            loader.style.display = 'none';
            resultContent.classList.remove('hidden');
            analyzeBtn.disabled = false; // Re-enable button
        }
    });

    // Run initialization
    initializeSettings();
});
