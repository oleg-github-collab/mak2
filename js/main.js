/**
 * Головний JavaScript файл для сайту Roots & Wings
 * Метафоричні асоціативні карти
 */

// Глобальна змінна для функції оновлення каруселі
let updateCarouselGlobal;

// Очікуємо завантаження DOM перед ініціалізацією скриптів
document.addEventListener('DOMContentLoaded', function() {
    // Виправлення для мобільних пристроїв із затримкою прокрутки
    document.documentElement.style.scrollBehavior = 'auto';
    setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);

    // Завантажуємо необхідні зовнішні бібліотеки динамічно, якщо вони відсутні
    loadExternalLibraries().then(() => {
        // Ініціалізуємо прелоадер для початкового завантаження сайту
        initPreloader();
        
        // Ініціалізуємо кастомний курсор
        initCursor();
        
        // Ініціалізуємо мобільне меню
        initMobileMenu();
        
        // Ініціалізуємо ефект прокрутки для хедера
        initHeaderScroll();
        
        // Ініціалізуємо плавну прокрутку для якорів
        initSmoothScroll();
        
        // Ініціалізуємо анімації
        initAnimations();
        
        // Ініціалізуємо інтерактивні компоненти
        initCardSpread();
        
        // Покращена карусель з плавною анімацією
        initImprovedCarousel();
        
        initCardDeck();
        initCardGrid();
        
        // Ініціалізуємо паралакс-ефекти
        initParallax();
        
        // Ініціалізуємо контактну форму з інтеграцією Google Spreadsheets
        initContactForm();
        
        // Ініціалізуємо кнопку "повернутися нагору"
        initBackToTop();
        
        // Ініціалізуємо модальні вікна
        initModals();
        
        // Ініціалізуємо 3D ефекти для карток (VanillaTilt)
        initVanillaTilt();
        
        // Ініціалізуємо фонові частинки
        initParticles();

        // Ініціалізуємо кнопки правових документів у футері
        initLegalButtons();
        
        // Покращені рандомні падаючі карти з більш природною фізикою
        initEnhancedFallingCards();
        
        // Скриваємо зображення логотипу, залишаємо тільки текст
        hideLogoImage();
        
        // Підганяємо розмір карток до зображень у сітці
        adjustCardSizeToImages();
    }).catch(error => {
        console.error('Помилка при завантаженні зовнішніх бібліотек:', error);
        // Ініціалізуємо базову функціональність навіть при помилці завантаження бібліотек
        initBasicFunctionality();
    });
});

/**
 * Динамічне завантаження зовнішніх бібліотек
 * Завантажує VanillaTilt та Particles.js, якщо вони відсутні
 */
function loadExternalLibraries() {
    return new Promise((resolve, reject) => {
        let librariesLoaded = 0;
        const requiredLibraries = 2; // VanillaTilt та Particles.js
        
        function checkIfComplete() {
            librariesLoaded++;
            if (librariesLoaded >= requiredLibraries) {
                resolve();
            }
        }

        // Завантаження VanillaTilt, якщо він відсутній
        if (typeof VanillaTilt === 'undefined') {
            const vanillaTiltScript = document.createElement('script');
            vanillaTiltScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js';
            vanillaTiltScript.onload = checkIfComplete;
            vanillaTiltScript.onerror = () => {
                console.warn('Не вдалося завантажити VanillaTilt.js');
                checkIfComplete();
            };
            document.head.appendChild(vanillaTiltScript);
        } else {
            checkIfComplete();
        }
        
        // Завантаження Particles.js, якщо він відсутній
        if (typeof particlesJS === 'undefined') {
            const particlesScript = document.createElement('script');
            particlesScript.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
            particlesScript.onload = checkIfComplete;
            particlesScript.onerror = () => {
                console.warn('Не вдалося завантажити Particles.js');
                checkIfComplete();
            };
            document.head.appendChild(particlesScript);
        } else {
            checkIfComplete();
        }
        
        // Встановлюємо таймаут для завантаження, щоб уникнути нескінченного очікування
        setTimeout(() => {
            if (librariesLoaded < requiredLibraries) {
                console.warn('Деякі бібліотеки не вдалося завантажити вчасно');
                resolve();
            }
        }, 5000);
    });
}

/**
 * Ініціалізація основних функцій, які не залежать від зовнішніх бібліотек
 */
function initBasicFunctionality() {
    initPreloader();
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initBackToTop();
    initContactForm();
    initModals();
    initLegalButtons();
}

/**
* Функціональність прелоадера
* Відображає прогрес завантаження сайту та приховує прелоадер після завершення
*/
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.preloader-progress');
    const counter = document.querySelector('.preloader-counter');
    
    if (!preloader || !progressBar || !counter) return;

    let progress = 0;
    const totalAssets = document.querySelectorAll('img').length + 5; // Зображення + CSS + JS + Шрифти
    let loadedAssets = 0;
    
    // Функція для оновлення прогресу
    function updateProgress() {
        loadedAssets++;
        progress = Math.min(Math.ceil((loadedAssets / totalAssets) * 100), 100);
        progressBar.style.width = progress + '%';
        counter.textContent = progress + '%';
        
        if (progress >= 100) {
            setTimeout(hidePreloader, 500);
        }
    }
    
    // Функція для приховування прелоадера після завершення завантаження
    function hidePreloader() {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
        
        // Запускаємо початкові анімації
        startInitialAnimations();
    }
    
    // Відстежуємо завантаження зображень
    const images = document.querySelectorAll('img');
    let imagesLoaded = 0;
    
    function imageLoaded() {
        imagesLoaded++;
        updateProgress();
    }
    
    // Якщо зображень немає, все одно оновлюємо прогрес
    if (images.length === 0) {
        for (let i = 0; i < 5; i++) {
            setTimeout(updateProgress, i * 200);
        }
    } else {
        // Відстежуємо завантаження кожного зображення
        images.forEach(img => {
            if (img.complete) {
                imageLoaded();
            } else {
                img.addEventListener('load', imageLoaded);
                img.addEventListener('error', imageLoaded); // Враховуємо помилки як завантажені, щоб уникнути зависання
            }
        });
        
        // Додаємо додаткові лічильники для інших ресурсів (CSS, JS, шрифти)
        for (let i = 0; i < 5; i++) {
            setTimeout(updateProgress, i * 200);
        }
    }
    
    // Переконуємося, що прелоадер зникне, навіть якщо деякі ресурси не завантажаться
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            hidePreloader();
        }
    }, 5000);
}

