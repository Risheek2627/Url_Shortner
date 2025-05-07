document.addEventListener("DOMContentLoaded", () => {
  // Backend API URL - replace with your actual backend URL
  // const API_URL = "http://localhost:5000";
  const API_URL = "https://url-shortner-n3h5.onrender.com";

  // DOM Elements
  const shortenForm = document.getElementById("shorten-form");
  const longUrlInput = document.getElementById("long-url");
  const resultContainer = document.getElementById("result-container");
  const statsCodeInput = document.getElementById("stats-code");
  const getStatsBtn = document.getElementById("get-stats-btn");
  const statsResult = document.getElementById("stats-result");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = themeToggleBtn.querySelector("i");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastClose = document.getElementById("toast-close");

  // Check for saved theme preference
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }

  // Theme toggle functionality
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
  });

  // URL Shortening Form
  shortenForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const longUrl = longUrlInput.value.trim();

    if (!longUrl) {
      showToast("Please enter a URL", "error");
      return;
    }

    try {
      // Show loading state
      const submitBtn = shortenForm.querySelector("button");
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Processing...';

      const response = await fetch(`${API_URL}/api/shortenUrl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error shortening URL");
      }

      // Display result
      displayResult(data);
      showToast("URL shortened successfully!", "success");
      longUrlInput.value = "";

      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message || "Failed to shorten URL", "error");

      // Reset button state
      const submitBtn = shortenForm.querySelector("button");
      submitBtn.disabled = false;
      submitBtn.textContent = "Shorten";
    }
  });

  // Get Stats Button
  getStatsBtn.addEventListener("click", async () => {
    const shortCode = statsCodeInput.value.trim();

    if (!shortCode) {
      showToast("Please enter a short code", "error");
      return;
    }

    try {
      // Show loading state
      getStatsBtn.disabled = true;
      getStatsBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Loading...';

      const response = await fetch(`${API_URL}/api/stats/${shortCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error retrieving stats");
      }

      // Display stats
      displayStats(data);
      showToast("Stats retrieved successfully!", "success");

      // Reset button state
      getStatsBtn.disabled = false;
      getStatsBtn.textContent = "Get Stats";
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message || "Failed to retrieve stats", "error");

      // Reset button state
      getStatsBtn.disabled = false;
      getStatsBtn.textContent = "Get Stats";
      statsResult.style.display = "none";
    }
  });

  // Toast close button
  toastClose.addEventListener("click", () => {
    toast.classList.remove("show");
  });

  // Function to display URL shortening result
  function displayResult(data) {
    resultContainer.style.display = "block";
    resultContainer.innerHTML = `
        <div class="result-card">
          <div class="result-item">
            <span class="result-label">Original URL:</span>
            <div class="result-value">
              <span>${truncateText(data.longUrl || "", 40)}</span>
              <button class="copy-btn" data-clipboard="${
                data.longUrl || ""
              }" title="Copy original URL">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="result-item">
            <span class="result-label">Short URL:</span>
            <div class="result-value">
              <a href="${data.shortUrl || "#"}" target="_blank">${
      data.shortUrl || "N/A"
    }</a>
              <button class="copy-btn" data-clipboard="${
                data.shortUrl || ""
              }" title="Copy short URL">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="result-item">
            <span class="result-label">Short Code:</span>
            <div class="result-value">
              <span>${data.shortCode || "N/A"}</span>
              <button class="copy-btn" data-clipboard="${
                data.shortCode || ""
              }" title="Copy short code">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="qr-code-container">
            ${
              data.qrCode
                ? `<img src="${data.qrCode}" alt="QR Code for ${
                    data.shortUrl || ""
                  }">`
                : "<p>QR code not available</p>"
            }
          </div>
        </div>
      `;

    // Add event listeners to copy buttons
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const textToCopy = btn.getAttribute("data-clipboard");
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            showToast("Copied to clipboard!", "success");
          })
          .catch((err) => {
            console.error("Could not copy text: ", err);
            showToast("Failed to copy text", "error");
          });
      });
    });
  }

  // Function to display stats
  function displayStats(data) {
    statsResult.style.display = "block";
    statsResult.innerHTML = `
        <div class="stats-card">
          <div class="stat-item">
            <div class="stat-label">Short Code</div>
            <div class="stat-value">${data.shortCode || "N/A"}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total Clicks</div>
            <div class="stat-value">${
              data.clickCount !== undefined ? data.clickCount : "N/A"
            }</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Short URL</div>
            <div class="stat-value url">
              <a href="${data.shortUrl || "#"}" target="_blank">${
      data.shortUrl || "N/A"
    }</a>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Original URL</div>
            <div class="stat-value url">${truncateText(
              data.longUrl || "",
              50
            )}</div>
          </div>
        </div>
      `;
  }

  // Function to show toast notifications
  function showToast(message, type = "success") {
    toastMessage.textContent = message;
    toast.className = "toast";
    toast.classList.add(`toast-${type}`);
    toast.classList.add("show");

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Helper function to truncate long text
  function truncateText(text, maxLength) {
    if (!text) return ""; // Handle null/undefined case
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }
});
