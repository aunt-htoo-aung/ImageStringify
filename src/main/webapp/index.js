const fileInput = document.getElementById("fileInput");
const fileInputContainer = document.querySelector("input-content");
const idleState = document.getElementById("idle-state");
const loadingState = document.getElementById("loading-state");
const fileList = document.getElementById("file-list-container");
// const nextBtn = document.getElementById("next-btn");
// const cancelBtn = document.getElementById("cancel-btn");
const imgUploadContent = document.querySelector(".img-input-content");
// const controls = document.querySelector(".upload-controls");
const fileNameText = document.getElementById("file-name");
const fileSizeText = document.getElementById("file-size");
const removeFile = document.getElementById("remove-file");

const resultsBox = document.getElementById("results-box");
const uploadContainer = document.querySelector(".upload-container");
const previewMini = document.getElementById("preview-mini");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const formatSelect = document.getElementById("format-select");
const convertFormatBtn = document.getElementById("convert-format-btn");
// const conversionOutputSection = document.getElementById(
//   "conversion-output-section"
// );
// const convertedImagePreview = document.getElementById(
//   "converted-image-preview"
// );
const downloadBtn = document.getElementById("download-btn");
const convertProgressWrap = document.getElementById("convert-progress");
const convertProgressBar = document.getElementById("convert-progress-bar");
const convertProgressLabel = document.getElementById("convert-progress-label");
let currentFileData = null;
let currentFileName = null;
let dataUrlInputValue = null; // stores raw dataURL or base64 from textarea
const previewMiniEl = document.getElementById("preview-mini");
const resNameEl = document.getElementById("res-name");
const resMetaEl = document.getElementById("res-meta");
const base64El = document.getElementById("base64-output");

const resultContainer = document.querySelector(".result-container");
convertFormatBtn.addEventListener("click", () => {
  hideOrShowSection(resultContainer, true);
});

downloadBtn.addEventListener("click", () => {
  const selectedFormat = formatSelect.value.split("/")[1].toUpperCase();
});

document.getElementById("copy-base64").addEventListener("click", () => {
  base64El.select();
  document.execCommand("copy");
  alert("Base64 code copied to clipboard!");
});

const submitBtn = document.getElementById("dataurl-submit-btn");
const convertContainer = document.querySelector(".convert-container");
submitBtn.addEventListener("click", () => {
  const ta = document.getElementById("dataUrl");
  if (!ta) return hideOrShowSection(convertContainer, true);
  const v = (ta.value || "").trim();
  if (!v) return alert("Please paste a data URL or base64 string first.");

  // store raw value; prefer full data: URL, but accept plain base64 too
  dataUrlInputValue = v;
  if (v.startsWith("data:")) {
    currentFileData = v;
  } else {
    // assume base64 without prefix; keep raw in dataUrlInputValue and build dataUrl when needed
    currentFileData = `data:image/png;base64,${v}`;
  }

  hideOrShowSection(convertContainer, true);
});
fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    idleState.style.display = "none";
    loadingState.style.display = "block";
    // document.getElementById("file-type-tags").style.display = "none";
    // document.getElementById("upload-limit-text").style.display = "none";
    hideOrShowSection(imgUploadContent, false);
    // controls.style.display = "flex";
    setTimeout(() => {
      loadingState.style.display = "none";
      fileList.style.display = "block";
      fileNameText.innerText = file.name;
      fileSizeText.innerText = (file.size / 1024).toFixed(1) + " KB";
      hideOrShowSection(convertContainer, true);
    }, 2000);
  }
});