/**
* Початкові анімації, які запускаються після зникнення прелоадера
*/
function startInitialAnimations() {
    // Анімація елементів головної секції
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroTitle) heroTitle.classList.add('revealed');
    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.classList.add('revealed');
        }, 200);
    }
    if (heroDescription) {
        setTimeout(() => {
            heroDescription.classList.add('revealed');
        }, 400);
    }
    if (heroButtons) {
        setTimeout(() => {
            heroButtons.classList.add('revealed');
        }, 600);
    }
    if (heroImage) {
        setTimeout(() => {
            heroImage.classList.add('revealed');
        }, 800);
    }
    
    // Створюємо спостерігач для відображення елементів, які спочатку видимі
    initScrollObserver();
}

/**
* Ініціалізація спостерігача прокрутки для анімацій
*/
function initScrollObserver() {
    // Перевіряємо підтримку IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // Якщо не підтримується, просто показуємо всі елементи
        document.querySelectorAll('.lazy-load, .visual-title, .split-text:not(.hero-title):not(.hero-subtitle), .content-item, .feature-card, .target-card, .author-card, .spread-card, .falling-card, .grid-card').forEach(el => {
            el.classList.add('revealed');
            el.classList.add('loaded');
        });
        return;
    }
    
    // Створюємо спостерігач
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Спостерігаємо за елементами
    document.querySelectorAll('.lazy-load, .visual-title, .split-text:not(.hero-title):not(.hero-subtitle), .content-item, .feature-card, .target-card, .author-card, .spread-card, .falling-card, .grid-card').forEach(el => {
        observer.observe(el);
    });
}

/**
* Функціональність кастомного курсора
*/
function initCursor() {
    const cursor = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');
    
    if (!cursor || !cursorOutline) return;
    
    // Перевіряємо, чи має пристрій сенсорні можливості
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    if (!isTouchDevice) {
        document.body.classList.add('cursor-enabled');
        
        // Оновлюємо положення курсора при русі миші з використанням requestAnimationFrame
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let frameId;
        
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!frameId) {
                frameId = requestAnimationFrame(updateCursor);
            }
        });
        
        function updateCursor() {
            // Плавне слідування за курсором
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
            
            cursorOutline.style.left = `${cursorX}px`;
            cursorOutline.style.top = `${cursorY}px`;
            
            if (cursorText) {
                cursorText.style.left = `${cursorX}px`;
                cursorText.style.top = `${cursorY}px`;
            }
            
            frameId = requestAnimationFrame(updateCursor);
        }
        
        // Додаємо ефект при наведенні на інтерактивні елементи
        const interactiveElements = document.querySelectorAll('a, button, .card, .interactive, input, textarea, .cursor-hover-trigger, .spread-card, .carousel-card, .grid-card, .deck-card, .draw-button, .carousel-prev, .carousel-next, .modal-close, .author-photo, .floating-card, .legal-button, .btn-modal');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorOutline.classList.add('cursor-hover');
                
                // Показуємо текст для елементів з data-cursor-text
                if (cursorText && el.dataset.cursorText) {
                    cursorText.textContent = el.dataset.cursorText;
                    document.body.classList.add('cursor-text-visible');
                }
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorOutline.classList.remove('cursor-hover');
                
                // Приховуємо текст
                if (cursorText) {
                    document.body.classList.remove('cursor-text-visible');
                }
            });
        });
        
        // Додаємо ефект при натисканні
        document.addEventListener('mousedown', () => {
            cursor.classList.add('cursor-click');
            cursorOutline.classList.add('cursor-click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('cursor-click');
            cursorOutline.classList.remove('cursor-click');
        });
        
        // Приховуємо стандартний курсор
        document.documentElement.style.cursor = 'none';
    }
}

/**
* Функціональність мобільного меню
*/
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const header = document.querySelector('.header');
    
    if (!menuToggle || !mobileMenu) return;
    
    // Перемикання меню
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
        
        // Фокусуємося на першому елементі меню для кращої доступності
        if (mobileMenu.classList.contains('open') && mobileLinks.length > 0) {
            mobileLinks[0].focus();
        }
    });
    
    // Закриття меню
    if (menuClose) {
        menuClose.addEventListener('click', function(e) {
            e.preventDefault();
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
            menuToggle.focus(); // Повертаємо фокус на кнопку меню
        });
    }
    
    // Закриття меню при натисканні на посилання
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Не закриваємо меню, якщо посилання відкриває підменю
            if (this.classList.contains('has-submenu')) {
                e.preventDefault();
                this.classList.toggle('submenu-open');
                return;
            }
            
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Закриття меню при натисканні поза ним
    document.addEventListener('click', function(e) {
        if (document.body.classList.contains('menu-open') && 
            !mobileMenu.contains(e.target) && 
            e.target !== menuToggle && 
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Обробка клавіші Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
            menuToggle.focus(); // Повертаємо фокус на кнопку меню
        }
    });
    
    // Виправлення для меню, щоб уникнути дублювання навігаційних елементів
    function adjustMenuVisibility() {
        const desktopNav = document.querySelector('.desktop-nav');
        const isMobile = window.innerWidth < 768;
        
        if (desktopNav) {
            if (isMobile) {
                desktopNav.setAttribute('aria-hidden', 'true');
                desktopNav.style.display = 'none';
                if (menuToggle) menuToggle.style.display = 'block';
            } else {
                desktopNav.removeAttribute('aria-hidden');
                desktopNav.style.display = 'flex';
                if (menuToggle) menuToggle.style.display = 'none';
                // Закриваємо мобільне меню
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
            }
        }
    }
    
    // Виклик функції при завантаженні
    adjustMenuVisibility();
    
    // І при зміні розміру екрану
    window.addEventListener('resize', adjustMenuVisibility);
}

/**
* Ефект прокрутки для хедера
*/
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    // Перевіряємо положення прокрутки та додаємо/видаляємо класи
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Початкова перевірка
    checkScroll();
    
    // Перевірка при прокрутці з оптимізацією продуктивності
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
* Плавна прокрутка для якірних посилань
*/
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                console.warn(`Елемент з id=${targetId} не знайдено`);
                return;
            }
            
            // Отримуємо зміщення з урахуванням висоти хедера
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Прокручуємо до цілі
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Додаємо історію браузера
            history.pushState(null, null, targetId);
            
            // Закриваємо мобільне меню, якщо воно відкрите
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
                if (menuToggle) menuToggle.classList.remove('active');
            }
            
            // Встановлюємо фокус на ціль для кращої доступності
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({preventScroll: true});
            
            // Додаємо клас для анімації цілі
            targetElement.classList.add('target-active');
            setTimeout(() => {
                targetElement.classList.remove('target-active');
            }, 1500);
        });
    });
    
    // Додаємо обробник для індикатора прокрутки
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('.section:nth-child(2)');
            if (nextSection) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Встановлюємо фокус на наступну секцію
                nextSection.setAttribute('tabindex', '-1');
                nextSection.focus({preventScroll: true});
            }
        });
    }
}

