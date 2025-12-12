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

let currentFileData = null;

//base64 output //

nextBtn.addEventListener('click', () => {
    resultsBox.style.display = 'block';

    const reader = new FileReader();         // Creates t to read the file
    reader.onload = (e) => {                 //  This is runs when the file is reading finish.
        currentFileData = e.target.result;   // This variable  holds the Base64 string
        base64Output.value = currentFileData;
        previewMini.src = currentFileData;
        
      
        const file = fileInput.files[0];
        document.getElementById('res-name').innerText = file.name;
        document.getElementById('res-meta').innerText = `${file.type.toUpperCase()} | ${(file.size / 1024).toFixed(1)} KB`;
    };
    reader.readAsDataURL(fileInput.files[0]);
});


tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});


document.getElementById('download-btn').addEventListener('click', () => {
    const format = document.querySelector('input[name="img-format"]:checked').value;
    const canvas = document.createElement('canvas');
    const img = new Image();
    
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `converted-image.${format.split('/')[1]}`;
        link.href = canvas.toDataURL(format);
        link.click();
    };
    img.src = currentFileData;
});


document.getElementById('decode-input').addEventListener('input', (e) => {
    const decodeImg = document.getElementById('decode-res-img');
    decodeImg.src = e.target.value;
});

//  Copy Button //
document.getElementById('copy-base64').addEventListener('click', () => {
    base64Output.select();
    document.execCommand('copy');
    alert('Base64 code copied to clipboard!');
});

// Back Button //
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
    // Show Loading //
    idleState.style.display = 'none';
    loadingState.style.display = 'block';
    document.getElementById('file-type-tags').style.display = 'none';
    
    // Show buttons //
    controls.style.display = 'flex';

    setTimeout(() => {
        loadingState.style.display = 'none';
        fileList.style.display = 'block';
        
        fileNameText.innerText = file.name;
        fileSizeText.innerText = (file.size / 1024).toFixed(1) + " KB";
        
        // Activate "Next" button
        nextBtn.disabled = false;
        nextBtn.classList.add('active');
    }, 2000);
}

// Function reset everything //
function resetToHome() {
    fileInput.value = ""; 
    fileList.style.display = 'none';
    loadingState.style.display = 'none';
    idleState.style.display = 'block';
    document.getElementById('file-type-tags').style.display = 'flex';
    
    // Hide  buttons  //
    controls.style.display = 'none';
    
    nextBtn.disabled = true;
    nextBtn.classList.remove('active');
}

//  Trash and Cancel  reset  // 
removeFile.addEventListener('click', resetToHome);
cancelBtn.addEventListener('click', resetToHome);