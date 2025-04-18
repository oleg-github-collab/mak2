/**
 * Головний JavaScript файл для сайту Roots & Wings
 * Метафоричні асоціативні карти
 */

// Глобальна змінна для функції оновлення каруселі
let updateCarouselGlobal;

// Очікуємо завантаження DOM перед ініціалізацією скриптів
document.addEventListener('DOMContentLoaded', function() {
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
        
        // Ініціалізуємо плавну прокрутку для якорів - ВИПРАВЛЕНО ДЛЯ КНОПКИ "ДЛЯ КОГО"
        initSmoothScroll();
        
        // Ініціалізуємо анімації
        initAnimations();
        
        // Ініціалізуємо інтерактивні компоненти
        initCardSpread();
        
        // ВИПРАВЛЕНО - Покращена карусель з переворотом карт
        initImprovedCarousel();
        
        initCardDeck();
        initCardGrid();
        
        // Ініціалізуємо паралакс-ефекти
        initParallax();
        
        // Ініціалізуємо контактну форму
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
        
        // ВИПРАВЛЕНО - Покращені падаючі карти
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
        const interactiveElements = document.querySelectorAll('a, button, .card, .interactive, input, textarea, .cursor-hover-trigger, .spread-card, .carousel-card, .grid-card, .deck-card, .draw-button, .carousel-prev, .carousel-next, .modal-close, .author-photo, .floating-card, .legal-button');
        
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
    // Приховуємо стандартну навігацію на мобільних пристроях
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
* Плавна прокрутка для якірних посилань - ВИПРАВЛЕНО ДЛЯ КНОПКИ "ДЛЯ КОГО"
*/
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Виводимо інформацію в консоль для відлагодження
            console.log(`Клікнуто на посилання з href=${targetId}`);
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                console.warn(`Елемент з id=${targetId} не знайдено`);
                return;
            }
            
            // Отримуємо зміщення з урахуванням висоти хедера
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            console.log(`Висота хедера: ${headerHeight}px`);
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            console.log(`Прокручуємо до позиції: ${targetPosition}px`);
            
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
    
    // Додаємо анімацію карткам, що падають
    initFallingCards();
    
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
* Ініціалізація карток, що падають - СТАРА ВЕРСІЯ
*/
function initFallingCards() {
    const fallingCardsContainer = document.querySelector('.falling-cards-container');
    const fallingCards = document.querySelectorAll('.falling-card');
    
    if (!fallingCardsContainer || !fallingCards.length) return;
    
    // Отримуємо висоту контейнера
    const containerHeight = fallingCardsContainer.offsetHeight || window.innerHeight;
    
    fallingCards.forEach((card, index) => {
        // Встановлюємо випадкові початкові значення для кожної карти
        const startDelay = Math.random() * 5; // Випадкова затримка початку анімації
        const fallDuration = 3 + Math.random() * 4; // Випадкова тривалість падіння
        const horizontalPosition = Math.random() * 100; // Випадкова горизонтальна позиція
        const rotateStart = -30 + Math.random() * 60; // Випадковий початковий кут
        const rotateEnd = rotateStart + (-20 + Math.random() * 40); // Випадковий кінцевий кут
        
        // Використовуємо CSS-змінні для анімації
        card.style.setProperty('--fall-delay', `${startDelay}s`);
        card.style.setProperty('--fall-duration', `${fallDuration}s`);
        card.style.setProperty('--horizontal-position', `${horizontalPosition}%`);
        card.style.setProperty('--rotate-start', `${rotateStart}deg`);
        card.style.setProperty('--rotate-end', `${rotateEnd}deg`);
        card.style.setProperty('--container-height', `${containerHeight}px`);
        
        // Додаємо клас для запуску анімації
        card.classList.add('animate-fall');
        
        // Додаємо атрибути для доступності
        card.setAttribute('aria-label', 'Декоративна картка, що падає');
        card.setAttribute('role', 'img');
    });
}

/**
 * ВИПРАВЛЕНО - Покращена анімація падаючих карт
 */
function initEnhancedFallingCards() {
    const fallingCardsSection = document.querySelector('.falling-cards');
    const fallingCardsContainer = document.querySelector('.falling-cards-container');
    const fallingCards = document.querySelectorAll('.smooth-falling');
    
    if (!fallingCardsContainer || !fallingCards.length) return;
    
    // Забезпечуємо правильну структуру карт для плавного падіння
    fallingCards.forEach(card => {
        // Переконуємося, що картка має правильні класи та атрибути
        card.classList.add('enhanced');
        
        // Отримуємо значення з data-атрибутів або використовуємо стандартні
        const delay = parseFloat(card.dataset.fallingDelay) || Math.random() * 2;
        const rotateStart = parseFloat(card.dataset.rotateStart) || (-15 + Math.random() * 30);
        const rotateEnd = parseFloat(card.dataset.rotateEnd) || (-10 + Math.random() * 20);
        const xPosition = parseFloat(card.dataset.xPosition) || (10 + Math.random() * 80);
        const yPosition = parseFloat(card.dataset.yPosition) || (10 + Math.random() * 80);
        
        // Встановлюємо початкові стилі
        card.style.opacity = '0';
        card.style.transform = `translateX(${xPosition}%) translateY(-100px) rotate(${rotateStart}deg)`;
        card.style.transition = `all 1.5s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`;
        
        // Встановлюємо позицію для карт
        card.style.left = `${xPosition}%`;
        card.style.top = `${yPosition}%`;
    });
    
    // Функція для анімації падіння карт
    function animateFallingCards() {
        fallingCards.forEach(card => {
            // Отримуємо значення з data-атрибутів
            const rotateEnd = parseFloat(card.dataset.rotateEnd) || (-10 + Math.random() * 20);
            
            // Анімація падіння
            card.style.opacity = '1';
            card.style.transform = `translateX(0) translateY(0) rotate(${rotateEnd}deg)`;
        });
    }
    
    // Функція для скидання анімації
    function resetFallingCards() {
        fallingCards.forEach(card => {
            // Отримуємо значення з data-атрибутів
            const delay = parseFloat(card.dataset.fallingDelay) || Math.random() * 2;
            const rotateStart = parseFloat(card.dataset.rotateStart) || (-15 + Math.random() * 30);
            const xPosition = parseFloat(card.dataset.xPosition) || (10 + Math.random() * 80);
            
            // Скидаємо стилі
            card.style.opacity = '0';
            card.style.transform = `translateX(${xPosition}%) translateY(-100px) rotate(${rotateStart}deg)`;
        });
    }
    
    // Запускаємо анімацію при завантаженні сторінки
    setTimeout(animateFallingCards, 500);
    
    // Створюємо спостерігач для перезапуску анімації при прокрутці
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Перезапускаємо анімацію, коли секція потрапляє у поле зору
                    resetFallingCards();
                    setTimeout(animateFallingCards, 100);
                } else {
                    // Скидаємо анімацію, коли секція виходить з поля зору
                    resetFallingCards();
                }
            });
        }, {
            threshold: 0.1, // Запускаємо, коли хоча б 10% секції видно
            rootMargin: '0px 0px -10% 0px' // Трохи зміщуємо межу спрацьовування
        });
        
        if (fallingCardsSection) {
            observer.observe(fallingCardsSection);
        } else if (fallingCardsContainer) {
            observer.observe(fallingCardsContainer);
        }
    }
    
    // Додаємо обробник для перезапуску анімації при натисканні на контейнер
    fallingCardsContainer.addEventListener('click', () => {
        resetFallingCards();
        setTimeout(animateFallingCards, 100);
    });
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
* ВИПРАВЛЕНО - Покращена карусель з переворотом карт
*/
function initImprovedCarousel() {
    const carousel = document.querySelector('.carousel-3d');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const cards = document.querySelectorAll('.flippable-card');
    
    if (!carousel || !cards.length) return;
    
    // Ініціалізуємо дані каруселі
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Додаємо ARIA-атрибути для доступності
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-roledescription', 'карусель');
    carousel.setAttribute('aria-label', 'Карусель метафоричних карт');
    
    if (prevBtn) {
        prevBtn.setAttribute('aria-label', 'Попередня карта');
        prevBtn.setAttribute('aria-controls', 'carousel-3d');
    }
    
    if (nextBtn) {
        nextBtn.setAttribute('aria-label', 'Наступна карта');
        nextBtn.setAttribute('aria-controls', 'carousel-3d');
    }
    
    cards.forEach((card, index) => {
        card.setAttribute('role', 'group');
        card.setAttribute('aria-roledescription', 'слайд');
        card.setAttribute('aria-label', `Карта ${index + 1} з ${totalCards}`);
        
        // Переконуємося, що у кожної карти є внутрішній елемент для перевороту
        const cardInner = card.querySelector('.card-inner');
        if (!cardInner) {
            console.warn(`Карта #${index} не має елемента .card-inner для перевороту`);
        }
    });
    
    // Функція для оновлення позицій карток з переворотом неактивних карт
    function updateCarousel() {
        cards.forEach((card, index) => {
            // Розрахунок позиції відносно поточного індексу
            const cardIndex = parseInt(card.dataset.index || '0');
            const position = (cardIndex - currentIndex + totalCards) % totalCards;
            
            // Видалення попередніх класів
            card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'back');
            
            // Внутрішній елемент для перевороту
            const cardInner = card.querySelector('.card-inner');
            
            // Установка нових класів залежно від позиції
            if (position === 0) {
                // Активна карта - показуємо лицеву сторону
                card.classList.add('active');
                if (cardInner) cardInner.style.transform = 'rotateY(0)';
                card.style.transform = 'translateZ(100px) scale(1)';
                card.style.opacity = '1';
                card.style.zIndex = '10';
                
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-hidden', 'false');
            } else if (position === 1 || position === totalCards - 1) {
                // Карти поруч (ліва/права) - показуємо обкладинку
                const direction = position === 1 ? 'next' : 'prev';
                const xOffset = position === 1 ? '120px' : '-120px';
                card.classList.add(direction);
                
                // Перевертаємо карту, щоб показати обкладинку
                if (cardInner) cardInner.style.transform = 'rotateY(180deg)';
                card.style.transform = `translateX(${xOffset}) translateZ(50px) rotateY(0) scale(0.9)`;
                card.style.opacity = '0.9';
                card.style.zIndex = '5';
                
                card.setAttribute('tabindex', '-1');
                card.setAttribute('aria-hidden', 'true');
            } else {
                // Інші карти - показуємо обкладинку та розміщуємо далі
                const direction = position < totalCards / 2 ? '1' : '-1';
                const xOffset = position < totalCards / 2 ? '180px' : '-180px';
                card.classList.add('back');
                
                // Перевертаємо карту, щоб показати обкладинку
                if (cardInner) cardInner.style.transform = 'rotateY(180deg)';
                card.style.transform = `translateX(${xOffset}) translateZ(-50px) rotateY(0) scale(0.8)`;
                card.style.opacity = '0.7';
                card.style.zIndex = '1';
                
                card.setAttribute('tabindex', '-1');
                card.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Оновлюємо ARIA для скрінрідерів
        carousel.setAttribute('aria-live', 'polite');
        const liveRegion = carousel.querySelector('.carousel-live-region') || document.createElement('div');
        if (!carousel.querySelector('.carousel-live-region')) {
            liveRegion.className = 'carousel-live-region sr-only';
            carousel.appendChild(liveRegion);
        }
        liveRegion.textContent = `Картка ${currentIndex + 1} з ${totalCards}`;
    }
    
    // Робимо функцію доступною глобально
    updateCarouselGlobal = updateCarousel;
    
    // Обробники для кнопок навігації
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        });
    }
    
    // Клавіатурна навігація
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }
    });
    
    // Обробка дотику для мобільних
    let touchStartX = 0;
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        // Визначаємо свайп з порогом
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Свайп вліво - наступна картка
                currentIndex = (currentIndex + 1) % totalCards;
            } else {
                // Свайп вправо - попередня картка
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            }
            updateCarousel();
        }
    }, { passive: true });
    
    // Клік на картку для активації
    cards.forEach((card) => {
        card.addEventListener('click', function() {
            const cardIndex = parseInt(this.dataset.index || '0');
            if (cardIndex !== currentIndex) {
                currentIndex = cardIndex;
                updateCarousel();
            }
        });
    });
    
    // Ініціалізуємо карусель на старті
    updateCarousel();
    
    // Автоматична зміна карток
    let autoplayInterval;
    
    function startAutoplay() {
        clearInterval(autoplayInterval); // Для уникнення дублювання інтервалів
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Зупиняємо/запускаємо автопрокрутку при взаємодії
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
    carousel.addEventListener('touchend', function() {
        // Невелика затримка перед відновленням автопрокрутки
        setTimeout(startAutoplay, 1000);
    }, { passive: true });
    
    // Запускаємо автоматичну прокрутку
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
            
            // Плавне піднімання
            const y = -80 * progress;
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
                
                // Перевертання
                const rotateY = 180 * progress;
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
            
            // Плавне повернення на місце
            const y = -80 * (1 - progress);
            const rotate = rotation * (1 - progress);
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
            const rotateY = 180 * (1 - progress);
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
                
                // Анімація закінчена, повертаємо картку в початковий стан
                topCard.classList.remove('flipped');
                
                // Дозволяємо знову натискати кнопку
                drawButton.classList.remove('disabled');
                drawButton.setAttribute('aria-disabled', 'false');
            }
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
* Ініціалізація контактної форми
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
    
    // Додаємо повідомлення про валідацію
    formInputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            const errorMessage = input.validationMessage;
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            
            // Видаляємо старі повідомлення
            const oldError = input.parentElement.querySelector('.error-message');
            if (oldError) oldError.remove();
            
            input.parentElement.appendChild(errorElement);
            input.parentElement.classList.add('error');
        });
        
        // Видаляємо повідомлення про помилку при зміні значення
        input.addEventListener('input', function() {
            const errorElement = this.parentElement.querySelector('.error-message');
            if (errorElement) errorElement.remove();
            this.parentElement.classList.remove('error');
        });
    });
    
    // Обробка відправки форми
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Перевіряємо валідність форми
        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const message = contactForm.querySelector('#message');
        
        let isValid = true;
        
        // Перевірка імені
        if (!name || !name.value.trim()) {
            if (name) {
                name.parentElement.classList.add('error');
                name.setCustomValidity('Будь ласка, введіть своє ім\'я');
                name.reportValidity();
            }
            isValid = false;
        } else {
            name.setCustomValidity('');
            name.parentElement.classList.remove('error');
        }
        
        // Перевірка email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !email.value.trim() || !emailPattern.test(email.value)) {
            if (email) {
                email.parentElement.classList.add('error');
                email.setCustomValidity('Будь ласка, введіть коректну електронну адресу');
                email.reportValidity();
            }
            isValid = false;
        } else {
            email.setCustomValidity('');
            email.parentElement.classList.remove('error');
        }
        
        // Перевірка повідомлення
        if (!message || !message.value.trim()) {
            if (message) {
                message.parentElement.classList.add('error');
                message.setCustomValidity('Будь ласка, введіть повідомлення');
                message.reportValidity();
            }
            isValid = false;
        } else {
            message.setCustomValidity('');
            message.parentElement.classList.remove('error');
        }
        
        // Якщо форма валідна, симулюємо відправку
        if (isValid) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (!submitButton) return;
            
            const originalText = submitButton.textContent;
            
            // Змінюємо текст кнопки
            submitButton.textContent = 'Відправка...';
            submitButton.disabled = true;
            
            // Симулюємо відправку
            setTimeout(() => {
                submitButton.textContent = 'Відправлено!';
                
                // Показуємо повідомлення про успіх
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.setAttribute('role', 'alert');
                successMessage.textContent = 'Ваше повідомлення успішно відправлено. Ми зв\'яжемося з вами найближчим часом.';
                
                contactForm.appendChild(successMessage);
                
                // Очищаємо форму
                contactForm.reset();
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
                
                // Повертаємо оригінальний текст кнопки
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    
                    // Видаляємо повідомлення про успіх
                    successMessage.remove();
                }, 3000);
            }, 1500);
        }
    });
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
    
    // Завантаження вмісту модальних вікон (для правових документів)
    loadModalContent();
}