/**
* Ініціалізація кнопки "повернутися нагору"
*/
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    // Перевіряємо положення прокрутки та перемикаємо видимість кнопки
    function checkScrollPosition() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Прокрутка до початку сторінки при натисканні на кнопку
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Встановлюємо фокус на верхній елемент сторінки
        const focusTarget = document.querySelector('header, body');
        if (focusTarget) {
            focusTarget.setAttribute('tabindex', '-1');
            focusTarget.focus({preventScroll: true});
        }
    });
    
    // Перевірка положення прокрутки при прокрутці з оптимізацією
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScrollPosition();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Початкова перевірка
    checkScrollPosition();
}

/**
* Ініціалізація всіх анімацій
*/
function initAnimations() {
    // Розділення тексту для анімацій
    initTextSplitting();
    
    // Додаємо анімацію плаваючим картам в hero-секції
    animateFloatingCards();
    
    // Ініціалізуємо анімації при прокрутці
    initScrollAnimations();
}

/**
* Розділення тексту для анімацій
*/
function initTextSplitting() {
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
        if (element.dataset.splitted) return; // Уникаємо повторного розділення
        
        let text = element.textContent;
        let splitHtml = '';
        
        // Розділяємо за словами
        const words = text.split(' ');
        
        words.forEach((word, wordIndex) => {
            splitHtml += `<span class="word" aria-hidden="true">`;
            
            // Розділяємо за символами
            Array.from(word).forEach((char, charIndex) => {
                splitHtml += `<span class="char" style="transition-delay: ${(wordIndex * 0.05) + (charIndex * 0.03)}s">${char}</span>`;
            });
            
            splitHtml += `</span> `;
        });
        
        // Зберігаємо оригінальний текст для доступності
        const originalText = document.createElement('span');
        originalText.className = 'sr-only';
        originalText.textContent = text;
        
        element.innerHTML = splitHtml;
        element.appendChild(originalText);
        element.dataset.splitted = 'true';
    });
}

/**
* Анімація плаваючих карт в hero-секції
*/
function animateFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Генеруємо випадкові значення для анімації
        const duration = 3 + Math.random() * 2; // 3-5 секунд
        const delay = index * 0.5; // Затримка для різних карт
        const translateY = -10 - Math.random() * 10; // Зміщення по Y
        const rotate = -5 + Math.random() * 10; // Обертання
        
        // Використовуємо CSS-змінні для простішого управління анімацією
        card.style.setProperty('--float-duration', `${duration}s`);
        card.style.setProperty('--float-delay', `${delay}s`);
        card.style.setProperty('--translate-y', `${translateY}px`);
        card.style.setProperty('--rotate-angle', `${rotate}deg`);
        
        // Додаємо клас для запуску анімації
        card.classList.add('animate-float');
        
        // Додаємо атрибути для доступності
        card.setAttribute('aria-label', 'Декоративна картка');
        card.setAttribute('role', 'img');
    });
}

/**
 * Покращена анімація падаючих карт з випадковим розташуванням та природною фізикою
 */
function initEnhancedFallingCards() {
    const fallingCardsContainer = document.querySelector('.falling-cards-container');
    const fallingCards = document.querySelectorAll('.falling-card');
    
    if (!fallingCardsContainer || !fallingCards.length) return;
    
    // Встановлюємо базові стилі для контейнера
    fallingCardsContainer.style.position = 'relative';
    fallingCardsContainer.style.minHeight = '500px';
    fallingCardsContainer.classList.add('individual-falling');
    
    // Параметри фізики падіння
    const gravity = 0.05;
    const friction = 0.99;
    const turbulence = 0.1;
    const cardsData = [];
    
    // Налаштовуємо кожну карту окремо для реалістичного падіння
    fallingCards.forEach((card, index) => {
        // Отримуємо параметри з атрибутів або генеруємо випадкові значення
        const delay = parseFloat(card.dataset.fallingDelay) || (index * 0.5 + Math.random() * 0.5);
        const rotateStart = parseFloat(card.dataset.rotateStart) || (-15 + Math.random() * 30);
        const rotateEnd = parseFloat(card.dataset.rotateEnd) || (-10 + Math.random() * 20);
        let xPosition = parseFloat(card.dataset.xPosition) || (5 + Math.random() * 90);
        let yPosition = parseFloat(card.dataset.yPosition) || (-20 - Math.random() * 100);
        
        // Додаємо клас для рандомного розташування
        card.classList.add('random-position');
        
        // Створюємо об'єкт даних для анімації
        cardsData.push({
            element: card,
            delay: delay * 1000, // переводимо в мілісекунди
            startTime: null,
            x: xPosition,
            y: yPosition,
            vx: Math.random() * 0.4 - 0.2, // швидкість по X
            vy: 0, // початкова швидкість по Y
            rotation: rotateStart,
            rotationSpeed: (rotateEnd - rotateStart) / 100, // швидкість обертання
            active: false,
            finalY: 10 + Math.random() * 70 // кінцева позиція Y
        });
        
        // Налаштовуємо початковий стан карт
        card.style.position = 'absolute';
        card.style.left = `${xPosition}%`;
        card.style.top = `${yPosition}%`;
        card.style.opacity = '0';
        card.style.transform = `translateY(0) rotate(${rotateStart}deg)`;
        card.style.transition = 'opacity 0.5s ease';
        
        // Додаємо ефект при наведенні миші
        card.addEventListener('mouseenter', () => {
            card.style.transform = `translateY(-20px) rotate(${card.style.getPropertyValue('--rotation') || rotateEnd}deg) scale(1.1)`;
            card.style.zIndex = '10';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `translateY(0) rotate(${card.style.getPropertyValue('--rotation') || rotateEnd}deg) scale(1)`;
            card.style.zIndex = '';
            card.style.boxShadow = '';
            card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        });
    });
    
    // Функція для анімації падіння карт
    let animationFrameId;
    let lastTime = 0;
    
    function animateFallingCards(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Перевіряємо, чи потрібно активувати карти
        cardsData.forEach(cardData => {
            if (!cardData.active && (!cardData.startTime || timestamp - cardData.startTime > cardData.delay)) {
                if (!cardData.startTime) cardData.startTime = timestamp;
                cardData.active = true;
                cardData.element.style.opacity = '1';
            }
        });
        
        // Оновлюємо позиції активних карт
        let allSettled = true;
        
        cardsData.forEach(cardData => {
            if (!cardData.active) {
                allSettled = false;
                return;
            }
            
            // Додаємо гравітацію
            cardData.vy += gravity;
            
            // Додаємо турбулентність (випадкові мікро-рухи)
            cardData.vx += (Math.random() * 2 - 1) * turbulence;
            cardData.vy += (Math.random() * 2 - 1) * turbulence * 0.5;
            
            // Застосовуємо тертя
            cardData.vx *= friction;
            cardData.vy *= friction;
            
            // Оновлюємо позицію
            cardData.x += cardData.vx;
            cardData.y += cardData.vy;
            
            // Оновлюємо обертання
            cardData.rotation += cardData.rotationSpeed;
            
            // Перевіряємо досягнення кінцевої позиції
            if (cardData.y >= cardData.finalY) {
                cardData.y = cardData.finalY;
                cardData.vy *= -0.3; // легкий відскок
                
                // Якщо швидкість вертикального руху мала, зупиняємо рух
                if (Math.abs(cardData.vy) < 0.1) {
                    cardData.vy = 0;
                } else {
                    allSettled = false;
                }
            } else {
                allSettled = false;
            }
            
            // Обмежуємо горизонтальний рух
            if (cardData.x < 5) cardData.x = 5;
            if (cardData.x > 95) cardData.x = 95;
            
            // Застосовуємо нову позицію та обертання
            cardData.element.style.left = `${cardData.x}%`;
            cardData.element.style.top = `${cardData.y}%`;
            cardData.element.style.setProperty('--rotation', `${cardData.rotation}deg`);
            cardData.element.style.transform = `rotate(${cardData.rotation}deg)`;
        });
        
        // Продовжуємо анімацію, якщо не всі карти досягли фінальної позиції
        if (!allSettled) {
            animationFrameId = requestAnimationFrame(animateFallingCards);
        }
    }
    
    // Запускаємо анімацію
    function startFallingAnimation() {
        // Скидаємо всі значення для повторної анімації
        cardsData.forEach(cardData => {
            cardData.startTime = null;
            cardData.active = false;
            cardData.y = -20 - Math.random() * 100;
            cardData.vy = 0;
            cardData.element.style.opacity = '0';
        });
        
        lastTime = 0;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(animateFallingCards);
    }
    
    // Додаємо спостерігач, щоб перезапускати анімацію, коли секція з'являється у зоні видимості
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startFallingAnimation();
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        observer.observe(fallingCardsContainer);
    }
    
    // Додаємо можливість перезапуску анімації при кліку на контейнер
    fallingCardsContainer.addEventListener('click', startFallingAnimation);
    
    // Початковий запуск анімації
    startFallingAnimation();
}

