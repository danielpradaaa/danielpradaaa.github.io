document.addEventListener('DOMContentLoaded', function () {
    const projectContainer = document.getElementById('project-container');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentProject = null;
    let currentImageIndex = 0;
    let projects = []; // Store projects globally
    let currentLanguage = localStorage.getItem('language') || 'en'; // Default to English

    // Fetch the JSON data
    fetch('assets/data/projects.json')
        .then(response => response.json())
        .then(data => {
            projects = data; // Store projects globally
            renderProjects(currentLanguage); // Render projects with the current language
        })
        .catch(error => console.error('Error fetching projects:', error));

    // Function to render projects based on the selected language
    function renderProjects(language) {
        projectContainer.innerHTML = ''; // Clear existing projects
        projects.forEach(project => {
            const projectCard = createProjectCard(project, language);
            projectContainer.appendChild(projectCard);
        });

        // Initialize Isotope after adding items
        const iso = new Isotope(projectContainer, {
            itemSelector: '.isotope-item',
            layoutMode: 'fitRows',
            percentPosition: true,
            stagger: 30,
            transitionDuration: '0.8s'
        });

        // Refresh Isotope layout after images are loaded
        imagesLoaded(projectContainer, function () {
            iso.layout();
        });
    }

    // Function to create a project card
    function createProjectCard(project, language) {
        const card = document.createElement('div');
        card.className = 'isotope-item col-md-6 mb-5';

        card.innerHTML = `
            <div class="card project-card">
                <div class="row">
                    <div class="col-12 col-xl-5 card-img-holder">
                        <img src="${project.image}" class="card-img" alt="${project.title[language]}">
                    </div>
                    <div class="col-12 col-xl-7">
                        <div class="card-body">
                            <h5 class="card-title">${project.title[language]}</h5>
                            <p class="card-text">${project.shortDescription[language]}</p>
                        </div>
                    </div>
                </div>
                <div class="link-mask">
                    <a class="link-mask-link"></a>
                    <div class="link-mask-text">
                        <a class="btn btn-secondary" data-id="${project.id}">
                            <i class="fas fa-eye me-2"></i>${language === 'en' ? 'See more' : 'Voir plus'}
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Add event listener to the "See more" button
        const seeMoreBtn = card.querySelector('.btn-secondary');
        seeMoreBtn.addEventListener('click', () => openModal(project, language));

        return card;
    }

    // Function to open the modal
    function openModal(project, language) {
        currentProject = project;
        currentImageIndex = 0;
        updateModalContent(language);
        modalOverlay.style.display = 'flex'; // Show the modal
    }

    // Function to update the modal content
    function updateModalContent(language) {
        modalImage.src = currentProject.images_description[currentImageIndex];

        // Convert fullDescription to an unordered list
        const descriptionList = currentProject.fullDescription[language]
            .map(desc => `<li>${desc}</li>`)
            .join('');

        modalDescription.innerHTML = `
            <h3 class="modal-title">${currentProject.title[language]}</h3>
            <ul class="modal-description-list">
                ${descriptionList}
            </ul>
        `;
    }

    // Event listeners for modal navigation
    prevBtn.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateModalContent(currentLanguage);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentImageIndex < currentProject.images_description.length - 1) {
            currentImageIndex++;
            updateModalContent(currentLanguage);
        }
    });

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'none'; // Hide the modal
    });

    // Close modal when clicking outside of it
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none'; // Hide the modal
        }
    });

    // Listen for language toggle changes
    document.addEventListener('languageChanged', function (e) {
        currentLanguage = e.detail.language; // Update the current language
        renderProjects(currentLanguage); // Re-render projects with the new language
    });
});