// Remove uploaded file and reset upload UI
if (removeFile) {
  removeFile.addEventListener("click", (e) => {
    e.preventDefault();
    // clear file input
    if (fileInput) fileInput.value = "";

    // hide file list, show idle state and file-type tags
    if (fileList) fileList.style.display = "none";
    if (loadingState) loadingState.style.display = "none";
    if (idleState) idleState.style.display = "block";
    const typeTags = document.getElementById("file-type-tags");
    if (typeTags) typeTags.style.display = "flex";

    // reset file name/size display
    if (fileNameText) fileNameText.innerText = "";
    if (fileSizeText) fileSizeText.innerText = "0 KB";

    // hide convert area and show upload UI
    if (convertContainer) hideOrShowSection(convertContainer, false);
    if (uploadContainer) uploadContainer.classList.remove("hidden");
    if (imageUploadSection) imageUploadSection.classList.remove("hidden");
    if (decoderSection) decoderSection.classList.add("hidden");
    if (fileInput) fileInput.focus();
    hideOrShowSection(imgUploadContent, true);
    hideOrShowSection(resultContainer, false);
    // reset internal state
    currentFileData = null;
    currentFileName = null;
    dataUrlInputValue = null;

    // clear any shown results
    if (typeof clearResultDisplay === "function") clearResultDisplay();
  });
}

function startUpload(file) {
  idleState.style.display = "none";
  loadingState.style.display = "block";
  document.getElementById("file-type-tags").style.display = "none";
  // controls.style.display = "flex";
  hideOrShowSection(imgUploadContent, false);

  setTimeout(() => {
    loadingState.style.display = "none";
    fileList.style.display = "block";

    fileNameText.innerText = file.name;
    fileSizeText.innerText = (file.size / 1024).toFixed(1) + " KB";
    hideOrShowSection(convertContainer, true);
  }, 2000);
}

// Drag & drop support for the image upload area
if (imgUploadContent) {
  ["dragenter", "dragover"].forEach((ev) =>
    imgUploadContent.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      imgUploadContent.classList.add("dragover");
    })
  );

  ["dragleave", "drop"].forEach((ev) =>
    imgUploadContent.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      imgUploadContent.classList.remove("dragover");
    })
  );

  imgUploadContent.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    if (!dt || !dt.files || !dt.files.length) return;
    const file = dt.files[0];

    // Try to populate the file input so other logic can read it
    try {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInput) fileInput.files = dataTransfer.files;
    } catch (err) {
      // if DataTransfer isn't available or fails, fall back to calling startUpload directly
    }

    // Reuse existing upload flow
    try {
      startUpload(file);
    } catch (e) {}
  });
}

const toggle = document.querySelector(".toggle");
const toggleButtons = toggle.querySelectorAll(".option");

const imageUploadSection = document.querySelector(".img-upload");
const decoderSection = document.querySelector(".data-url-upload");

//toggle between image upload and decoder sections
toggleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    clearResultAndInput();
    hideOrShowSection(resultContainer, false);
    hideOrShowSection(convertContainer, false);
    // hideOrShowSection(fileInputContainer, true);
    const side = btn.dataset.side;
    if (side === "left") {
      imageUploadSection.classList.remove("hidden");
      decoderSection.classList.add("hidden");
    } else if (side === "right") {
      decoderSection.classList.remove("hidden");
      imageUploadSection.classList.add("hidden");
    }
  });
});

// Toggle visibility for convert and result sections when their headers are clicked
const convertHeader = document.querySelector(".convert-header");
const convertBody = document.querySelector(".convert-body");
const resultHeader = document.querySelector(".result-header");
const resultBody = document.querySelector(".result-body");

function toggleSectionVisibility(header, body) {
  if (!header || !body) return;
  header.style.cursor = "pointer";
  header.addEventListener("click", () => {
    const isHidden =
      body.classList.contains("hidden") || body.style.display === "none";
    if (isHidden) {
      body.classList.remove("hidden");
      body.style.display = "";
    } else {
      body.classList.add("hidden");
      body.style.display = "none";
    }
  });
}
function hideOrShowSection(body, show) {
  if (show) {
    body.classList.remove("hidden");
  } else {
    body.classList.add("hidden");
  }
}
toggleSectionVisibility(convertHeader, convertBody);
toggleSectionVisibility(resultHeader, resultBody);

function toggleLoader(show) {
  document.getElementById("loader").classList.toggle("hidden", !show);
  document.getElementById("convertBtn").disabled = show;
}