/**
* Ініціалізація анімацій при прокрутці
*/
function initScrollAnimations() {
    // Використовуємо GSAP & ScrollTrigger для анімацій, якщо вони доступні
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Анімація заголовків розділів при прокрутці
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.fromTo(title, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
        
        // Анімація карт при прокрутці
        gsap.utils.toArray('.feature-card, .author-card, .target-card').forEach((card, index) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6,
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: card.parentElement,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
        
        // Анімація розкладання карт
        const spreadSection = document.querySelector('.cards-spread-container');
        if (spreadSection) {
            const spreadCards = spreadSection.querySelectorAll('.spread-card');
            
            spreadCards.forEach((card, index) => {
                gsap.fromTo(card, 
                    { 
                        opacity: 0, 
                        scale: 0.8,
                        x: 0,
                        y: 0,
                        rotation: 0
                    },
                    { 
                        opacity: 1, 
                        scale: 1,
                        x: card.dataset.moveX || 0,
                        y: card.dataset.moveY || 0,
                        rotation: card.dataset.rotateAngle || 0,
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: spreadSection,
                            start: 'top 70%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
        }
        
        // Анімація паралакса для місії
        const missionSection = document.querySelector('.mission-section');
        if (missionSection) {
            const parallaxBg = missionSection.querySelector('.parallax-bg');
            if (parallaxBg) {
                gsap.to(parallaxBg, {
                    y: '30%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: missionSection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }
        }
        
        // Анімація сітки карт
        const cardsGridContainer = document.querySelector('.cards-grid-container');
        if (cardsGridContainer) {
            const gridCards = cardsGridContainer.querySelectorAll('.grid-card');
            
            gsap.fromTo(cardsGridContainer,
                { rotationX: 10, rotationY: -10 },
                {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: cardsGridContainer,
                        start: 'top 70%',
                        end: 'bottom 30%',
                        scrub: 1
                    }
                }
            );
            
            gridCards.forEach((card, index) => {
                gsap.fromTo(card,
                    { opacity: 0, scale: 0.8, z: -50 },
                    {
                        opacity: 1,
                        scale: 1,
                        z: 0,
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: cardsGridContainer,
                            start: 'top 70%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
        }
    } else {
        // Альтернативні анімації без GSAP
        document.querySelectorAll('.section-title, .feature-card, .author-card, .target-card, .grid-card').forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            el.classList.add('animate-on-scroll');
        });
    }
}

/**
* Ініціалізація інтерактивних карток з розкладанням
*/
function initCardSpread() {
    const spreadCards = document.querySelectorAll('.spread-card');
    
    spreadCards.forEach(card => {
        if (!card) return;
        
        // Створюємо дані для анімації
        const rotateAngle = card.dataset.rotateAngle || 0;
        const moveX = card.dataset.moveX || 0;
        const moveY = card.dataset.moveY || 0;
        const rotateAdd = card.dataset.rotateAdd || 5; // Додаткове обертання при наведенні
        
        // Додаємо ARIA-атрибути для доступності
        card.setAttribute('role', 'button');
        card.setAttribute('aria-pressed', 'false');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Інтерактивна метафорична карта');
        
        // Додаємо класи для початкового положення
        card.classList.add('spread-card-positioned');
        
        // Встановлюємо початкове трансформування
        card.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) rotate(${rotateAngle}deg)`;
        
        // Ефект при наведенні
        card.addEventListener('mouseenter', function() {
            this.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) translateZ(30px) rotate(${parseFloat(rotateAngle) + parseFloat(rotateAdd)}deg)`;
            this.style.zIndex = '10';
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) rotate(${rotateAngle}deg)`;
            this.style.zIndex = '';
            this.classList.remove('hover');
        });
        
        // Перевертання картки при кліку
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
            
            // Оновлюємо ARIA-атрибути
            this.setAttribute('aria-pressed', this.classList.contains('flipped'));
            
            // Повертаємо картку через 2 секунди
            if (this.classList.contains('flipped')) {
                setTimeout(() => {
                    this.classList.remove('flipped');
                    this.setAttribute('aria-pressed', 'false');
                }, 2000);
            }
        });
        
        // Додаємо підтримку клавіатури
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
* Покращена карусель з плавною анімацією
*/
function initImprovedCarousel() {
    const carousel = document.querySelector('.carousel-3d');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const cards = document.querySelectorAll('.carousel-card');
    
    if (!carousel || !cards.length) return;
    
    // Ініціалізуємо дані каруселі
    let currentIndex = 0;
    const totalCards = cards.length;
    let isAnimating = false;
    
    // Додаємо ARIA-атрибути для доступності
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-roledescription', 'карусель');
    carousel.setAttribute('aria-label', 'Карусель метафоричних карт');
    
    cards.forEach((card, index) => {
        card.setAttribute('role', 'group');
        card.setAttribute('aria-roledescription', 'слайд');
        card.setAttribute('aria-label', `Карта ${index + 1} з ${totalCards}`);
    });
    
    // Функція для оновлення позицій карток з плавною анімацією
    function updateCarousel(isInstant = false) {
        if (isAnimating && !isInstant) return;
        
        isAnimating = true;
        
        cards.forEach((card, index) => {
            // Розрахунок позиції відносно активної картки
            let position = index - currentIndex;
            
            // Обробка крайніх випадків для нескінченної каруселі
            if (position < -Math.floor(totalCards/2)) position += totalCards;
            if (position > Math.floor(totalCards/2)) position -= totalCards;
            
            // Видаляємо всі попередні класи позицій
            card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
            
            // Розрахунок значень для анімації з кубічною кривою
            const transitionTime = isInstant ? 0 : 0.6;
            const easing = 'cubic-bezier(0.23, 1, 0.32, 1)';
            
            card.style.transition = `transform ${transitionTime}s ${easing}, opacity ${transitionTime}s ${easing}, z-index 0s`;
            
            // Плавно анімуємо до нової позиції
            if (position === 0) {
                // Активна картка посередині
                card.classList.add('active');
                card.style.transform = 'translateX(0) translateZ(100px) rotateY(0deg) scale(1)';
                card.style.opacity = '1';
                card.style.zIndex = '5';
                
                card.setAttribute('aria-hidden', 'false');
            } 
            else if (position === -1) {
                // Картка ліворуч від активної
                card.classList.add('prev');
                card.style.transform = 'translateX(-120%) translateZ(50px) rotateY(15deg) scale(0.8)';
                card.style.opacity = '0.7';
                card.style.zIndex = '4';
                
                card.setAttribute('aria-hidden', 'true');
            } 
            else if (position === 1) {
                // Картка праворуч від активної
                card.classList.add('next');
                card.style.transform = 'translateX(120%) translateZ(50px) rotateY(-15deg) scale(0.8)';
                card.style.opacity = '0.7';
                card.style.zIndex = '4';
                
                card.setAttribute('aria-hidden', 'true');
            } 
            else if (position < -1) {
                // Карти далі ліворуч
                card.classList.add('far-prev');
                const z = Math.max(10 + position * -10, 0);
                const scale = Math.max(0.6 + position * 0.05, 0.4);
                const x = -120 + (position + 1) * -30;
                const rotateY = 15 + Math.abs(position) * 5;
                
                card.style.transform = `translateX(${x}%) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
                card.style.opacity = '0.3';
                card.style.zIndex = '3';
                
                card.setAttribute('aria-hidden', 'true');
            } 
            else {
                // Карти далі праворуч
                card.classList.add('far-next');
                const z = Math.max(10 - position * 10, 0);
                const scale = Math.max(0.6 - position * -0.05, 0.4);
                const x = 120 + (position - 1) * 30;
                const rotateY = -15 - Math.abs(position) * 5;
                
                card.style.transform = `translateX(${x}%) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
                card.style.opacity = '0.3';
                card.style.zIndex = '3';
                
                card.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Затримка для завершення анімації
        setTimeout(() => {
            isAnimating = false;
        }, 600);
        
        // Оновлюємо ARIA для скрінрідерів
        const liveRegion = carousel.querySelector('.carousel-live-region') || document.createElement('div');
        if (!carousel.querySelector('.carousel-live-region')) {
            liveRegion.className = 'carousel-live-region sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            carousel.appendChild(liveRegion);
        }
        liveRegion.textContent = `Показується карта ${currentIndex + 1} з ${totalCards}`;
    }
    
    // Додаємо можливість перетягування для більш інтерактивної каруселі
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('touchstart', dragStart, { passive: true });
    carousel.addEventListener('mouseup', dragEnd);
    carousel.addEventListener('touchend', dragEnd);
    carousel.addEventListener('mouseleave', dragEnd);
    
    function dragStart(e) {
        if (isAnimating) return;
        
        startPosition = getPositionX(e);
        isDragging = true;
        carousel.classList.add('grabbing');
    }
    
    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        carousel.classList.remove('grabbing');
        
        // Визначаємо, чи потрібно перегортати слайд
        const moveDistance = currentTranslate - prevTranslate;
        
        if (moveDistance < -100) {
            // Свайп вліво - наступна карта
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        } else if (moveDistance > 100) {
            // Свайп вправо - попередня карта
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        } else {
            // Повертаємось до поточного слайду
            updateCarousel();
        }
        
        prevTranslate = 0;
        currentTranslate = 0;
    }
    
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    // Обробники для кнопок навігації
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (isAnimating) return;
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (isAnimating) return;
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        });
    }
    
    // Додаємо підтримку свайпів для мобільних
    let touchStartX = 0;
    let touchStartY = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        if (isAnimating) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Перевіряємо, що свайп був горизонтальним
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Свайп вліво - наступна карта
                currentIndex = (currentIndex + 1) % totalCards;
            } else {
                // Свайп вправо - попередня карта
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            }
            updateCarousel();
        }
    }, { passive: true });
    
    // Додаємо підтримку клавіатури
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (isAnimating) return;
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (isAnimating) return;
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }
    });
    
    // Автоматична зміна карт
    let autoplayInterval;
    
    function startAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (!isAnimating && !isDragging) {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            }
        }, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Зупиняємо автозміну при взаємодії
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
    carousel.addEventListener('touchend', () => {
        setTimeout(startAutoplay, 1000);
    }, { passive: true });
    
    // Додаємо динамічні тіні для більш реалістичного 3D-ефекту
    cards.forEach(card => {
        // Додаємо контейнер для тіні
        const shadowElement = document.createElement('div');
        shadowElement.className = 'card-shadow';
        card.appendChild(shadowElement);
        
        // Додаємо відблиск
        const glareElement = document.createElement('div');
        glareElement.className = 'card-glare';
        card.appendChild(glareElement);
    });
    
    // Робимо функцію доступною глобально
    updateCarouselGlobal = updateCarousel;
    
    // Ініціалізуємо карусель і автозміну
    updateCarousel(true);
    startAutoplay();
}

/**
* Ініціалізація колоди карт для витягування
*/
function initCardDeck() {
    const deck = document.querySelector('.deck');
    const drawButton = document.querySelector('.draw-button');
    const topCard = document.querySelector('.deck-top');
    
    if (!deck || !drawButton || !topCard) return;
    
    // Додаємо ARIA-атрибути для доступності
    deck.setAttribute('role', 'region');
    deck.setAttribute('aria-label', 'Колода метафоричних карт');
    drawButton.setAttribute('aria-controls', 'deck-top');
    
    drawButton.addEventListener('click', function() {
        // Змінюємо стан кнопки, щоб уникнути повторних натискань
        if (this.classList.contains('disabled')) return;
        this.classList.add('disabled');
        this.setAttribute('aria-disabled', 'true');
        
        // Перевертаємо верхню картку
        topCard.classList.add('flipped');
        topCard.setAttribute('aria-live', 'polite');
        topCard.setAttribute('aria-atomic', 'true');
        
        // Анімація витягування картки з використанням requestAnimationFrame
        let startTime;
        const animationDuration = 500; // 0.5 секунди для підняття
        const returnDuration = 500; // 0.5 секунди для повернення
        const flipDuration = 500; // 0.5 секунди для перевертання
        const waitTime = 800; // 0.8 секунди очікування перед поверненням
        const rotation = -5 + Math.random() * 10; // Випадкове обертання
        
        // Функція анімації підняття картки
        function animateUp(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // Плавне піднімання з використанням кубічної кривої
            const y = -80 * easeOutCubic(progress);
            topCard.style.transform = `translateY(${y}px) rotate(${rotation * progress}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateUp);
            } else {
                // Почати перевертання
                setTimeout(() => {
                    requestAnimationFrame(animateFlip);
                }, 50);
            }
        }
        
        // Функція анімації перевертання
        function animateFlip(timestamp) {
            startTime = timestamp;
            requestAnimationFrame(function flipFrame(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / flipDuration, 1);
                
                // Перевертання з використанням синусової інтерполяції для природного руху
                const rotateY = 180 * easeInOutSine(progress);
                topCard.style.transform = `translateY(-80px) rotate(${rotation}deg) rotateY(${rotateY}deg)`;
                
                if (progress < 1) {
                    requestAnimationFrame(flipFrame);
                } else {
                    // Чекаємо, потім повертаємо картку
                    setTimeout(() => {
                        startTime = null;
                        requestAnimationFrame(animateDown);
                    }, waitTime);
                }
            });
        }
        
        // Функція анімації опускання картки
        function animateDown(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / returnDuration, 1);
            
            // Плавне повернення на місце з пружним ефектом
            const y = -80 * (1 - easeOutBack(progress));
            const rotate = rotation * (1 - easeOutQuad(progress));
            topCard.style.transform = `translateY(${y}px) rotate(${rotate}deg) rotateY(180deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateDown);
            } else {
                // Перевертаємо картку в початкове положення
                setTimeout(() => {
                    startTime = null;
                    requestAnimationFrame(animateFlipBack);
                }, waitTime);
            }
        }
        
        // Функція анімації перевертання назад
        function animateFlipBack(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / flipDuration, 1);
            
            // Перевертання назад
            const rotateY = 180 * (1 - easeInOutSine(progress));
            topCard.style.transform = `translateY(0) rotate(0) rotateY(${rotateY}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateFlipBack);
            } else {
                // Перемішуємо карти в колоді після повернення
                const deckCards = document.querySelectorAll('.deck-card:not(.deck-top)');
                deckCards.forEach(card => {
                    const randomRotate = -2 + Math.random() * 4; // Випадкове обертання
                    const randomY = Math.random() * -3; // Випадкове зміщення по Y
                    
                    card.style.transform = `translateY(${randomY}px) rotate(${randomRotate}deg)`;
                });
                
                // Додаємо ефект тряски колоди
                deck.classList.add('shake');
                setTimeout(() => {
                    deck.classList.remove('shake');
                }, 500);
                
                // Анімація закінчена, повертаємо картку в початковий стан
                topCard.classList.remove('flipped');
                
                // Дозволяємо знову натискати кнопку
                drawButton.classList.remove('disabled');
                drawButton.setAttribute('aria-disabled', 'false');
            }
        }
        
        // Функції інтерполяції для плавних анімацій
        function easeOutCubic(x) {
            return 1 - Math.pow(1 - x, 3);
        }
        
        function easeInOutSine(x) {
            return -(Math.cos(Math.PI * x) - 1) / 2;
        }
        
        function easeOutBack(x) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        }
        
        function easeOutQuad(x) {
            return 1 - (1 - x) * (1 - x);
        }
        
        // Запускаємо анімацію
        requestAnimationFrame(animateUp);
    });
}

/**
* Ініціалізація 3D сітки карт
*/
function initCardGrid() {
    const gridContainer = document.querySelector('.cards-grid-container');
    if (!gridContainer) return;
    
    const gridCards = document.querySelectorAll('.grid-card');
    if (!gridCards.length) return;
    
    // Додаємо ARIA-атрибути для доступності
    gridContainer.setAttribute('role', 'region');
    gridContainer.setAttribute('aria-label', 'Інтерактивна сітка метафоричних карт');
    
    gridCards.forEach((card, index) => {
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Метафорична карта ${index + 1}`);
        card.setAttribute('tabindex', '0');
    });
    
    // Змінні для плавної анімації
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let animationFrameId;
    
    // Додаємо ефект трансформації при русі миші
    gridContainer.addEventListener('mousemove', function(e) {
        const rect = gridContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Розрахунок кута нахилу
        targetRotateX = (mouseY / rect.height) * 10; // Максимальний кут 10 градусів
        targetRotateY = (mouseX / rect.width) * -10;
        
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateGridAnimation);
        }
    });
    
    // Функція для плавної анімації
    function updateGridAnimation() {
        // Плавне наближення до цільового кута
        currentRotateX += (targetRotateX - currentRotateX) * 0.1;
        currentRotateY += (targetRotateY - currentRotateY) * 0.1;
        
        // Застосовуємо трансформацію до контейнера
        gridContainer.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
        
        // Застосовуємо трансформацію до карток
        gridCards.forEach(card => {
            // Розрахунок позиції картки відносно центру
            const cardRect = card.getBoundingClientRect();
            const containerRect = gridContainer.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2 - containerRect.left;
            const cardCenterY = cardRect.top + cardRect.height / 2 - containerRect.top;
            
            // Розрахунок відстані від центру
            const distanceX = ((cardCenterX / containerRect.width) - 0.5) * 2;
            const distanceY = ((cardCenterY / containerRect.height) - 0.5) * 2;
            
            // Розрахунок Z-трансформації
            const zTransform = Math.abs(distanceX) + Math.abs(distanceY);
            
            // Застосовуємо трансформацію
            card.style.transform = `scale(0.95) translateZ(${30 + zTransform * 30}px)`;
        });
        
        // Продовжуємо анімацію, якщо є значна різниця
        if (Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
            animationFrameId = requestAnimationFrame(updateGridAnimation);
        } else {
            animationFrameId = null;
        }
    }
    
    // Повертаємо до початкового стану, коли миша покидає контейнер
    gridContainer.addEventListener('mouseleave', function() {
        targetRotateX = 0;
        targetRotateY = 0;
        
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateGridAnimation);
        }
        
        gridCards.forEach(card => {
            card.style.transform = 'scale(0.95) translateZ(0)';
            card.style.zIndex = '';
        });
    });
    
    // Додаємо ефект наведення для кожної картки
    gridCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateZ(50px)';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(0.95) translateZ(0)';
            this.style.zIndex = '';
        });
        
        // Додаємо підтримку клавіатури
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Анімація для фокусу з клавіатури
                this.style.transform = 'scale(1.05) translateZ(50px)';
                this.style.zIndex = '10';
                
                // Імітуємо клік
                this.click();
                
                // Повертаємо початковий стан
                setTimeout(() => {
                    this.style.transform = 'scale(0.95) translateZ(0)';
                    this.style.zIndex = '';
                }, 300);
            }
        });
    });
}

/**
* Ініціалізація паралакс-ефектів
*/
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
    
    if (!parallaxElements.length) return;
    
    // Використовуємо requestAnimationFrame для плавної анімації
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
            const offset = scrollTop * speed;
            
            requestAnimationFrame(() => {
                element.style.transform = `translateY(${offset}px)`;
            });
        });
        
        ticking = false;
    }
    
    // Оптимізуємо обробку прокрутки
    window.addEventListener('scroll', function() {
        lastScrollY = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Початкове оновлення
    updateParallax();
}

/**
* Ініціалізація контактної форми з інтеграцією Google Spreadsheets
*/
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    // Додаємо атрибути для доступності
    contactForm.setAttribute('aria-live', 'polite');
    
    // Додаємо анімацію для фокусу на полях форми
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        // Додаємо обгортку для підпису, якщо її ще немає
        const wrapper = input.parentElement;
        if (!wrapper.classList.contains('input-wrapper')) {
            const newWrapper = document.createElement('div');
            newWrapper.className = 'input-wrapper';
            input.parentElement.insertBefore(newWrapper, input);
            newWrapper.appendChild(input);
            
            // Створюємо підпис, якщо його ще немає
            if (!wrapper.querySelector('label')) {
                const label = document.createElement('label');
                label.textContent = input.placeholder || input.name;
                label.setAttribute('for', input.id || input.name);
                newWrapper.appendChild(label);
            }
        }
        
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Перевіряємо, чи є значення при завантаженні
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Обробка відправки форми до Google Spreadsheets
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валідація форми
        if (!validateForm(contactForm)) {
            return;
        }
        
        // Показуємо стан завантаження
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Відправка...';
        submitButton.disabled = true;
        
        // ID таблиці Google Sheets (буде налаштовано користувачем пізніше)
        const sheetId = contactForm.dataset.sheetId || 'YOUR_SHEET_ID';
        
        // URL для обробки форми через Google Apps Script
        const scriptUrl = `https://script.google.com/macros/s/AKfycbz_SHEET_ID_PLACEHOLDER/exec`;
        
        // Підготовка даних форми
        const formData = new FormData(contactForm);
        const queryString = new URLSearchParams(formData).toString();
        
        // Імітація відправки даних (справжня інтеграція буде додана пізніше)
        setTimeout(() => {
            // Показуємо повідомлення про успішну відправку
            const successMessage = contactForm.querySelector('.success-message');
            if (successMessage) {
                successMessage.classList.remove('hidden');
                successMessage.setAttribute('role', 'alert');
            }
            
            // Очищаємо форму
            contactForm.reset();
            formInputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
            
            // Повертаємо кнопку до початкового стану
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Приховуємо повідомлення через 5 секунд
            setTimeout(() => {
                if (successMessage) {
                    successMessage.classList.add('hidden');
                }
            }, 5000);
        }, 1500);
    });
    
    // Функція валідації форми
    function validateForm(form) {
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');
        let isValid = true;
        
        // Очищаємо попередні повідомлення про помилки
        form.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        // Валідація імені
        if (!name.value.trim()) {
            showError(name, 'Будь ласка, введіть ваше ім\'я');
            isValid = false;
        }
        
        // Валідація електронної пошти
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailPattern.test(email.value)) {
            showError(email, 'Будь ласка, введіть коректну електронну пошту');
            isValid = false;
        }
        
        // Валідація повідомлення
        if (!message.value.trim()) {
            showError(message, 'Будь ласка, введіть ваше повідомлення');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Функція для відображення помилок
    function showError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        field.parentElement.appendChild(errorElement);
        field.parentElement.classList.add('error');
        
        // Видаляємо повідомлення про помилку при редагуванні поля
        field.addEventListener('input', function() {
            errorElement.remove();
            field.parentElement.classList.remove('error');
        }, { once: true });
    }
}

/**
* Ініціалізація кнопок правових документів у футері
*/
function initLegalButtons() {
    const legalButtons = document.querySelectorAll('.modal-trigger');
    
    if (!legalButtons.length) return;
    
    legalButtons.forEach(button => {
        // Додаємо атрибути для доступності
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        
        // Додаємо обробники подій
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.dataset.modal;
            if (modalId) {
                openModal(modalId);
            }
        });
        
        // Додаємо підтримку клавіатури
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
* Ініціалізація модальних вікон
*/
function initModals() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal');
    
    if (!modalTriggers.length && !modals.length) return;
    
    // Додаємо ARIA-атрибути
    modals.forEach(modal => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        
        // Додаємо елемент для фокуса
        const focusTrap = document.createElement('div');
        focusTrap.setAttribute('tabindex', '0');
        focusTrap.style.position = 'absolute';
        focusTrap.style.opacity = '0';
        focusTrap.className = 'focus-trap';
        modal.appendChild(focusTrap.cloneNode(true));
        modal.appendChild(focusTrap);
    });
    
    // Функція для відкриття модального вікна
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Зберігаємо елемент, який мав фокус до відкриття модального вікна
        const activeElement = document.activeElement;
        modal.dataset.previouslyFocused = activeElement ? activeElement.id : '';
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        }, 10);
        document.body.classList.add('modal-open');
        
        // Встановлюємо фокус на перший елемент у модальному вікні
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        } else {
            // Якщо немає фокусованих елементів, фокусуємося на самому модальному вікні
            modal.setAttribute('tabindex', '-1');
            modal.focus();
        }
        
        // Додаємо обробку фокуса (trap focus)
        modal.addEventListener('keydown', trapFocus);
    }
    
    // Функція для закриття модального вікна
    function closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.classList.remove('modal-open');
        
        // Видаляємо обробку фокуса
        modal.removeEventListener('keydown', trapFocus);
        
        // Повертаємо фокус на елемент, який мав фокус до відкриття модального вікна
        const previouslyFocusedId = modal.dataset.previouslyFocused;
        if (previouslyFocusedId) {
            const element = document.getElementById(previouslyFocusedId);
            if (element) element.focus();
        }
    }
    
    // Функція для утримання фокуса всередині модального вікна
    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        
        const modal = e.currentTarget;
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement || document.activeElement === modal) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    // Додаємо глобальну функцію для відкриття модального вікна
    window.openModal = openModal;
    
    // Додаємо глобальну функцію для закриття модального вікна
    window.closeModal = function(modalId) {
        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        closeModal(modal);
    };
    
    // Додаємо слухачі для тригерів
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.dataset.modal;
            openModal(modalId);
        });
    });
    
    // Додаємо слухачі для кнопок закриття
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Закриття модального вікна при кліку на затемнений фон
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Закриття модального вікна при натисканні Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.open');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

