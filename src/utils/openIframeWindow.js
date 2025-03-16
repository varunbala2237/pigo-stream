const openIframeWindow = (serverLink) => {
  const newWindow = window.open("", "_blank", "fullscreen=yes");
  if (!newWindow) {
    window.open(serverLink, "_blank");
    return;
  }

  newWindow.document.documentElement.innerHTML = ""; // Clear existing content

  // Create styles
  const style = newWindow.document.createElement("style");
  style.innerHTML = `
    body, html { margin: 0; padding: 0; height: 100vh; overflow: hidden; }
    iframe { width: 100vw; height: 100vh; border: none; }

    .back-button {
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      padding: 10px 20px;
      border-radius: 20px;
      border: none;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      font-size: 16px;
      font-weight: bold;
      transition: opacity 0.3s ease-in-out;
      opacity: 1;
      cursor: pointer;
    }

    /* Invisible overlay to detect events but NOT block interactions */
    .overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: transparent;
      z-index: 999;
      pointer-events: none;
    }
  `;

  // Append styles
  newWindow.document.head.appendChild(style);

  // Create overlay (used for event detection only)
  const overlay = newWindow.document.createElement("div");
  overlay.id = "overlay";
  overlay.className = "overlay";

  // Create back button
  const backButton = newWindow.document.createElement("button");
  backButton.id = "backButton";
  backButton.className = "back-button";
  backButton.textContent = "Close";

  // Create iframe
  const iframe = newWindow.document.createElement("iframe");
  iframe.src = serverLink;
  iframe.allowFullscreen = true;

  // Append elements to body
  newWindow.document.body.appendChild(overlay);
  newWindow.document.body.appendChild(backButton);
  newWindow.document.body.appendChild(iframe);

  // Hide back button after timeout
  let timeout;

  const hideButton = () => {
    backButton.style.opacity = "0";
  };

  const showButton = () => {
    backButton.style.opacity = "1";
    clearTimeout(timeout);
    timeout = setTimeout(hideButton, 3000);
  };

  backButton.addEventListener("click", () => {
    newWindow.close();
  });

  const detectInteraction = () => {
    showButton();
  };

  newWindow.document.addEventListener("mousemove", detectInteraction);
  newWindow.document.addEventListener("touchstart", detectInteraction);
  newWindow.document.addEventListener("click", detectInteraction);

  iframe.onload = () => {
    try {
      iframe.contentWindow.document.addEventListener("mousemove", detectInteraction);
      iframe.contentWindow.document.addEventListener("touchstart", detectInteraction);
    } catch (error) {
      console.warn("Iframe event detection blocked due to cross-origin policy.");
    }
  };

  // Initially hide the button after 3 seconds
  timeout = setTimeout(hideButton, 3000);
};

export default openIframeWindow;