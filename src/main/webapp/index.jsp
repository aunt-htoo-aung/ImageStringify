<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
    <!-- <link rel="stylesheet" href="index.css" /> -->
    <link
      rel="stylesheet"
      href="${pageContext.request.contextPath}/index.css"
    />

    <title>ImageStringify</title>
  </head>

  <body>
    <header class="Container">
      <div class="nav">
        <div class="logo">
          <i class=""></i>
          <span class="nav-span">ImageStringify</span>
        </div>

        <nav>
          <ul class="nav-links">
            <li>
              <a href="index.html"><i class="fa-solid fa-house"></i> Home</a>
            </li>
            <li>
              <a><i class="fa-solid fa-book-open"></i> Tutorial</a>
            </li>
            <li>
              <a><i class="fa-solid fa-briefcase"></i> Service</a>
            </li>
            <li>
              <a><i class="fa-solid fa-circle-question"></i> FAQ</a>
            </li>
            <li>
              <a><i class="fa-solid fa-envelope"></i> Contact</a>
            </li>
          </ul>
        </nav>

        <div class="nav-right">
          <i class="theme-icon fa-solid fa-moon"></i>
        </div>
      </div>
    </header>

    <section class="hero-container">
      <div class="hero-content">
        <h2>Convert your images to base 64</h2>
        <p>
          Transform your images into base64-encoded strings instantly.<br />
          Perfect for HTML, CSS, and email templates.
        </p>
      </div>

      <div class="content-container">
        <div class="image">
          <img src="image/Bro.png" alt="Image to Base64" />
        </div>

        <div class="upload-container">
          <div class="upload-header">
            <h2>Upload</h2>
            <div class="toggle">
              <button class="option active" data-side="left">Image</button>

              <button class="option" data-side="right">Data Url</button>
            </div>
          </div>
          <div class="upload-body">
            <div class="img-upload">
              <div class="img-input-content">
                <label for="fileInput">
                  <input type="file" id="fileInput" accept="image/*" />

                  <div id="idle-state" class="upload-box">
                    <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
                    <h3>Drag & Drop your images here</h3>
                    <p>or click browse your files</p>
                  </div>
                  <div class="file-type" id="file-type-tags">
                    <span>JPG</span><span>PNG</span><span>SVG</span
                    ><span>GIF</span>
                  </div>
                  <small id="upload-limit-text">Maximum size: 30MB</small>
                </label>
              </div>

              <div id="loading-state" class="upload-box" style="display: none">
                <i class="fa-solid fa-circle-notch fa-spin upload-icon"></i>
                <h3>Uploading file...</h3>
              </div>

              <div id="file-list-container" style="display: none">
                <div class="file-item">
                  <div class="file-info">
                    <i class="fa-solid fa-file-zipper zip-icon"></i>
                    <div>
                      <strong id="file-name">File Name.jpg</strong>
                      <p id="file-size">0 KB</p>
                    </div>
                  </div>
                  <i
                    class="fa-solid fa-trash-can delete-icon"
                    id="remove-file"
                  ></i>
                </div>
              </div>

              <!-- <div class="upload-controls">
                  <button class="btn btn-cancel" id="cancel-btn">Cancel</button>
                  <button class="btn btn-next" id="next-btn" disabled>
                    Next
                  </button>
                </div> -->
            </div>
            <div class="data-url-upload input-content hidden">
              <textarea
                id="dataUrl"
                placeholder="data:image/png;base64,..."
              ></textarea>
              <div class="submit-btn">
                <button class="btn" id="dataurl-submit-btn">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="convert-container hidden">
      <div class="convert-header">
        <h3>Convert</h3>
      </div>
      <div class="convert-body">
        <div class="converter-box">
          <h4><i class="fa-solid fa-shuffle"></i> Convert Image Format</h4>

          <div class="conversion-controls-wrapper">
            <label for="format-select">Choose Output Format:</label>
            <select id="format-select" class="format-select">
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="gif">GIF</option>
              <option value="webp">WEBP</option>
            </select>

            <button
              class="btn btn-next active convert-btn"
              id="convert-format-btn"
            >
              <i class="fa-solid fa-redo"></i> Convert
            </button>
          </div>

          <div
            class="progress-wrapper"
            id="convert-progress"
            style="display: none"
          >
            <div class="progress">
              <div
                class="progress-bar"
                id="convert-progress-bar"
                style="width: 0%"
              ></div>
            </div>
            <div class="progress-label" id="convert-progress-label">0%</div>
          </div>
        </div>

        <div
          id="conversion-output-section"
          class="conversion-output-section"
          style="display: none"
        >
          <div class="output-header">
            <p class="conversion-status">Conversion Complete!</p>
          </div>

          <div class="output-preview-box">
            <p>Converted Image Preview:</p>
            <div class="output-preview-image">
              <img
                id="converted-image-preview"
                src=""
                alt="Converted Output"
                class="preview-img"
              />
            </div>
          </div>

          <button class="btn btn-next active download-btn" id="download-btn">
            <i class="fa-solid fa-download"></i> Download Converted Image
          </button>
        </div>
      </div>
    </div>

    <div class="result-container hidden">
      <div class="result-header">
        <h3><i class="fa-solid fa-file-code"></i> Encoding Results</h3>
      </div>
      <div class="result-body">
        <div class="file-summary">
          <img id="preview-mini" src="" alt="Preview" />
          <div class="file-details">
            <strong id="res-name">image.png</strong>
            <p id="res-meta">PNG | 0 KB | 0x0</p>
          </div>
          <div class="img-download">
            <button class="btn download-btn" id="download-img-btn">
              <i class="fa-solid fa-download"></i> Download Image
            </button>
          </div>
        </div>

        <div class="code-section">
          <div class="code-header">
            <span>For use in &lt;img&gt; elements:</span>
            <button class="copy-btn" id="copy-base64">
              <i class="fa-solid fa-copy"></i> Copy
            </button>
          </div>
          <textarea id="base64-output" readonly></textarea>
        </div>
      </div>
    </div>
    <!-- <div class="results-container" id="results-box" style="display: none">
      <div class="results-header">
        <h3><i class="fa-solid fa-file-code"></i> Encoding Results</h3>
      </div>

      <div class="tabs-nav">
        <button class="tab-btn active" data-tab="base64-tab">
          Base64 Code
        </button>
        <button class="tab-btn" data-tab="format-tab">Image Format</button>
        <button class="tab-btn" data-tab="decode-tab">Base64 to Image</button>
      </div>

      <div id="base64-tab" class="tab-content active">
        <div class="file-summary">
          <img id="preview-mini" src="" alt="Preview" />
          <div class="file-details">
            <strong id="res-name">image.png</strong>
            <p id="res-meta">PNG | 0 KB | 0x0</p>
          </div>
        </div>

        <div class="code-section">
          <div class="code-header">
            <span>For use in &lt;img&gt; elements:</span>
            <button class="copy-btn" id="copy-base64">
              <i class="fa-solid fa-copy"></i> Copy
            </button>
          </div>
          <textarea id="base64-output" readonly></textarea>
        </div>
      </div>

      <div id="format-tab" class="tab-content">
        <div class="converter-box">
          <h4><i class="fa-solid fa-shuffle"></i> Convert Image Format</h4>

          <div class="conversion-controls-wrapper">
            <label for="format-select">Choose Output Format:</label>
            <select id="format-select" class="format-select">
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/gif">GIF</option>
              <option value="image/webp">WEBP</option>
            </select>

            <button
              class="btn btn-next active convert-btn"
              id="convert-format-btn"
            >
              <i class="fa-solid fa-redo"></i> Convert
            </button>
          </div>

          <div
            id="conversion-output-section"
            class="conversion-output-section"
            style="display: none"
          >
            <div class="output-header">
              <p class="conversion-status">Conversion Complete!</p>
            </div>

            <div class="output-preview-box">
              <p>Converted Image Preview:</p>
              <div class="output-preview-image">
                <img
                  id="converted-image-preview"
                  src=""
                  alt="Converted Output"
                  class="preview-img"
                />
              </div>
            </div>

            <button class="btn btn-next active download-btn" id="download-btn">
              <i class="fa-solid fa-download"></i> Download Converted Image
            </button>
          </div>
        </div>
      </div>

      <div id="decode-tab" class="tab-content">
        <div class="decoder-box">
          <h4>Paste Base64 Code to Preview</h4>
          <textarea
            id="decode-input"
            placeholder="data:image/png;base64,..."
          ></textarea>

          <div class="decode-output">
            <p>Resulting Image:</p>
            <img id="decode-res-img" src="" alt="Decoded Output" />
          </div>
        </div>
      </div>

      <button class="btn-cancel" id="back-to-upload">
        Convert more images
      </button>
    </div> -->
    <section class="options-container">
      <div class="options-wrapper">
        <div class="format-support">
          <h3>Supported file formats</h3>
          <p>
            Upload up to <strong>20 images simultaneously</strong> (max.
            <strong>1 MB each</strong>) in JPG, PNG, GIF, WebP, SVG, or BMP.
          </p>
        </div>

        <div class="optimization-option">
          <h3>Image optimization option</h3>
          <p>Enable smart compression for JPEG & PNG images.</p>

          <div class="toggle-switch-container">
            <label class="switch">
              <input type="checkbox" id="optimizationToggle" />
              <span class="slider round"></span>
            </label>
            <i class="fa-solid fa-bolt optimization-icon"></i>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-grid">
          <div class="footer-col footer-info">
            <h3>Base64 Image</h3>
            <p>Free online image to base64 converter</p>
          </div>

          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#"><i class="fa-solid fa-house"></i> Home</a>
              </li>
              <li>
                <a href="#"><i class="fa-solid fa-book-open"></i> Tutorial</a>
              </li>
              <li>
                <a href="#"><i class="fa-solid fa-circle-question"></i> FAQ</a>
              </li>
              <li>
                <a href="#"><i class="fa-solid fa-heart"></i> Donation</a>
              </li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#"
                  ><i class="fa-solid fa-shield-halved"></i> Privacy Policy</a
                >
              </li>
              <li>
                <a href="#"
                  ><i class="fa-solid fa-file-invoice"></i> Terms of Use</a
                >
              </li>
              <li>
                <a href="#"><i class="fa-solid fa-building"></i> Imprint</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-about">
          <h4>About</h4>
          <p>Fast, free, and secure image to Base64 conversion.</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 Geek Cell GmbH. All rights reserved.</p>
        <p>By using this site you accept the <a href="#">terms of use</a>.</p>
      </div>
    </footer>

    <script src="index.js"></script>
  </body>
</html>
