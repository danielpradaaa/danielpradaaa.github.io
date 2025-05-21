document.addEventListener("DOMContentLoaded", function () {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById("header-placeholder");
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;

                // Use a MutationObserver to detect when the toggles are added to the DOM
                const observer = new MutationObserver(function (mutationsList, observer) {
                    const languageToggle = document.getElementById("language");
                    const darkModeToggle = document.getElementById("darkmode");

                    if (languageToggle && darkModeToggle) {
                        // console.log("Toggles found:", languageToggle, darkModeToggle); // Debugging: Check if toggles are found

                        // Stop observing once the toggles are found
                        observer.disconnect();

                        // Initialize language toggle
                        initializeLanguageToggle(languageToggle);

                        // Initialize dark mode toggle
                        initializeDarkMode(darkModeToggle);
                    }
                });

                // Start observing the header placeholder for changes
                observer.observe(headerPlaceholder, { childList: true, subtree: true });
            }
        })
        .catch(error => console.error("Error loading header:", error));
});

function initializeLanguageToggle(languageToggle) {
    if (languageToggle) {
        // Set default language (English)
        if (localStorage.getItem("language") === null) {
            localStorage.setItem("language", "en"); // Default to English
        }

        // Apply language based on stored preference
        if (localStorage.getItem("language") === "fr") {
            switchLanguage("fr");
            languageToggle.checked = true;
        }

        // Toggle language when clicking the switch
        languageToggle.addEventListener("change", function () {
            const language = languageToggle.checked ? "fr" : "en";
            switchLanguage(language);
            localStorage.setItem("language", language);
        });
    }
}

function switchLanguage(language) {
    const elementsToTranslate = document.querySelectorAll("[data-en], [data-fr]");
    elementsToTranslate.forEach(element => {
        if (language === "fr" && element.dataset.fr) {
            updateElementText(element, element.dataset.fr);
        } else if (language === "en" && element.dataset.en) {
            updateElementText(element, element.dataset.en);
        }
    });

    // Update the CV download link
    const cvDownloadLink = document.getElementById("cv-download-link");
    if (cvDownloadLink) {
        cvDownloadLink.href = language === "fr" ? cvDownloadLink.dataset.frHref : cvDownloadLink.dataset.enHref;
        cvDownloadLink.download = language === "fr" ? cvDownloadLink.dataset.frDownload : cvDownloadLink.dataset.enDownload;
    }

    // Dispatch a custom event to notify other scripts
    const languageChangedEvent = new CustomEvent('languageChanged', {
        detail: { language: language }
    });
    document.dispatchEvent(languageChangedEvent);
}



function updateElementText(element, newText) {
    // Check if the element is an input or textarea (has a placeholder attribute)
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        // Update the placeholder attribute
        element.placeholder = newText;
    } else {
        // For other elements, find the text node and update it
        const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "");

        if (textNode) {
            // Update the text node with the new text
            textNode.nodeValue = " " + newText; // Add a space to separate the icon and text
        } else {
            // If no text node is found, append the new text after the icon
            const icon = element.querySelector("i");
            if (icon) {
                element.appendChild(document.createTextNode(" " + newText)); // Add a space before the text
            } else {
                // If no icon exists, update the entire text content
                element.textContent = newText;
            }
        }
    }
}


function initializeDarkMode(darkModeToggle) {
    if (darkModeToggle) {
        // Ensure dark mode is always enabled by default
        if (localStorage.getItem("darkMode") === null) {
            localStorage.setItem("darkMode", "true"); // Default to dark mode
        }

        // Apply dark mode based on stored preference
        if (localStorage.getItem("darkMode") === "true") {
            document.body.classList.add("dark-mode");
            darkModeToggle.checked = true;
        }

        // Toggle dark mode when clicking the switch
        darkModeToggle.addEventListener("change", function () {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
        });
    }
}