/**
* Ініціалізація 3D ефектів для карток з використанням VanillaTilt
*/
function initVanillaTilt() {
    // Перевіряємо, чи завантажено бібліотеку VanillaTilt
    if (typeof VanillaTilt === 'undefined') {
        console.warn('VanillaTilt library not loaded. 3D card effects will not work.');
        return;
    }
    
    // Ініціалізуємо 3D-ефект для карток
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (tiltElements.length) {
        VanillaTilt.init(tiltElements, {
            max: 15, // максимальний нахил (в градусах)
            speed: 400, // швидкість перетворення
            glare: true, // ефект блиску
            'max-glare': 0.2, // максимальна інтенсивність блиску
            perspective: 800, // перспектива для ефекту 3D
            scale: 1.05, // збільшення при наведенні
            gyroscope: true, // використання гіроскопа на мобільних пристроях
            gyroscopeMinAngleX: -20, // мінімальний кут нахилу X для гіроскопа
            gyroscopeMaxAngleX: 20, // максимальний кут нахилу X для гіроскопа
            gyroscopeMinAngleY: -20, // мінімальний кут нахилу Y для гіроскопа
            gyroscopeMaxAngleY: 20, // максимальний кут нахилу Y для гіроскопа
            easing: "cubic-bezier(.03,.98,.52,.99)", // функція пом'якшення
            reset: true, // скидати трансформацію при виході миші
            'full-page-listening': false, // прослуховування всієї сторінки, а не лише даного елементу
        });
    }
}