/**
* Завантаження текстового вмісту для модальних вікон
*/
function loadModalContent() {
    const privacyPolicy = document.querySelector('#privacy-policy .text-container');
    const paymentTerms = document.querySelector('#payment-terms .text-container');
    const deliveryTerms = document.querySelector('#delivery-terms .text-container');
    const termsOfUse = document.querySelector('#terms-of-use .text-container');
    
    if (privacyPolicy) {
        privacyPolicy.innerHTML = `
            <h3>Політика конфіденційності</h3>
            <p>Остання редакція: 16 квітня 2025 року</p>
            
            <h4>1. Вступ</h4>
            <p>Дякуємо, що вибрали продукцію "Коріння та Крила". Ми серйозно ставимося до вашої конфіденційності та захисту ваших особистих даних. Ця політика конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо вашу особисту інформацію.</p>
            
            <h4>2. Які дані ми збираємо</h4>
            <p>Ми можемо збирати наступні типи інформації:</p>
            <ul>
                <li>Особиста ідентифікаційна інформація (ім'я, електронна адреса, телефон, поштова адреса)</li>
                <li>Інформація про замовлення та транзакції</li>
                <li>Технічна інформація (IP-адреса, тип браузера, інформація про пристрій)</li>
                <li>Інформація про використання веб-сайту та взаємодію з нашими продуктами</li>
            </ul>
            
            <h4>3. Як ми використовуємо ваші дані</h4>
            <p>Ми використовуємо вашу інформацію, щоб:</p>
            <ul>
                <li>Обробляти та доставляти ваші замовлення</li>
                <li>Керувати вашим обліковим записом</li>
                <li>Надсилати вам важливі повідомлення та оновлення</li>
                <li>Покращувати наші продукти та послуги</li>
                <li>Надсилати маркетингові повідомлення (за вашою згодою)</li>
            </ul>
            
            <h4>4. Захист даних</h4>
            <p>Ми впроваджуємо відповідні технічні та організаційні заходи для захисту ваших даних від несанкціонованого доступу, втрати або знищення.</p>
            
            <h4>5. Ваші права</h4>
            <p>Ви маєте право:</p>
            <ul>
                <li>Доступу до своїх персональних даних</li>
                <li>Виправлення неточних даних</li>
                <li>Видалення своїх даних</li>
                <li>Обмеження обробки своїх даних</li>
                <li>Заперечення проти обробки своїх даних</li>
                <li>Перенесення даних</li>
            </ul>
            
            <h4>6. Контактна інформація</h4>
            <p>Якщо у вас є запитання щодо цієї політики конфіденційності або ви хочете реалізувати свої права, зв'яжіться з нами за адресою: info@rootsandwings.com</p>
        `;
    }
    
    if (paymentTerms) {
        paymentTerms.innerHTML = `
            <h3>Умови оплати</h3>
            <p>Остання редакція: 16 квітня 2025 року</p>
            
            <h4>1. Способи оплати</h4>
            <p>Ми приймаємо наступні способи оплати:</p>
            <ul>
                <li>Банківські картки (Visa, MasterCard)</li>
                <li>Банківський переказ</li>
                <li>Оплата через платіжні системи (PayPal, Apple Pay, Google Pay)</li>
                <li>Накладений платіж (при доставці)</li>
            </ul>
            
            <h4>2. Процес оплати</h4>
            <p>При оформленні замовлення ви зможете вибрати зручний для вас спосіб оплати. При оплаті банківською карткою, ви будете перенаправлені на захищену сторінку платіжної системи, де вам потрібно буде ввести дані своєї картки.</p>
            
            <h4>3. Безпека платежів</h4>
            <p>Всі платежі проходять через захищені канали зв'язку з використанням протоколу SSL. Ми не зберігаємо дані ваших банківських карт.</p>
            
            <h4>4. Термін оплати</h4>
            <p>При виборі способу оплати "Банківський переказ" замовлення зберігається в системі протягом 3 банківських днів. Якщо протягом цього терміну оплата не надходить, замовлення автоматично скасовується.</p>
            
            <h4>5. Повернення коштів</h4>
            <p>У випадку скасування замовлення або повернення товару, кошти повертаються на той же рахунок, з якого була здійснена оплата. Термін повернення коштів залежить від способу оплати та зазвичай становить від 3 до 14 банківських днів.</p>
            
            <h4>6. Валюта розрахунків</h4>
            <p>Всі розрахунки на сайті проводяться в національній валюті України - гривні (UAH).</p>
            
            <h4>7. Чеки та документи</h4>
            <p>Після оплати замовлення ви отримаєте електронний чек на вказану вами електронну пошту. За запитом ми можемо надати повний пакет бухгалтерських документів.</p>
        `;
    }
    
    if (deliveryTerms) {
        deliveryTerms.innerHTML = `
            <h3>Умови доставки</h3>
            <p>Остання редакція: 16 квітня 2025 року</p>
            
            <h4>1. Способи доставки</h4>
            <p>Ми пропонуємо наступні варіанти доставки:</p>
            <ul>
                <li>Нова Пошта (відділення, поштомат, адресна доставка)</li>
                <li>Укрпошта</li>
                <li>Самовивіз з нашого офісу в м. Київ</li>
                <li>Міжнародна доставка (за окремим тарифом)</li>
            </ul>
            
            <h4>2. Термін доставки</h4>
            <p>Термін доставки залежить від обраного способу:</p>
            <ul>
                <li>Нова Пошта - 1-3 робочих дні після відправлення</li>
                <li>Укрпошта - 3-7 робочих днів після відправлення</li>
                <li>Самовивіз - в день оплати (при наявності товару на складі)</li>
                <li>Міжнародна доставка - 7-21 день (залежно від країни)</li>
            </ul>
            
            <h4>3. Вартість доставки</h4>
            <p>Вартість доставки розраховується автоматично при оформленні замовлення і залежить від обраного способу доставки, ваги та габаритів замовлення.</p>
            <p>При замовленні на суму від 2000 грн доставка по Україні безкоштовна (крім адресної доставки).</p>
            
            <h4>4. Відстеження замовлення</h4>
            <p>Після відправлення замовлення ви отримаєте номер для відстеження на вказану вами електронну пошту. Ви можете відстежити статус доставки на сайті відповідної служби доставки.</p>
            
            <h4>5. Отримання замовлення</h4>
            <p>Для отримання замовлення необхідно пред'явити документ, що посвідчує особу, та номер замовлення або номер ТТН.</p>
            
            <h4>6. Перевірка товару при отриманні</h4>
            <p>Ми рекомендуємо перевіряти цілісність упаковки та відповідність товару при отриманні. У разі виявлення пошкоджень або невідповідностей, будь ласка, зафіксуйте це в присутності представника служби доставки.</p>
            
            <h4>7. Затримки доставки</h4>
            <p>У випадку форс-мажорних обставин термін доставки може бути збільшений. У такому випадку ми повідомимо вас про це.</p>
        `;
    }
    
    if (termsOfUse) {
        termsOfUse.innerHTML = `
            <h3>Умови використання</h3>
            <p>Остання редакція: 16 квітня 2025 року</p>
            
            <h4>1. Загальні положення</h4>
            <p>Ці умови використання регулюють ваше використання веб-сайту та продукції "Коріння та Крила". Використовуючи наш веб-сайт або купуючи нашу продукцію, ви погоджуєтеся з цими умовами.</p>
            
            <h4>2. Інтелектуальна власність</h4>
            <p>Весь вміст веб-сайту, включаючи тексти, графіку, логотипи, зображення, аудіо-кліпи, цифрові завантаження, та програмне забезпечення, є власністю компанії або її постачальників вмісту і захищений законами України та міжнародними законами про авторське право.</p>
            
            <h4>3. Використання продукції</h4>
            <p>Метафоричні асоціативні карти "Коріння та Крила" призначені для особистого використання або для використання у професійній практиці психологами, коучами та іншими фахівцями у відповідності до їх професійної етики та кваліфікації.</p>
            <p>Карти не призначені для діагностики або лікування психічних розладів і не можуть замінити професійну психологічну або медичну допомогу.</p>
            
            <h4>4. Обмеження відповідальності</h4>
            <p>Ми не несемо відповідальності за будь-які прямі, непрямі, випадкові, особливі або штрафні збитки, що виникають в результаті використання або неможливості використання наших продуктів або послуг.</p>
            
            <h4>5. Відгуки та коментарі</h4>
            <p>Коли ви залишаєте відгуки, коментарі або інший контент на нашому веб-сайті, ви надаєте нам право використовувати, відтворювати, змінювати, адаптувати, публікувати, перекладати, створювати похідні роботи, розповсюджувати та відображати такий контент у всьому світі в будь-яких ЗМІ.</p>
            
            <h4>6. Зміни умов</h4>
            <p>Ми можемо оновлювати ці умови використання час від часу. Продовжуючи використовувати наш веб-сайт після внесення змін, ви приймаєте нові умови.</p>
            
            <h4>7. Контактна інформація</h4>
            <p>Якщо у вас є питання щодо цих умов, будь ласка, зв'яжіться з нами за адресою: info@rootsandwings.com</p>
        `;
    }
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
    const tiltElements = document.querySelectorAll('.feature-card, .grid-card, .target-card, .carousel-card:not(.active)');
    
    VanillaTilt.init(tiltElements, {
        max: 15, // максимальний нахил (в градусах)
        speed: 300, // швидкість перетворення
        glare: true, // ефект блиску
        'max-glare': 0.2, // максимальна інтенсивність блиску
        scale: 1.05, // збільшення при наведенні
        transition: true, // плавне перетворення
        gyroscope: true, // використання гіроскопа на мобільних пристроях
        gyroscopeMinAngleX: -15, // мінімальний кут нахилу для гіроскопа по осі X
        gyroscopeMaxAngleX: 15, // максимальний кут нахилу для гіроскопа по осі X
        gyroscopeMinAngleY: -15, // мінімальний кут нахилу для гіроскопа по осі Y
        gyroscopeMaxAngleY: 15 // максимальний кут нахилу для гіроскопа по осі Y
    });
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
    
    // Оновлюємо контейнер падаючих карт
    const fallingCardsContainer = document.querySelector('.falling-cards-container');
    if (fallingCardsContainer) {
        // Повторно ініціалізуємо падаючі карти при зміні розміру
        initEnhancedFallingCards();
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