/**
 * Головний JavaScript файл для сайту Roots & Wings
 * Метафоричні асоціативні карти
 */

// Очікуємо завантаження DOM перед ініціалізацією скриптів
document.addEventListener('DOMContentLoaded', function() {
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
    initCardsCarousel();
    initCardDeck();
    initCardGrid();
    initFallingCards();
    
    // Ініціалізуємо паралакс-ефекти
    initParallax();
    
    // Ініціалізуємо контактну форму
    initContactForm();
    
    // Ініціалізуємо кнопку "повернутися нагору"
    initBackToTop();
    
    // Ініціалізуємо модальні вікна
    initModals();
  });
  
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
        
        // Оновлюємо положення курсора при русі миші
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
            
            if (cursorText) {
                cursorText.style.left = e.clientX + 'px';
                cursorText.style.top = e.clientY + 'px';
            }
        });
        
        // Додаємо ефект при наведенні на інтерактивні елементи
        const interactiveElements = document.querySelectorAll('a, button, .card, .interactive, input, textarea, .cursor-hover-trigger, .spread-card, .carousel-card, .grid-card, .deck-card, .draw-button, .carousel-prev, .carousel-next, .modal-close, .author-photo, .floating-card');
        
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
    
    if (!menuToggle || !mobileMenu) return;
    
    // Перемикання меню
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });
    
    // Закриття меню
    if (menuClose) {
        menuClose.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Закриття меню при натисканні на посилання
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    });
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
    
    // Перевірка при прокрутці
    window.addEventListener('scroll', checkScroll);
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
            if (!targetElement) return;
            
            // Отримуємо зміщення з урахуванням висоти хедера
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Прокручуємо до цілі
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
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
    });
    
    // Перевірка положення прокрутки при прокрутці
    window.addEventListener('scroll', checkScrollPosition);
    
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
            splitHtml += `<span class="word">`;
            
            // Розділяємо за символами
            Array.from(word).forEach((char, charIndex) => {
                splitHtml += `<span class="char" style="transition-delay: ${(wordIndex * 0.05) + (charIndex * 0.03)}s">${char}</span>`;
            });
            
            splitHtml += `</span> `;
        });
        
        element.innerHTML = splitHtml;
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
        
        // Встановлюємо стилі анімації
        card.style.animation = `floatingAnimation${index} ${duration}s ease-in-out ${delay}s infinite alternate`;
        
        // Додаємо keyframes для анімації
        const styleSheet = document.styleSheets[0];
        const keyframes = `
            @keyframes floatingAnimation${index} {
                0% {
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    transform: translateY(${translateY}px) rotate(${rotate}deg);
                }
            }
        `;
        
        try {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        } catch (error) {
            // Якщо не вдалося додати через insertRule, створюємо стиль
            const styleElement = document.createElement('style');
            styleElement.textContent = keyframes;
            document.head.appendChild(styleElement);
        }
    });
  }
  
  /**
  * Ініціалізація карток, що падають
  */
  function initFallingCards() {
    const fallingCardsContainer = document.querySelector('.falling-cards-container');
    const fallingCards = document.querySelectorAll('.falling-card');
    
    if (!fallingCardsContainer || !fallingCards.length) return;
    
    fallingCards.forEach((card, index) => {
        // Встановлюємо випадкові початкові значення для кожної карти
        const startDelay = Math.random() * 5; // Випадкова затримка початку анімації
        const fallDuration = 3 + Math.random() * 4; // Випадкова тривалість падіння
        const horizontalPosition = Math.random() * 100; // Випадкова горизонтальна позиція
        const rotateStart = -30 + Math.random() * 60; // Випадковий початковий кут
        const rotateEnd = rotateStart + (-20 + Math.random() * 40); // Випадковий кінцевий кут
        
        // Встановлюємо стилі карти
        card.style.left = `${horizontalPosition}%`;
        card.style.animationDelay = `${startDelay}s`;
        card.style.animationDuration = `${fallDuration}s`;
        card.style.setProperty('--rotate-start', `${rotateStart}deg`);
        card.style.setProperty('--rotate-end', `${rotateEnd}deg`);
        
        // Додаємо анімацію падіння
        const keyframes = `
            @keyframes fallAnimation${index} {
                0% {
                    transform: translateY(-100%) rotate(${rotateStart}deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(${fallingCardsContainer.offsetHeight + 100}px) rotate(${rotateEnd}deg);
                    opacity: 0;
                }
            }
        `;
        
        try {
            const styleSheet = document.styleSheets[0];
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            
            // Застосовуємо анімацію
            card.style.animation = `fallAnimation${index} ${fallDuration}s linear ${startDelay}s infinite`;
        } catch (error) {
            // Якщо не вдалося додати через insertRule, створюємо стиль
            const styleElement = document.createElement('style');
            styleElement.textContent = keyframes;
            document.head.appendChild(styleElement);
            
            // Застосовуємо анімацію
            card.style.animation = `fallAnimation${index} ${fallDuration}s linear ${startDelay}s infinite`;
        }
    });
  }
  
  /**
  * Ініціалізація анімацій при прокрутці
  */
  function initScrollAnimations() {
    // Використовуємо GSAP & ScrollTrigger для анімацій
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
    }
  }
  
  /**
  * Ініціалізація інтерактивних карток з розкладанням
  */
  function initCardSpread() {
    const spreadCards = document.querySelectorAll('.spread-card');
    
    spreadCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const rotateAngle = card.dataset.rotateAngle || 0;
            const moveX = card.dataset.moveX || 0;
            const moveY = card.dataset.moveY || 0;
            const rotateAdd = card.dataset.rotateAdd || 0;
            
            // Додаємо "підйом" картки і додаткове обертання при наведенні
            this.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) translateZ(30px) rotate(${parseFloat(rotateAngle) + parseFloat(rotateAdd)}deg)`;
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            const rotateAngle = card.dataset.rotateAngle || 0;
            const moveX = card.dataset.moveX || 0;
            const moveY = card.dataset.moveY || 0;
            
            // Повертаємо картку у початкове положення
            this.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) rotate(${rotateAngle}deg)`;
            this.style.zIndex = '';
        });
        
        // Додаємо можливість перевертання картки при кліку
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
            
            // Повертаємо картку через 2 секунди
            if (this.classList.contains('flipped')) {
                setTimeout(() => {
                    this.classList.remove('flipped');
                }, 2000);
            }
        });
    });
  }
  
  /**
  * Ініціалізація каруселі карток
  */
  function initCardsCarousel() {
    const carousel = document.querySelector('.carousel-3d');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const cards = document.querySelectorAll('.carousel-card');
    
    if (!carousel || !cards.length) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Функція для оновлення позицій карток
    function updateCarousel() {
        cards.forEach((card, index) => {
            let newIndex = (index - currentIndex + totalCards) % totalCards;
            card.style.setProperty('--card-index', newIndex);
            
            // Встановлюємо клас активної картки
            if (newIndex === 0) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
            
            // Застосовуємо різні трансформації залежно від позиції картки
            if (newIndex === 0) {
                // Активна картка (спереду)
                card.style.transform = `translateX(0) translateZ(150px) rotateY(0deg)`;
                card.style.opacity = '1';
                card.style.zIndex = '5';
            } else if (newIndex === 1 || newIndex === totalCards - 1) {
                // Картки по боках
                const direction = newIndex === 1 ? 1 : -1;
                card.style.transform = `translateX(${direction * 150}px) translateZ(50px) rotateY(${direction * -25}deg)`;
                card.style.opacity = '0.7';
                card.style.zIndex = '4';
            } else if (newIndex === 2 || newIndex === totalCards - 2) {
                // Картки другого рівня
                const direction = newIndex === 2 ? 1 : -1;
                card.style.transform = `translateX(${direction * 250}px) translateZ(-50px) rotateY(${direction * -35}deg)`;
                card.style.opacity = '0.5';
                card.style.zIndex = '3';
            } else {
                // Інші картки (позаду)
                const direction = newIndex < totalCards / 2 ? 1 : -1;
                card.style.transform = `translateX(${direction * 280}px) translateZ(-100px) rotateY(${direction * -45}deg)`;
                card.style.opacity = '0.3';
                card.style.zIndex = '2';
            }
        });
    }
    
    // Слухаємо кліки по кнопках
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        });
    }
    
    // Додаємо можливість перетягування для мобільних пристроїв
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Мінімальна відстань, щоб зарахувати свайп
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Свайп вліво
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Свайп вправо
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        }
    }
    
    // Дозволяємо перемикання карток при кліку
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Переміщуємо тільки якщо картка не є активною
            const cardIndex = parseInt(card.style.getPropertyValue('--card-index'));
            if (cardIndex !== 0) {
                const indexDiff = cardIndex < totalCards / 2 ? cardIndex : cardIndex - totalCards;
                currentIndex = (currentIndex + indexDiff + totalCards) % totalCards;
                updateCarousel();
            }
        });
    });
    
    // Ініціалізуємо карусель
    updateCarousel();
    
    // Автоматична зміна карток
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Зупиняємо автоматичне прокручування при наведенні
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Запускаємо автоматичне прокручування
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
    
    drawButton.addEventListener('click', function() {
        // Змінюємо стан кнопки, щоб уникнути повторних натискань
        if (this.classList.contains('disabled')) return;
        this.classList.add('disabled');
        
        // Перевертаємо верхню картку
        topCard.classList.add('flipped');
        
        // Через 1.5 секунди повертаємо картку назад
        setTimeout(() => {
            topCard.classList.remove('flipped');
            
            // Перемішуємо карти в колоді після повернення
            const deckCards = document.querySelectorAll('.deck-card:not(.deck-top)');
            deckCards.forEach(card => {
                const randomRotate = -2 + Math.random() * 4; // Випадкове обертання
                const randomY = Math.random() * -3; // Випадкове зміщення по Y
                
                card.style.transform = `translateY(${randomY}px) rotate(${randomRotate}deg)`;
            });
            
            // Дозволяємо знову натискати кнопку
            drawButton.classList.remove('disabled');
        }, 3000);
        
        // Анімація витягування картки
        // Створюємо анімацію, використовуючи GSAP, якщо він доступний
        if (typeof gsap !== 'undefined') {
            gsap.timeline()
                .to(topCard, { 
                    y: '-80px', 
                    rotation: -5 + Math.random() * 10,
                    duration: 0.5,
                    ease: 'power2.out'
                })
                .to(topCard, { 
                    rotationY: 180, 
                    duration: 0.5,
                    ease: 'power1.inOut'
                }, 0.3)
                .to(topCard, { 
                    y: 0, 
                    rotation: 0,
                    duration: 0.5,
                    ease: 'power2.in'
                }, 1.5)
                .to(topCard, { 
                    rotationY: 0, 
                    duration: 0.5,
                    ease: 'power1.inOut'
                }, 2.3);
        }
    });
  }
  
  /**
  * Ініціалізація 3D сітки карт
  */
  function initCardGrid() {
    const gridContainer = document.querySelector('.cards-grid-container');
    const gridCards = document.querySelectorAll('.grid-card');
    
    if (!gridContainer || !gridCards.length) return;
    
    // Додаємо ефект трансформації при русі миші
    gridContainer.addEventListener('mousemove', function(e) {
        const rect = gridContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Розрахунок кута нахилу
        const angleX = (mouseY / rect.height) * 10; // Максимальний кут 10 градусів
        const angleY = (mouseX / rect.width) * -10;
        
        // Застосовуємо трансформацію до контейнера
        gridContainer.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        
        // Застосовуємо трансформацію до карток
        gridCards.forEach(card => {
            // Розрахунок позиції картки відносно центру
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2 - rect.left;
            const cardCenterY = cardRect.top + cardRect.height / 2 - rect.top;
            
            // Розрахунок відстані від центру
            const distanceX = ((cardCenterX / rect.width) - 0.5) * 2;
            const distanceY = ((cardCenterY / rect.height) - 0.5) * 2;
            
            // Розрахунок Z-трансформації
            const zTransform = Math.abs(distanceX) + Math.abs(distanceY);
            
            // Застосовуємо трансформацію
            card.style.transform = `scale(0.95) translateZ(${30 + zTransform * 30}px)`;
        });
    });
    
    // Повертаємо до початкового стану, коли миша покидає контейнер
    gridContainer.addEventListener('mouseleave', function() {
        gridContainer.style.transform = 'rotateX(0) rotateY(0)';
        
        gridCards.forEach(card => {
            card.style.transform = 'scale(0.95) translateZ(0)';
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
    });
  }
  
  /**
  * Ініціалізація паралакс-ефектів
  */
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
    
    if (!parallaxElements.length) return;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
            const offset = scrollTop * speed;
            
            element.style.transform = `translateY(${offset}px)`;
        });
    }
    
    window.addEventListener('scroll', updateParallax);
    
    // Початкове оновлення
    updateParallax();
  }
  
  /**
  * Ініціалізація контактної форми
  */
  function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    // Додаємо анімацію для фокусу на полях форми
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
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
    
    // Обробка відправки форми
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Перевіряємо валідність форми
        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const message = contactForm.querySelector('#message');
        
        let isValid = true;
        
        // Перевірка імені
        if (!name.value.trim()) {
            name.parentElement.classList.add('error');
            isValid = false;
        } else {
            name.parentElement.classList.remove('error');
        }
        
        // Перевірка email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailPattern.test(email.value)) {
            email.parentElement.classList.add('error');
            isValid = false;
        } else {
            email.parentElement.classList.remove('error');
        }
        
        // Перевірка повідомлення
        if (!message.value.trim()) {
            message.parentElement.classList.add('error');
            isValid = false;
        } else {
            message.parentElement.classList.remove('error');
        }
        
        // Якщо форма валідна, симулюємо відправку
        if (isValid) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
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
  * Ініціалізація модальних вікон
  */
  function initModals() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal');
    
    if (!modalTriggers.length) return;
    
    // Функція для відкриття модального вікна
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('open');
        }, 10);
        document.body.classList.add('modal-open');
    }
    
    // Функція для закриття модального вікна
    function closeModal(modal) {
        modal.classList.remove('open');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.classList.remove('modal-open');
    }
    
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
    
    // Завантажуємо вміст модальних вікон при ініціалізації
    loadModalContent();
  }
  
  // Ініціалізуємо слухачі подій для вікна
  window.addEventListener('load', function() {
    // Перевіряємо, чи вже було завантажено сторінку
    if (document.body.classList.contains('loaded')) {
        // Якщо так, запускаємо початкові анімації
        startInitialAnimations();
    }
  });
  
  window.addEventListener('resize', function() {
    // Перевіряємо, чи змінився розмір вікна для адаптації інтерфейсу
    // Оновлюємо карусель карт
    const carousel = document.querySelector('.carousel-3d');
    if (carousel) {
        const updateCarouselFn = window.updateCarousel;
        if (typeof updateCarouselFn === 'function') {
            updateCarouselFn();
        }
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
  });