/**
* Ініціалізація фонових частинок з використанням Particles.js
*/
function initParticles() {
    // Перевіряємо, чи завантажено бібліотеку particlesJS
    if (typeof particlesJS === 'undefined') {
        console.warn('Particles.js library not loaded. Background particles will not work.');
        return;
    }
    
    // Ініціалізуємо фонові частинки для hero-секції
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 70,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#f5f5f5"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.3,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#f5f5f5",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

/**
 * Приховує логотип-зображення, залишаючи тільки текст "Roots & Wings"
 */
function hideLogoImage() {
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.style.display = 'none';
        
        // Збільшуємо шрифт тексту логотипу для більш виразного відображення
        const logoText = document.querySelector('.logo-text');
        if (logoText) {
            logoText.style.fontSize = '1.8rem';
            logoText.style.fontWeight = '700';
        }
    }
}

/**
 * Підганяє розміри карток у сітці під розміри зображень
 */
function adjustCardSizeToImages() {
    const gridCards = document.querySelectorAll('.grid-card');
    
    gridCards.forEach(card => {
        // Знаходимо зображення всередині картки
        const cardImage = card.querySelector('img');
        if (cardImage) {
            // Після завантаження зображення налаштовуємо розмір картки
            if (cardImage.complete) {
                adjustCardToImage(card, cardImage);
            } else {
                cardImage.onload = () => adjustCardToImage(card, cardImage);
            }
        }
    });
    
    function adjustCardToImage(card, image) {
        // Отримуємо природні розміри зображення
        const imageRatio = image.naturalWidth / image.naturalHeight;
        
        // Встановлюємо фіксоване співвідношення сторін для картки
        card.style.aspectRatio = imageRatio;
        
        // Переконуємося, що зображення поміщається повністю
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.objectFit = 'contain'; // Забезпечуємо повне відображення без обрізання
    }
}

