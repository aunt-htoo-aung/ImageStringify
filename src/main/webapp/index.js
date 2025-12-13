const fileInput = document.getElementById('fileInput');
const idleState = document.getElementById('idle-state');
const loadingState = document.getElementById('loading-state');
const fileList = document.getElementById('file-list-container');
const nextBtn = document.getElementById('next-btn');
const cancelBtn = document.getElementById('cancel-btn');
const controls = document.querySelector('.upload-controls'); 
const fileNameText = document.getElementById('file-name');
const fileSizeText = document.getElementById('file-size');
const removeFile = document.getElementById('remove-file');

const resultsBox = document.getElementById('results-box');
const uploadContainer = document.querySelector('.upload-container');
const base64Output = document.getElementById('base64-output');
const previewMini = document.getElementById('preview-mini');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

const formatSelect = document.getElementById('format-select');
const convertFormatBtn = document.getElementById('convert-format-btn');
const conversionOutputSection = document.getElementById('conversion-output-section');
const convertedImagePreview = document.getElementById('converted-image-preview');
const downloadBtn = document.getElementById('download-btn'); 

let currentFileData = null;
let currentFileName = null; 



function simulateConversionSuccess() {
    const format = formatSelect.value;
    const extension = format.split('/')[1].toUpperCase();

    convertedImagePreview.src = currentFileData;
    convertedImagePreview.style.display = 'block';
    
    conversionOutputSection.style.display = 'block';

    const statusElement = conversionOutputSection.querySelector('.conversion-status');
    statusElement.textContent = `Ready to download as ${extension} (Converted successfully)`;
}





nextBtn.addEventListener('click', () => {
    resultsBox.style.display = 'block';

    const file = fileInput.files[0];
    const reader = new FileReader(); 

    reader.onload = (e) => {
        currentFileData = e.target.result; 
        currentFileName = file.name;
        
        base64Output.value = currentFileData;
        previewMini.src = currentFileData;
        
        document.getElementById('res-name').innerText = currentFileName;
        document.getElementById('res-meta').innerText = `${file.type.toUpperCase()} | ${(file.size / 1024).toFixed(1)} KB`;
    };
    reader.readAsDataURL(file);
});





tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        
        if (btn.dataset.tab !== 'format-tab') {
             conversionOutputSection.style.display = 'none';
        }
    });
});





convertFormatBtn.addEventListener('click', () => {
    if (currentFileData) {
        simulateConversionSuccess();
    } else {
        alert("Please upload an image first.");
    }
});





downloadBtn.addEventListener('click', () => {
    const selectedFormat = formatSelect.value.split('/')[1].toUpperCase();
});




document.getElementById('decode-input').addEventListener('input', (e) => {
    const decodeImg = document.getElementById('decode-res-img');
    decodeImg.src = e.target.value;
});




document.getElementById('copy-base64').addEventListener('click', () => {
    base64Output.select();
    document.execCommand('copy');
    alert('Base64 code copied to clipboard!');
});




document.getElementById('back-to-upload').addEventListener('click', () => {
    resultsBox.style.display = 'none';
    uploadContainer.style.display = 'block';
    resetToHome(); 
});




fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        startUpload(file);
    }
});

function startUpload(file) {
    idleState.style.display = 'none';
    loadingState.style.display = 'block';
    document.getElementById('file-type-tags').style.display = 'none';
    controls.style.display = 'flex';

    setTimeout(() => {
             loadingState.style.display = 'none';
              fileList.style.display = 'block';
                
                 fileNameText.innerText = file.name;
               fileSizeText.innerText = (file.size / 1024).toFixed(1) + " KB";
                
                nextBtn.disabled = false;
                nextBtn.classList.add('active');
            }, 2000);
}

function resetToHome() {
    fileInput.value = ""; 
    fileList.style.display = 'none';
    loadingState.style.display = 'none';
      idleState.style.display = 'block';
    document.getElementById('file-type-tags').style.display = 'flex';
    
    controls.style.display = 'none';
    
    nextBtn.disabled = true;
    nextBtn.classList.remove('active');
    
    conversionOutputSection.style.display = 'none';
        resultsBox.style.display = 'none';
       currentFileData = null;
       currentFileName = null;

    convertedImagePreview.src = "";
    convertedImagePreview.style.display = 'none';
}

removeFile.addEventListener('click', resetToHome);
cancelBtn.addEventListener('click', resetToHome);