async function convertApi(
  { action, file, base64, outputFormat, ...extra },
  onProgress
) {
  // If caller provided an onProgress callback and a file is present, use XHR to emit progress.
  if (typeof onProgress === "function" && file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "api/v1/convert", true);
      xhr.responseType = "json";

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          // try to extract server error message safely without reading responseText
          let msg = `HTTP Error: ${xhr.status}`;
          try {
            const resp = xhr.response;
            let parsed = null;

            if (resp !== undefined && resp !== null) {
              if (typeof resp === "string") {
                try {
                  parsed = JSON.parse(resp);
                } catch (e) {
                  // not JSON string, treat as plain text
                  msg = resp;
                }
              } else if (typeof resp === "object") {
                parsed = resp;
              }
            }

            if (parsed && (parsed.message || parsed.error)) {
              msg = parsed.message || parsed.error;
            }
          } catch (e) {}

          const err = new Error(msg);
          err.status = xhr.status;
          reject(err);
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));

      if (xhr.upload) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
        };
      }

      const fd = new FormData();
      fd.append("action", action);
      fd.append("outputFormat", outputFormat);
      if (action === "imgToOther" && file) fd.append("img", file);
      if (action === "base64ToImg" && base64) fd.append("base64", base64);

      Object.keys(extra || {}).forEach((k) => {
        const v = extra[k];
        if (v === undefined || v === null) return;
        fd.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
      });

      xhr.send(fd);
    });
  }

  // Fallback: use fetch when no progress callback is provided
  const formData = new FormData();
  formData.append("action", action);
  formData.append("outputFormat", outputFormat);

  if (action === "imgToOther" && file) {
    formData.append("img", file);
  }

  if (action === "base64ToImg" && base64) {
    formData.append("base64", base64);
  }

  // Append extra params when using fetch fallback
  Object.keys(extra || {}).forEach((k) => {
    const v = extra[k];
    if (v === undefined || v === null) return;
    formData.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
  });

  const response = await fetch("api/v1/convert", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const txt = await response.text().catch(() => "");
    let msg = `HTTP Error: ${response.status}`;
    try {
      const parsed = txt ? JSON.parse(txt) : null;
      if (parsed && (parsed.message || parsed.error))
        msg = parsed.message || parsed.error;
      else if (txt) msg = txt;
    } catch (e) {
      if (txt) msg = txt;
    }
    const err = new Error(msg);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

convertFormatBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  // show and reset progress UI
  if (convertProgressWrap) convertProgressWrap.style.display = "flex";
  if (convertProgressBar) {
    convertProgressBar.style.width = "0%";
    convertProgressBar.classList.remove("indeterminate");
  }
  if (convertProgressLabel) convertProgressLabel.innerText = "0%";
  convertFormatBtn.disabled = true;

  try {
    // collect UI params
    const outputFormat = formatSelect ? formatSelect.value : "png";
    const optimizationToggle = document.getElementById("optimizationToggle");
    const optimize = optimizationToggle
      ? optimizationToggle.checked
        ? "1"
        : "0"
      : undefined;
    const fileName = file ? file.name : undefined;

    const resp = await convertApi(
      (function () {
        // if user provided a data URL in the textarea and no file selected, send base64 payload
        if (!file && dataUrlInputValue) {
          // extract only base64 portion when possible
          let raw = dataUrlInputValue;
          // console.log("Converting from base64 input:", raw);
          return { action: "base64ToImg", base64: raw, outputFormat };
        }
        return { action: "imgToOther", file, outputFormat, optimize, fileName };
      })(),
      (pct) => {
        const v = Math.min(100, Math.round(pct));
        if (convertProgressBar) convertProgressBar.style.width = v + "%";
        if (convertProgressLabel) convertProgressLabel.innerText = v + "%";
      }
    );
    // console.log("Conversion API response:", resp);
    // server returns `data` (data URL) and `message` for status — prefer `resp.data`
    if (resp && resp.data) {
      currentFileData = resp.data;
    }

    // populate result container fields using server response when available
    function updateResultSection(file, dataUrl, resp, outputFormat) {
      const downloadImgBtn = document.getElementById("download-img-btn");

      // Prefer server `data` field (data URL), then fall back to local
      const raw = resp && resp.data ? resp.data : dataUrl || "";
      const respName = resp && (resp.fileName || resp.filename || resp.name);
      const respMime = resp && (resp.mime || resp.contentType || resp.type);
      const respSize = resp && (resp.size || resp.fileSize);

      // mime and extension
      const extFromFormat = outputFormat
        ? outputFormat.replace(/^image\//, "")
        : null;
      const mime =
        respMime ||
        (extFromFormat ? `image/${extFromFormat}` : file && file.type) ||
        "image/png";
      const displayExt = (
        extFromFormat ||
        (mime && mime.split("/")[1]) ||
        "png"
      ).toUpperCase();

      // build data URL if needed
      let displayDataUrl = "";
      if (!raw) displayDataUrl = "";
      else if (
        typeof raw === "string" &&
        (raw.startsWith("data:") ||
          raw.startsWith("http://") ||
          raw.startsWith("https://"))
      ) {
        displayDataUrl = raw;
      } else {
        displayDataUrl = `data:${mime};base64,${raw}`;
      }

      // filename: prefer server-provided name; otherwise derive a sensible name
      let displayName = respName || (file && file.name) || "converted-image";
      if (file) {
        // when converting an uploaded file, replace its extension with the selected output format
        if (extFromFormat) {
          displayName = `${displayName.replace(
            /\.[^/.]+$/,
            ""
          )}.${extFromFormat}`;
        } else if (!/\.[a-zA-Z0-9]{1,6}$/.test(displayName)) {
          const ext = (mime && mime.split("/")[1]) || "png";
          displayName = `${displayName.replace(/\.[^/.]+$/, "")}.${ext}`;
        }
      } else {
        // no original file (data URL path) — append extension if missing
        if (!/\.[a-zA-Z0-9]{1,6}$/.test(displayName)) {
          const ext = extFromFormat || (mime && mime.split("/")[1]) || "png";
          displayName = `${displayName.replace(/\.[^/.]+$/, "")}.${ext}`;
        }
      }

      const sizeBytes = respSize || (file && file.size) || 0;
      const sizeKB = sizeBytes ? (sizeBytes / 1024).toFixed(1) + " KB" : "-";

      if (previewMiniEl) previewMiniEl.src = displayDataUrl;
      if (resNameEl) resNameEl.innerText = displayName;
      if (base64El) base64El.value = displayDataUrl;
      if (resMetaEl) resMetaEl.innerText = `${displayExt} | ${sizeKB}`;

      if (displayDataUrl) {
        const img = new Image();
        img.onload = () => {
          const w = img.width;
          const h = img.height;
          if (resMetaEl)
            resMetaEl.innerText = `${displayExt} | ${sizeKB} | ${w}x${h}`;
        };
        img.src = displayDataUrl;
      }

      if (downloadImgBtn && displayDataUrl) {
        downloadImgBtn.onclick = () => {
          const a = document.createElement("a");
          a.href = displayDataUrl;
          a.download = displayName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        };
      }
    }

    updateResultSection(file, currentFileData, resp, outputFormat);
    hideOrShowSection(resultContainer, true);

    // simulateConversionSuccess();
    hideOrShowSection(resultContainer, true);
  } catch (err) {
    alert(err.message || "Conversion failed");
  } finally {
    convertFormatBtn.disabled = false;
    setTimeout(() => {
      if (convertProgressWrap) convertProgressWrap.style.display = "none";
    }, 500);
  }
});

function clearResultAndInput() {
  fileInput.value = "";
  document.getElementById("dataUrl").value = "";
  resNameEl.innerText = "";
  resMetaEl.innerText = "";
  base64El.value = "";
  previewMiniEl.src = "";
  // console.log("Cleared input and result data.");
}
