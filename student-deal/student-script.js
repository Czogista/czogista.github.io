// Student Deal Page JavaScript
// Author: Kacper M. (Maleka DEV)

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Initializing Student Deal Page...');
    
    // Initialize components
    initializeAnimations();
    initializeLanguageSystem();
    initializeParticleEffects();
    
    console.log('✨ Student page initialized successfully!');
});

// Go back to main page
function goHome() {
    window.siteNavigate('../');
}

// Basic animations initialization
function initializeAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.student-content > *');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${0.1 * (index + 1)}s`;
    });
}

// Particle effects (simplified version)
function initializeParticleEffects() {
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        // Create stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: twinkle ${Math.random() * 4 + 2}s infinite;
            `;
            starsContainer.appendChild(star);
        }
    }
}

// Language System for Student Deal Page
function initializeLanguageSystem() {
    // Create translations object
    const translations = {};
    
    // Polish translations (default)
    translations.pl = {
        titleBy: 'autor: ',
        badgeText: '💡 Oferta Studencka',
        studentTitle: 'Kończysz szkołę średnią? Masz pomysł na swój projekt bądź startup?',
        studentSubtitle: 'Musisz mieć swoją stronę internetową, jeśli nie jesteś online, to tak jakby cię nie było',
        pitchTitle: 'Dlaczego właśnie ja?',
        pitchDescription: 'Nie jestem wielką firmą - jestem tylko ja sam, <strong>Kacper</strong>, nastolatek taki jak ty. Zrobię dla ciebie modernistyczną stronę na miarę twoich potrzeb tylko za pomocą opisu bądź projektu. Będzie działać na komputerach i telefonach, będzie czytelna, prosta i profesjonalna.',
        pitchMission: 'Jeśli masz pomysł, pomogę ci pokazać go światu! 🌟',
        pricingTitle: 'Cennik dostosowany do studenta',
        basicTitle: 'Podstawowy',
        basicDesc: 'Idealna na początek',
        basicFeatures: [
            'HTML, CSS & JavaScript',
            'Darmowy certyfikat SSL',
            'Do 5GB przestrzeni',
            'Do 20 subdomen'
        ],
        basicNote: 'Wycena za 20 PLN',
        basicFree: 'Z ważną legitymacją ISIC/ELS za darmo',
        premiumTitle: 'Rozszerzony', 
        premiumDesc: 'Dla większych projektów',
        premiumFeatures: [
            'Wszystko z planu podstawowego +',
            'PHP 7.4 i 8.0',
            'MySQL, SFTP i SSH',
            'Do 20GB przestrzeni',
            'Do 50 subdomen',
            'Darmowe konto email w domenie',
            'Konfiguracja Cloudflare (darmowy plan)'
        ],
        premiumNote: 'Wycena za 54 PLN',
        premiumFree: 'Z ważną legitymacją ISIC/ELS za darmo',
        pricingInfo: '<strong>Niska marża + przystosowana do studenckiego budżetu</strong><br>Wycena zawsze na miarę twoich potrzeb i możliwości finansowych',
        hostingTitle: 'Informacje o kosztach utrzymania',
        hostingDescription: 'Opłata za utrzymanie strony online jest rozliczana każdorazowo za rok z góry. Stworzenie strony to jednorazowa część opłaty wliczona w pierwszy rok kosztów utrzymania.',
        basicChanges: '<strong>Plan Podstawowy:</strong> Zmiany na stronie - mała symboliczna opłata jednorazowa',
        premiumChanges: '<strong>Plan Rozszerzony:</strong> Mniejsze zmiany/aktualizacje darmowe',
        ctaTitle: 'Zainteresowany?',
        ctaDescription: 'Napisz na email i opowiedz mi o swoim projekcie!',
        contactButtonText: 'hello@maleka.dev',
        emailNote: 'Temat wiadomości: "Zapytanie o ofertę studencką"',
        backButton: '← Powrót do głównej strony',
        emailSubject: 'Zapytanie%20o%20ofert%C4%99%20studeck%C4%85'
    };
    
    // Czech translations
    translations.cs = {
        titleBy: 'od ',
        badgeText: '💡 Studentská Nabídka',
        studentTitle: 'Končíš střední školu? Máš nápad na svůj projekt nebo startup?',
        studentSubtitle: 'Musíš mít svou webovou stránku, pokud nejsi online, je to jako bys neexistoval',
        pitchTitle: 'Proč právě já?',
        pitchDescription: 'Nejsem velká firma - jsem jen já sám, <strong>Kacper</strong>, teenager jako ty. Vytvořím ti moderní stránku na míru tvých potřeb pouze na základě popisu nebo návrhu. Bude fungovat na počítačích i telefonech, bude čitelná, jednoduchá a profesionální.',
        pitchMission: 'Pokud máš nápad, pomůžu ti ho ukázat světu! 🌟',
        pricingTitle: 'Cenník přizpůsobený studentovi',
        basicTitle: 'Základní',
        basicDesc: 'Ideální na začátek',
        basicFeatures: [
            'HTML, CSS & JavaScript',
            'Zdarma SSL certifikát',
            'Až 5GB prostoru',
            'Až 20 subdomén'
        ],
        basicNote: 'Kalkulace za 100 CZK',
        basicFree: 'S platným průkazem ISIC/ELS zdarma',
        premiumTitle: 'Rozšířený',
        premiumDesc: 'Pro větší projekty',
        premiumFeatures: [
            'Vše ze základního plánu +',
            'PHP 7.4 a 8.0',
            'MySQL, SFTP a SSH',
            'Až 20GB prostoru',
            'Až 50 subdomén',
            'Zdarma emailový účet v doméně',
            'Konfigurace Cloudflare (zdarma plán)'
        ],
        premiumNote: 'Kalkulace za 300 CZK',
        premiumFree: 'S platným průkazem ISIC/ELS zdarma',
        pricingInfo: '<strong>Nízká marže + přizpůsobeno studentskému rozpočtu</strong><br>Cena vždy podle tvých potřeb a finančních možností',
        hostingTitle: 'Informace o nákladech na provoz',
        hostingDescription: 'Poplatek za provoz stránky online se účtuje každoročně předem. Vytvoření stránky je jednorázová část poplatku zahrnuta v prvním roce nákladů na provoz.',
        basicChanges: '<strong>Základní plán:</strong> Změny na stránce - malý symbolický jednorázový poplatek',
        premiumChanges: '<strong>Rozšířený plán:</strong> Menší změny/aktualizace zdarma',
        ctaTitle: 'Máš zájem?',
        ctaDescription: 'Napiš mi email a řekni mi o svém projektu!',
        contactButtonText: 'hello@maleka.dev',
        emailNote: 'Předmět zprávy: "Dotaz na studentskou nabídku"',
        backButton: '← Zpět na hlavní stránku',
        emailSubject: 'Dotaz%20na%20studentskou%20nab%C3%ADdku'
    };
    
    // English translations
    translations.en = {
        titleBy: 'by ',
        badgeText: '💡 Student Offer',
        studentTitle: 'Finishing high school? Got an idea for your project or startup?',
        studentSubtitle: 'You need your own website - if you\'re not online, it\'s like you don\'t exist',
        pitchTitle: 'Why choose me?',
        pitchDescription: 'I\'m not a big company - I\'m just me, <strong>Kacper</strong>, a teenager like you. I\'ll create a modern website tailored to your needs based only on your description or design. It will work on computers and phones, be readable, simple, and professional.',
        pitchMission: 'If you have an idea, I\'ll help you show it to the world! 🌟',
        pricingTitle: 'Student-friendly pricing',
        basicTitle: 'Basic',
        basicDesc: 'Perfect for starters',
        basicFeatures: [
            'HTML, CSS & JavaScript',
            'Free SSL certificate',
            'Up to 5GB storage',
            'Up to 20 subdomains'
        ],
        basicNote: 'Quote for 5 EUR',
        basicFree: 'Free with valid ISIC/ELS student ID',
        premiumTitle: 'Extended',
        premiumDesc: 'For larger projects',
        premiumFeatures: [
            'Everything from basic plan +',
            'PHP 7.4 and 8.0',
            'MySQL, SFTP and SSH',
            'Up to 20GB storage',
            'Up to 50 subdomains',
            'Free email account in domain',
            'Cloudflare setup (free plan)'
        ],
        premiumNote: 'Quote for 13 EUR',
        premiumFree: 'Free with valid ISIC/ELS student ID',
        pricingInfo: '<strong>Low margin + adapted to student budget</strong><br>Pricing always tailored to your needs and financial capabilities',
        hostingTitle: 'Hosting and maintenance costs info',
        hostingDescription: 'Website hosting fees are charged annually in advance. Website creation is a one-time fee included in the first year of hosting costs.',
        basicChanges: '<strong>Basic Plan:</strong> Website changes - small symbolic one-time fee',
        premiumChanges: '<strong>Extended Plan:</strong> Minor changes/updates free',
        ctaTitle: 'Interested?',
        ctaDescription: 'Write me an email and tell me about your project!',
        contactButtonText: 'hello@maleka.dev',
        emailNote: 'Subject: "Student offer inquiry"',
        backButton: '← Back to main page',
        emailSubject: 'Student%20offer%20inquiry'
    };
    
    // Language switching functions
    function setActiveLangButton(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }
    
    function applyLanguage(lang) {
        const t = translations[lang] || translations.pl;
        console.log(`🌐 Applying language: ${lang}`);
        
        // Set HTML lang attribute
        document.documentElement.setAttribute('lang', lang);
        
        // Apply translations to elements
        const elements = {
            'titleBy': t.titleBy,
            'badgeText': t.badgeText,
            'studentTitle': t.studentTitle,
            'studentSubtitle': t.studentSubtitle,
            'pitchTitle': t.pitchTitle,
            'pitchDescription': t.pitchDescription,
            'pitchMission': t.pitchMission,
            'pricingTitle': t.pricingTitle,
            'basicTitle': t.basicTitle,
            'basicDesc': t.basicDesc,
            'basicNote': t.basicNote,
            'basicFree': t.basicFree,
            'premiumTitle': t.premiumTitle,
            'premiumDesc': t.premiumDesc,
            'premiumNote': t.premiumNote,
            'premiumFree': t.premiumFree,
            'pricingInfo': t.pricingInfo,
            'hostingTitle': t.hostingTitle,
            'hostingDescription': t.hostingDescription,
            'basicChanges': t.basicChanges,
            'premiumChanges': t.premiumChanges,
            'ctaTitle': t.ctaTitle,
            'ctaDescription': t.ctaDescription,
            'contactButtonText': t.contactButtonText,
            'emailNote': t.emailNote,
            'backButton': t.backButton
        };
        
        // Apply text content or innerHTML based on element needs
        Object.entries(elements).forEach(([id, content]) => {
            const el = document.getElementById(id);
            if (el) {
                // Elements that need HTML support
                if (['pitchDescription', 'pricingInfo', 'hostingDescription', 'basicChanges', 'premiumChanges'].includes(id)) {
                    el.innerHTML = content;
                } else {
                    el.textContent = content;
                }
            }
        });
        
        // Handle feature lists separately
        const basicFeaturesList = document.getElementById('basicFeatures');
        const premiumFeaturesList = document.getElementById('premiumFeatures');
        
        if (basicFeaturesList && t.basicFeatures) {
            basicFeaturesList.innerHTML = t.basicFeatures.map(feature => `<li>${feature}</li>`).join('');
        }
        
        if (premiumFeaturesList && t.premiumFeatures) {
            premiumFeaturesList.innerHTML = t.premiumFeatures.map(feature => `<li>${feature}</li>`).join('');
        }
        
        // Update email link with proper subject
        const contactButton = document.getElementById('contactButton');
        if (contactButton) {
            contactButton.href = `mailto:hello@maleka.dev?subject=${t.emailSubject}`;
        }
        
        // Update page title
        const titleMap = {
            'pl': 'Maleka DEV - Oferta Studencka | Student Web Development',
            'cs': 'Maleka DEV - Studentská Nabídka | Student Web Development', 
            'en': 'Maleka DEV - Student Offer | Student Web Development'
        };
        document.title = titleMap[lang] || titleMap.pl;
        
        // Store language preference
        localStorage.setItem('preferred-language', lang);
        
        // Set active button
        setActiveLangButton(lang);
    }
    
    // Get stored language preference or default to Polish
    const storedLang = localStorage.getItem('preferred-language') || 'pl';
    
    // Set up language button event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            applyLanguage(lang);
        });
    });
    
    // Apply initial language
    applyLanguage(storedLang);
}

// Add some CSS for stars animation
if (!document.querySelector('#starStyles')) {
    const style = document.createElement('style');
    style.id = 'starStyles';
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
        
        .star {
            animation: twinkle 2s infinite;
        }
    `;
    document.head.appendChild(style);
}