// Ініціалізуємо слухачі подій для вікна
window.addEventListener('load', function() {
    // Перевіряємо, чи вже було завантажено сторінку
    if (document.body.classList.contains('loaded')) {
        // Якщо так, запускаємо початкові анімації
        startInitialAnimations();
    }
});

// Оптимізація для обробки зміни розміру вікна
window.addEventListener('resize', debounce(function() {
    // Оновлюємо карусель карт
    if (typeof updateCarouselGlobal === 'function') {
        updateCarouselGlobal();
    }
    
    // Оновлюємо сітку карт для адаптації до нового розміру екрану
    const gridContainer = document.querySelector('.cards-grid-container');
    if (gridContainer) {
        gridContainer.style.transform = 'rotateX(0) rotateY(0)';
        
        const gridCards = gridContainer.querySelectorAll('.grid-card');
        gridCards.forEach(card => {
            card.style.transform = 'scale(0.95) translateZ(0)';
        });
    }
    
    // Перевіряємо видимість елементів меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');
    
    if (mobileMenuToggle && desktopNav) {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            desktopNav.setAttribute('aria-hidden', 'true');
            desktopNav.style.display = 'none';
            mobileMenuToggle.style.display = 'block';
        } else {
            desktopNav.removeAttribute('aria-hidden');
            desktopNav.style.display = 'flex';
            mobileMenuToggle.style.display = 'none';
            
            // Закриваємо мобільне меню, якщо воно відкрите
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
                mobileMenuToggle.classList.remove('active');
            }
        }
    }
    
    // Підганяємо розміри карток при зміні розмірів вікна
    adjustCardSizeToImages();
}, 150));

/**
 * Функція debounce для оптимізації обробки частих подій
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Експортуємо функцію updateCarousel у глобальну область видимості
window.updateCarousel = function() {
    if (typeof updateCarouselGlobal === 'function') {
        updateCarouselGlobal();
    }
};