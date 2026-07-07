/**
 * TSHEETSANO Community Based Organization & Enterprise
 * Core JavaScript Functions - script.js
 * Heavily documented, high performance vanilla JS, no external libraries.
 */

document.addEventListener("DOMContentLoaded", function() {

    // Lightweight image loading for faster initial page rendering
    const lazyImagePlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f5f5f5'/%3E%3Ccircle cx='400' cy='300' r='120' fill='%23d4af37' fill-opacity='0.16'/%3E%3C/svg%3E";
    const lazyImages = Array.from(document.querySelectorAll('img:not([data-no-lazy])'));

    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const img = entry.target;
                const src = img.getAttribute('data-src') || img.getAttribute('src');

                if (src && src !== img.getAttribute('src')) {
                    img.setAttribute('src', src);
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }

                observer.unobserve(img);
            });
        }, { rootMargin: '200px 0px' });

        lazyImages.forEach(img => {
            if (!img.getAttribute('src') || img.getAttribute('src').trim() === '') {
                return;
            }

            const currentSrc = img.getAttribute('src');
            if (currentSrc && currentSrc.startsWith('data:image')) {
                return;
            }

            img.classList.add('lazy-image');
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
            img.setAttribute('fetchpriority', 'low');
            img.setAttribute('data-src', currentSrc);
            img.setAttribute('src', lazyImagePlaceholder);
            imageObserver.observe(img);
        });
    }

    // 1. Single Page Application (SPA) Tab Routing Engine
    const header = document.getElementById("header");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    function navigateToPage() {
        const hash = window.location.hash || "#home";
        let foundSection = false;

        sections.forEach(section => {
            const sectionId = section.getAttribute("id");
            if (`#${sectionId}` === hash) {
                section.classList.add("active-page");
                foundSection = true;
            } else {
                section.classList.remove("active-page");
            }
        });

        // Fallback to home if unknown hash
        if (!foundSection && sections.length > 0) {
            sections[0].classList.add("active-page");
        }

        // Highlight active link in primary header
        navLinks.forEach(link => {
            if (link.getAttribute("href") === hash) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // Instant scroll-to-top so it behaves as a fresh page load
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }

    // Attach routing and boot
    window.addEventListener("hashchange", navigateToPage);
    navigateToPage();

    // Sticky Navigation Header on Scroll
    function handleScrollAdjustments() {
        if (window.scrollY > 40) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }

    window.addEventListener("scroll", handleScrollAdjustments);
    handleScrollAdjustments(); // Initial fire


    // 2. Mobile Nav Toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");
    const navMenuItems = document.querySelectorAll(".nav-menu .nav-link, .nav-menu .nav-btn");

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", function() {
            navMenu.classList.toggle("open");
            const icon = mobileToggle.querySelector("i");
            if (navMenu.classList.contains("open")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });

        // Close mobile drawer on menu item click
        navMenuItems.forEach(item => {
            item.addEventListener("click", function() {
                navMenu.classList.remove("open");
                mobileToggle.querySelector("i").className = "fa-solid fa-bars";
            });
        });
    }


    // 3. Stats Counter Animation on scroll intersection
    const statsSection = document.getElementById("statsSection");
    const statNumbers = document.querySelectorAll(".stat-number");
    let hasCounted = false;

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute("data-target"), 10);
                    let start = 0;
                    const duration = 2000; // ms
                    const step = Math.max(Math.floor(duration / target), 15);
                    const increment = Math.ceil(target / 40); // speed curves

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            stat.textContent = target.toLocaleString();
                            clearInterval(timer);
                        } else {
                            stat.textContent = start.toLocaleString();
                        }
                    }, step);
                });

                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.1 });

        statsObserver.observe(statsSection);
    }


    // 4. Products Drawer Modal
    const prodModalOverlay = document.getElementById("prodModalOverlay");
    const prodModalImg = document.getElementById("prodModalImg");
    const prodModalTitle = document.getElementById("prodModalTitle");
    const prodModalDesc = document.getElementById("prodModalDesc");
    const prodModalInquireBtn = document.getElementById("prodModalInquireBtn");

    window.openProductModal = function(title, description, image) {
        if (!prodModalOverlay) return;
        prodModalTitle.textContent = title;
        prodModalDesc.textContent = description;
        prodModalImg.src = image;
        prodModalOverlay.classList.add("active");

        // Wire Inquire button inside modal 
        prodModalInquireBtn.onclick = function() {
            closeProductModal();
            inquireProduct(title);
        };
    };

    window.closeProductModal = function() {
        if (prodModalOverlay) {
            prodModalOverlay.classList.remove("active");
        }
    };

    // Close product modal if clicking outside content box
    if (prodModalOverlay) {
        prodModalOverlay.addEventListener("click", function(e) {
            if (e.target === prodModalOverlay) {
                closeProductModal();
            }
        });
    }

    // Moringa & Makgasi info modal
    const moringaInfoBtn = document.getElementById("moringaInfoBtn");
    const moringaInfoModalOverlay = document.getElementById("moringaInfoModalOverlay");

    window.openMoringaInfoModal = function() {
        if (moringaInfoModalOverlay) {
            moringaInfoModalOverlay.classList.add("active");
        }
    };

    window.closeMoringaInfoModal = function() {
        if (moringaInfoModalOverlay) {
            moringaInfoModalOverlay.classList.remove("active");
        }
    };

    if (moringaInfoBtn) {
        moringaInfoBtn.addEventListener("click", openMoringaInfoModal);
    }

    if (moringaInfoModalOverlay) {
        moringaInfoModalOverlay.addEventListener("click", function(e) {
            if (e.target === moringaInfoModalOverlay) {
                closeMoringaInfoModal();
            }
        });
    }

    // Makgasi a Pere Powder info modal
    const makgasiPowderInfoBtn = document.getElementById("makgasiPowderInfoBtn");
    const makgasiPowderModalOverlay = document.getElementById("makgasiPowderModalOverlay");

    window.openMakgasiPowderModal = function() {
        if (makgasiPowderModalOverlay) {
            makgasiPowderModalOverlay.classList.add("active");
        }
    };

    window.closeMakgasiPowderModal = function() {
        if (makgasiPowderModalOverlay) {
            makgasiPowderModalOverlay.classList.remove("active");
        }
    };

    if (makgasiPowderInfoBtn) {
        makgasiPowderInfoBtn.addEventListener("click", openMakgasiPowderModal);
    }

    if (makgasiPowderModalOverlay) {
        makgasiPowderModalOverlay.addEventListener("click", function(e) {
            if (e.target === makgasiPowderModalOverlay) {
                closeMakgasiPowderModal();
            }
        });
    }

    // Moringa + Guava combined modal
    const moringaGuavaInfoBtn = document.getElementById("moringaGuavaInfoBtn");
    const moringaGuavaModalOverlay = document.getElementById("moringaGuavaModalOverlay");

    window.openMoringaGuavaModal = function() {
        if (moringaGuavaModalOverlay) {
            moringaGuavaModalOverlay.classList.add("active");
        }
    };

    window.closeMoringaGuavaModal = function() {
        if (moringaGuavaModalOverlay) {
            moringaGuavaModalOverlay.classList.remove("active");
        }
    };

    if (moringaGuavaInfoBtn) {
        moringaGuavaInfoBtn.addEventListener("click", openMoringaGuavaModal);
    }

    if (moringaGuavaModalOverlay) {
        moringaGuavaModalOverlay.addEventListener("click", function(e) {
            if (e.target === moringaGuavaModalOverlay) {
                closeMoringaGuavaModal();
            }
        });
    }

    // Auto-focus and pre-populate contact fields on Product Inquiry
    window.inquireProduct = function(productName) {
        const messageBox = document.getElementById("messageBox");

        if (messageBox) {
            messageBox.value = `Hello TSHEETSANO Organization. I would like to learn more and inquire details about your product: "${productName}". Please share availability and pricing details. Thank you.`;
        }

        window.location.hash = "#contact";
        setTimeout(() => {
            if (messageBox) messageBox.focus();
        }, 150);
    };


    // 5. Image Gallery Filtering
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            // Adjust active filter class
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            galleryItems.forEach(item => {
                const category = item.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    item.style.display = "block";
                    // Brief zoom-fade animation
                    item.style.opacity = "0";
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transition = "opacity 0.3s ease";
                    }, 50);
                } else {
                    item.style.display = "none";
                }
            });
        });
    });


    // 6. Interactive Lightbox Image Viewer
    const lightboxOverlay = document.getElementById("lightboxOverlay");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const lightboxCat = document.getElementById("lightboxCat");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxDesc = document.getElementById("lightboxDesc");

    let activeItems = []; // Keeps track of currently displayed filtered list
    let currentSlideIndex = 0;

    function updateActiveItems() {
        // Collect currently visible visible items
        activeItems = Array.from(galleryItems).filter(item => item.style.display !== "none");
    }

    function showLightbox(slideIndex) {
        if (!lightboxOverlay || activeItems.length === 0) return;
        currentSlideIndex = slideIndex;
        const currentItem = activeItems[slideIndex];

        const img = currentItem.querySelector("img");
        const title = currentItem.querySelector("h4");
        const desc = currentItem.querySelector(".img-desc");
        const cat = currentItem.querySelector(".img-cat");

        if (img && lightboxImg) {
            lightboxImg.src = img.src;
        }
        if (lightboxTitle) {
            lightboxTitle.textContent = title ? title.textContent : "";
        }
        if (lightboxDesc) {
            lightboxDesc.textContent = desc ? desc.textContent : "";
        }
        if (lightboxCat) {
            lightboxCat.textContent = cat ? cat.textContent : "";
        }

        lightboxOverlay.classList.add("active");
    }

    galleryItems.forEach(item => {
        item.addEventListener("click", function() {
            updateActiveItems();
            const visibleIndex = activeItems.indexOf(item);
            if (visibleIndex !== -1) {
                showLightbox(visibleIndex);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", function() {
            lightboxOverlay.classList.remove("active");
        });
    }

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener("click", function(e) {
            if (e.target === lightboxOverlay) {
                lightboxOverlay.classList.remove("active");
            }
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener("click", function(e) {
            e.stopPropagation();
            if (activeItems.length === 0) return;
            const newIndex = currentSlideIndex === 0 ? activeItems.length - 1 : currentSlideIndex - 1;
            showLightbox(newIndex);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener("click", function(e) {
            e.stopPropagation();
            if (activeItems.length === 0) return;
            const newIndex = currentSlideIndex === activeItems.length - 1 ? 0 : currentSlideIndex + 1;
            showLightbox(newIndex);
        });
    }

    // Keyboard controls for lightbox support
    document.addEventListener("keydown", function(e) {
        if (lightboxOverlay && lightboxOverlay.classList.contains("active")) {
            if (e.key === "Escape") lightboxOverlay.classList.remove("active");
            if (e.key === "ArrowLeft") lightboxPrev.click();
            if (e.key === "ArrowRight") lightboxNext.click();
        }
    });


    // 7. Interactive 3D Showcase Cube Engine (Drag & Multi-Axis Auto-Tumble)
    const cube = document.getElementById("interactiveCube");

    if (cube) {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let currentRotation = { x: -15, y: 45 };
        let autoRotateActive = true;
        let autoRotateSpeedX = 0.35; // gentle pitch rotation to showcase top and bottom
        let autoRotateSpeedY = 0.5;  // yaw rotation
        let animationFrameId = null;

        // Auto-rotation engine
        function autoRotate() {
            if (autoRotateActive && !isDragging) {
                currentRotation.x = (currentRotation.x + autoRotateSpeedX) % 360;
                currentRotation.y = (currentRotation.y + autoRotateSpeedY) % 360;
                cube.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
            }
            animationFrameId = requestAnimationFrame(autoRotate);
        }

        // Initialize auto rotation
        autoRotate();

        // Mouse & Touch Interaction Drag to Rotate
        function handleDragStart(x, y) {
            isDragging = true;
            previousMousePosition = { x, y };
            cube.style.transition = "none"; // disable transition for smooth tracking
        }

        function handleDragMove(x, y) {
            if (!isDragging) return;

            const deltaX = x - previousMousePosition.x;
            const deltaY = y - previousMousePosition.y;

            // Update rotation values based on drag speed
            currentRotation.y += deltaX * 0.5;
            currentRotation.x -= deltaY * 0.5;

            // Constrain X axis rotation to avoid flipping upside down completely
            currentRotation.x = Math.max(-60, Math.min(60, currentRotation.x));

            cube.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
            previousMousePosition = { x, y };
        }

        function handleDragEnd() {
            isDragging = false;
            cube.style.transition = "transform 0.1s ease-out";
        }

        // Mouse listeners
        cube.addEventListener("mousedown", (e) => {
            handleDragStart(e.clientX, e.clientY);
            e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
            handleDragMove(e.clientX, e.clientY);
        });

        document.addEventListener("mouseup", () => {
            handleDragEnd();
        });

        // Touch listeners
        cube.addEventListener("touchstart", (e) => {
            if (e.touches.length > 0) {
                handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        document.addEventListener("touchmove", (e) => {
            if (isDragging && e.touches.length > 0) {
                handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        document.addEventListener("touchend", () => {
            handleDragEnd();
        });
    }


    // 8. Back-to-Top Button Trigger and Action
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }
        });

        scrollTopBtn.addEventListener("click", function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});
