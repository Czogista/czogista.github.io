function reload() {
    window.siteNavigate('../');
    style.setAttribute("href", "style.css");
}

var style = document.getElementById("stylesheet");
function showSection(section) {
    const sections = [
        { name: "aboutMe", block: "aboutMeBlock", button: "aboutMeButton" },
        { name: "projects", block: "projectsBlocks", button: "projectsButton" },
        { name: "contact", block: "contactBlock", button: "contactButton" },
        { name: "hireme", block: "hiremeBlock", button: "hiremeButton" }
    ];

    sections.forEach(s => {
        const block = document.getElementById(s.block);
        const button = document.getElementById(s.button);
        const img1 = document.getElementById("imgsubp");
        const img2 = document.getElementById("imgmainp");
        if (s.name === section) {
            block.style.display = "block";
            button.className = "btn-sellected";
            img1.style.display = "none"; img2.style.display = "block";
        } else {
            block.style.display = "none";
            button.className = "btn";
        }
    });

    // Apply style change and hide logo
    document.getElementById("i-lookingforlogo").style.display = "none";
    style.setAttribute("href", "style2.css");
}

// ---- Language switcher & translations ----
(function () {
    const translations = {
        en: {
            titleBy: 'by ',
            jobTitle: 'Junior Web Developer & IT Administrator',
            logoRequestHTML: 'I am seeking an individual with a background in computer graphics.<br>If you are interested in creating my brand logo, please send me your previous projects and a description of your experience via email.',
            buttons: { about: 'About me', projects: 'My projects', contact: 'Contact', hireme: 'IT Support / Hire me' },
            about: {
                titleHTML: 'Hi, I’m <block id="maleka">Kacper</block> 👋',
                p1: 'I’m a tech enthusiast with a strong background in web development, design, and IT solutions. My programming journey began at the age of 12, starting with Scratch during school IT classes, and has since grown into a deep passion for creating and managing websites, web applications, and databases. In 2022, I successfully passed the <b>EE.08</b> / <b>INF.02</b> professional qualification exams, further solidifying my technical skills.',
                p2: 'Since November 2024, I have been part of the <a href="https://rybizak.cz" target="_blank">Rybízák</a> team as a sales stand operator, where I take care of customers, handle transactions, prepare documentation for stock replenishment, and ensure smooth daily operations. Alongside this, I work at <a href="https://globus.cz" target="_blank">Globus</a> as a cashier, operating both staffed and self-service checkouts, assisting customers, managing store opening and closing procedures, and training new colleagues when needed.',
                p3: 'Outside my formal roles, I frequently help friends and neighbors with small tech-related tasks — whether it’s reinstalling Windows, setting up applications, configuring security cameras, or troubleshooting everyday PC issues. These experiences have sharpened my problem-solving abilities and taught me the value of clear communication with both technical and non-technical users.',
                p4: 'I am fluent in Polish (native) and communicate effectively in English and Czech at an upper-intermediate level (ILR scale 3–4). When I’m not coding or working, I enjoy gaming, running my online community, exploring new technologies, and spending time with friends.',
                footer: 'That’s me in a nutshell. Thanks for stopping by 💙'
            },
            projects: {
                title: 'My projects?',
                intro: 'While I’m still growing as a developer, I have several projects I’m proud of and would like to share.',
                nnsDescHTML: 'NoName Squad is a <a href="https://discord.nnamesquad.top" target="_blank" style="color: var(--nns);">Discord</a> community I founded in 2019. Over the years, it has grown to nearly 100 active members, with its invite link used more than 900 times. I also developed its dedicated <a href="https://nnamesquad.top" target="_blank" style="color: var(--nns);">website</a>, which serves as a hub for members to connect and stay updated.',
                flagbarDescHTML: 'FlagBar is a browser extension that adds the colors of various LGBTQ+ flags to YouTube for a personalized, visually appealing experience. I created it initially as a fun project inspired by a friend in the LGBTQ+ community, and soon realized it could be enjoyed by everyone. You can learn more and try it at <a href="https://flagbar.nnamesquad.top" target="_blank" style="color: var(--flagbar);">flagbar.nnamesquad.top</a>.',
                footerText: '<b>Perhaps more in the future..</b><br>until then, you can support me and buy me a coffee if you like my work!'
            },
            contact: {
                title: 'Contact',
                messageHTML: 'Feel free to contact me anytime at <a href="mailto:contact@maleka.dev">contact@maleka.dev</a>.',
                footer: 'I will reply as soon as possible, though my response may come from my personal address for convenience.'
            },
            hire: {
                title: 'Small Tech Jobs & Web Projects',
                p1: 'I am available for a wide range of tech-related work, from website and web app development to database setup, IT equipment installation, and general PC support. Whether you need help troubleshooting an issue, setting up a system, or building a new online presence, I provide reliable, personalized assistance tailored to your needs.',
                p2: 'I hold a professional qualification in <b>EE.08</b> and <b>INF.02</b> (Web Development, Applications, and Database Management), passed in 2022. This certification ensures that my work meets recognized professional standards, whether for personal projects or professional engagements.',
                p3: 'My services include developing and managing websites, installing and configuring software, setting up networks or security devices, and providing general IT support. If you have a project in mind or a tech issue that needs solving, please get in touch via the <span>“Contact”</span> tab, and I will respond promptly.'
            }
        },
        cs: {
            titleBy: 'od ',
            jobTitle: 'Junior webový vývojář a IT administrátor',
            logoRequestHTML: 'Hledám člověka se zkušenostmi s počítačovou grafikou.<br>Pokud máte zájem vytvořit moje značkové logo, pošlete prosím své předchozí projekty a popis zkušeností e‑mailem.',
            buttons: { about: 'O mně', projects: 'Moje projekty', contact: 'Kontakt', hireme: 'IT podpora / Najměte mě' },
            about: {
                titleHTML: 'Ahoj, jsem <block id="maleka">Kacper</block> 👋',
                p1: 'Jsem nadšenec do technologií se silným zaměřením na vývoj webů, design a IT řešení. S programováním jsem začal ve 12 letech ve škole na hodinách informatiky se Scratch a postupně se z toho stala vášeň pro tvorbu a správu webů, webových aplikací a databází. V roce 2022 jsem úspěšně složil profesní kvalifikace <b>EE.08</b> / <b>INF.02</b>, které dále posílily mé technické dovednosti.',
                p2: 'Od listopadu 2024 jsem součástí týmu <a href="https://rybizak.cz" target="_blank">Rybízák</a> jako obsluha prodejního stánku, kde se starám o zákazníky, vyřizuji platby, připravuji podklady pro doplnění zboží a zajišťuji plynulý chod provozu. Vedle toho pracuji v <a href="https://globus.cz" target="_blank">Globus</a> jako pokladní – obsluhuji jak klasické, tak samoobslužné pokladny, pomáhám zákazníkům, zajišťuji otevření a uzavření prodejny a v případě potřeby zaučuji nové kolegy.',
                p3: 'Mimo formální pracovní role často pomáhám přátelům a sousedům s menšími IT úkoly — ať už jde o přeinstalaci Windows, instalaci aplikací, nastavení kamerových systémů, nebo řešení běžných problémů s PC. Díky tomu jsem si zlepšil schopnost řešit problémy a naučil se srozumitelně komunikovat s technickými i netechnickými uživateli.',
                p4: 'Plynně mluvím polsky (rodilý jazyk) a anglicky i česky komunikuji na vyšší středně pokročilé úrovni (ILR 3–4). Když zrovna neprogramuji ani nepracuji, rád hraji hry, starám se o svou online komunitu, zkouším nové technologie a trávím čas s přáteli.',
                footer: 'To jsem já v kostce. Díky za návštěvu 💙'
            },
            projects: {
                title: 'Moje projekty?',
                intro: 'I když se jako vývojář stále posouvám, mám několik projektů, na které jsem hrdý a rád se o ně podělím.',
                nnsDescHTML: 'NoName Squad je komunita na <a href="https://discord.nnamesquad.top" target="_blank" style="color: var(--nns);">Discordu</a>, kterou jsem založil v roce 2019. Během let vyrostla téměř na 100 aktivních členů a její pozvánka byla použita více než 900×. Vytvořil jsem také její <a href="https://nnamesquad.top" target="_blank" style="color: var(--nns);">web</a>, který slouží jako centrum pro spojení členů a novinky.',
                flagbarDescHTML: 'FlagBar je rozšíření prohlížeče, které přidává barvy různých LGBTQ+ vlajek do YouTube pro osobnější a vizuálně příjemný zážitek. Původně jsem ho vytvořil jako zábavný projekt inspirovaný kamarádem z LGBTQ+ komunity a brzy jsem zjistil, že si ho může užít každý. Více informací najdete na <a href="https://flagbar.nnamesquad.top" target="_blank" style="color: var(--flagbar);">flagbar.nnamesquad.top</a>.',
                footerText: '<b>Možná časem více…</b><br>do té doby mě můžete podpořit a koupit mi kávu, pokud se vám má práce líbí!'
            },
            contact: {
                title: 'Kontakt',
                messageHTML: 'Neváhejte mě kdykoli kontaktovat na <a href="mailto:contact@maleka.dev">contact@maleka.dev</a>.',
                footer: 'Odpovím co nejdříve; pro pohodlí mohu odepsat ze své osobní adresy.'
            },
            hire: {
                title: 'Menší IT práce a webové projekty',
                p1: 'Nabízím široké spektrum IT služeb – od vývoje webů a webových aplikací přes zřizování databází až po instalaci IT vybavení a obecnou podporu pro PC. Ať už potřebujete vyřešit problém, nastavit systém, nebo vybudovat novou online prezentaci, poskytnu spolehlivou a osobní pomoc na míru.',
                p2: 'Mám profesní kvalifikace <b>EE.08</b> a <b>INF.02</b> (Tvorba webů, aplikací a správa databází), které jsem složil v roce 2022. Díky tomu moje práce splňuje uznávané profesionální standardy – ať už jde o osobní či firemní projekty.',
                p3: 'Mezi mé služby patří vývoj a správa webů, instalace a konfigurace softwaru, zřizování sítí nebo bezpečnostních zařízení a obecná IT podpora. Pokud máte projekt nebo problém k vyřešení, kontaktujte mě prosím přes záložku <span>„Kontakt“</span> a ozvu se co nejdříve.'
            }
        },
        pl: {
            titleBy: 'autor: ',
            jobTitle: 'Młodszy Web Developer i Administrator IT',
            logoRequestHTML: 'Szukam osoby ze znajomością grafiki komputerowej.<br>Jeśli jesteś zainteresowany(a) stworzeniem mojego logo marki, wyślij proszę swoje wcześniejsze projekty oraz opis doświadczenia na e‑mail.',
            buttons: { about: 'O mnie', projects: 'Moje projekty', contact: 'Kontakt', hireme: 'Wsparcie IT / Zatrudnij mnie' },
            about: {
                titleHTML: 'Cześć, jestem <block id="maleka">Kacper</block> 👋',
                p1: 'Jestem pasjonatem technologii ze solidnym doświadczeniem w tworzeniu stron, projektowaniu i rozwiązaniach IT. Swoją przygodę z programowaniem zacząłem w wieku 12 lat na zajęciach informatyki od Scratcha i od tego czasu rozwinęła się we mnie silna pasja do tworzenia i zarządzania stronami WWW, aplikacjami internetowymi oraz bazami danych. W 2022 roku zdałem z powodzeniem kwalifikacje zawodowe <b>EE.08</b> / <b>INF.02</b>, co ugruntowało moje umiejętności techniczne.',
                p2: 'Od listopada 2024 roku jestem częścią zespołu <a href="https://rybizak.cz" target="_blank">Rybízák</a> jako obsługa stoiska sprzedażowego – dbam o klientów, realizuję transakcje, przygotowuję dokumentację do uzupełnień towaru i czuwam nad sprawnym przebiegiem dnia. Równolegle pracuję w <a href="https://globus.cz" target="_blank">Globus</a> jako kasjer – obsługuję zarówno kasy tradycyjne, jak i samoobsługowe, pomagam klientom, zajmuję się otwarciem i zamknięciem sklepu oraz w razie potrzeby szkolę nowych współpracowników.',
                p3: 'Poza formalnymi rolami często pomagam znajomym i sąsiadom w drobnych zadaniach IT — od reinstalacji Windows, przez konfigurację aplikacji, ustawienia kamer, po rozwiązywanie codziennych problemów z komputerem. Te doświadczenia rozwinęły moje umiejętności rozwiązywania problemów i nauczyły mnie jasnej komunikacji zarówno z osobami technicznymi, jak i nietechnicznymi.',
                p4: 'Posługuję się biegle językiem polskim (ojczysty), a po angielsku i czesku komunikuję się na poziomie wyższym średnio zaawansowanym (ILR 3–4). Poza pracą i kodowaniem lubię gry, prowadzenie społeczności online, poznawanie nowych technologii i czas spędzany ze znajomymi.',
                footer: 'To ja w pigułce. Dzięki za odwiedziny 💙'
            },
            projects: {
                title: 'Moje projekty?',
                intro: 'Choć wciąż się rozwijam jako programista, mam kilka projektów, z których jestem dumny i chętnie je pokażę.',
                nnsDescHTML: 'NoName Squad to społeczność na <a href="https://discord.nnamesquad.top" target="_blank" style="color: var(--nns);">Discordzie</a>, którą założyłem w 2019 roku. Z czasem urosła do prawie 100 aktywnych członków, a link zaproszenia był użyty ponad 900 razy. Stworzyłem też dedykowaną <a href="https://nnamesquad.top" target="_blank" style="color: var(--nns);">stronę</a>, która jest centrum informacji i łączności dla członków.',
                flagbarDescHTML: 'FlagBar to rozszerzenie przeglądarki, które dodaje kolory różnych flag LGBTQ+ do YouTube, tworząc spersonalizowane, atrakcyjne wizualnie wrażenia. Powstało jako zabawny projekt zainspirowany znajomą osobą z społeczności LGBTQ+, a szybko okazało się, że może spodobać się każdemu. Więcej informacji: <a href="https://flagbar.nnamesquad.top" target="_blank" style="color: var(--flagbar);">flagbar.nnamesquad.top</a>.',
                footerText: '<b>Być może w przyszłości więcej…</b><br>do tego czasu możesz mnie wesprzeć i postawić mi kawę, jeśli podoba Ci się moja praca!'
            },
            contact: {
                title: 'Kontakt',
                messageHTML: 'Zapraszam do kontaktu pod adresem <a href="mailto:contact@maleka.dev">contact@maleka.dev</a>.',
                footer: 'Odpowiem najszybciej jak to możliwe; dla wygody wiadomość może przyjść z mojego prywatnego adresu.'
            },
            hire: {
                title: 'Drobne zlecenia IT i projekty webowe',
                p1: 'Jestem dostępny do szerokiego zakresu prac IT – od tworzenia stron i aplikacji webowych, przez konfigurację baz danych, instalację sprzętu IT, po ogólne wsparcie komputerowe. Niezależnie, czy potrzebujesz rozwiązać problem, uruchomić system, czy zbudować nową obecność w sieci, zapewnię rzetelną, spersonalizowaną pomoc.',
                p2: 'Posiadam kwalifikacje zawodowe <b>EE.08</b> i <b>INF.02</b> (Tworzenie stron, aplikacji i zarządzanie bazami danych), zdane w 2022 roku. Dzięki temu moja praca spełnia uznane standardy zawodowe – zarówno przy projektach prywatnych, jak i komercyjnych.',
                p3: 'W zakres moich usług wchodzi tworzenie i utrzymanie stron, instalacja i konfiguracja oprogramowania, konfiguracja sieci lub urządzeń zabezpieczających oraz ogólne wsparcie IT. Jeśli masz projekt lub problem do rozwiązania, skontaktuj się przez zakładkę <span>„Kontakt”</span>, a odezwę się niezwłocznie.'
            }
        }
    };

    function setActiveLangButton(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    function applyLanguage(lang) {
        const t = translations[lang] || translations.en;
        // Root lang attr
        document.documentElement.setAttribute('lang', lang);

        // Header/title area
        const byEl = document.getElementById('titleBy');
        if (byEl) byEl.textContent = t.titleBy;
        const jobEl = document.getElementById('jobTitle');
        if (jobEl) jobEl.textContent = t.jobTitle;
        const logoReq = document.getElementById('i-lookingforlogo');
        if (logoReq) logoReq.innerHTML = t.logoRequestHTML;

        // Buttons
        const btnAbout = document.getElementById('aboutMeButton');
        if (btnAbout) btnAbout.textContent = t.buttons.about;
        const btnProjects = document.getElementById('projectsButton');
        if (btnProjects) btnProjects.textContent = t.buttons.projects;
        const btnContact = document.getElementById('contactButton');
        if (btnContact) btnContact.textContent = t.buttons.contact;
        const btnHire = document.getElementById('hiremeButton');
        if (btnHire) btnHire.textContent = t.buttons.hireme;

        // About me
        const aboutTitle = document.getElementById('aboutMeTitle');
        if (aboutTitle) aboutTitle.innerHTML = t.about.titleHTML;
        const aboutP1 = document.getElementById('aboutMeP1');
        if (aboutP1) aboutP1.innerHTML = t.about.p1;
        const aboutP2 = document.getElementById('aboutMeP2');
        if (aboutP2) aboutP2.innerHTML = t.about.p2;
        const aboutP3 = document.getElementById('aboutMeP3');
        if (aboutP3) aboutP3.innerHTML = t.about.p3;
        const aboutP4 = document.getElementById('aboutMeP4');
        if (aboutP4) aboutP4.innerHTML = t.about.p4;
        const aboutFooter = document.getElementById('aboutMeFooter');
        if (aboutFooter) aboutFooter.textContent = t.about.footer;

        // Projects
        const projTitle = document.getElementById('projectsTitle');
        if (projTitle) projTitle.textContent = t.projects.title;
        const projIntro = document.getElementById('projectsIntro');
        if (projIntro) projIntro.textContent = t.projects.intro;
        const nnsDesc = document.getElementById('nnsDesc');
        if (nnsDesc) nnsDesc.innerHTML = t.projects.nnsDescHTML;
        const flagDesc = document.getElementById('flagbarDesc');
        if (flagDesc) flagDesc.innerHTML = t.projects.flagbarDescHTML;
        const projFooterText = document.getElementById('projectsFooterText');
        if (projFooterText) projFooterText.innerHTML = t.projects.footerText;

        // Contact
        const contactTitle = document.getElementById('contactTitle');
        if (contactTitle) contactTitle.textContent = t.contact.title;
        const contactMsg = document.getElementById('contactMsg');
        if (contactMsg) contactMsg.innerHTML = t.contact.messageHTML;
        const contactFooter = document.getElementById('contactFooter');
        if (contactFooter) contactFooter.textContent = t.contact.footer;

        // Hire me
        const hireTitle = document.getElementById('hiremeTitle');
        if (hireTitle) hireTitle.textContent = t.hire.title;
        const hireP1 = document.getElementById('hiremeP1');
        if (hireP1) hireP1.innerHTML = t.hire.p1;
        const hireP2 = document.getElementById('hiremeP2');
        if (hireP2) hireP2.innerHTML = t.hire.p2;
        const hireP3 = document.getElementById('hiremeP3');
        if (hireP3) hireP3.innerHTML = t.hire.p3;

        setActiveLangButton(lang);
        try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
    }

    function initLanguage() {
        const saved = (function(){
            try { return localStorage.getItem('lang') || 'en'; } catch (e) { return 'en'; }
        })();
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.locked === 'true') {
                    showLockedNotice(btn);
                    return;
                }
                const lang = btn.dataset.lang;
                applyLanguage(lang);
            });
            btn.addEventListener('mouseenter', () => showHoverInfo(btn));
            btn.addEventListener('mouseleave', () => hideHoverInfo());
        });
        applyLanguage(saved);
    }

    function showLockedNotice(btn) {
        let note = document.getElementById('lockedLangPopup');
        if (!note) {
            note = document.createElement('div');
            note.id = 'lockedLangPopup';
            note.style.position = 'absolute';
            note.style.top = '100%';
            note.style.left = '0';
            note.style.fontSize = '0.7rem';
            note.style.padding = '4px 8px';
            note.style.background = '#222';
            note.style.border = '1px solid #444';
            note.style.borderRadius = '6px';
            note.style.color = '#bbb';
            note.style.marginTop = '4px';
            note.style.zIndex = '50';
            note.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
            const wrapper = document.getElementById('langSwitcher');
            if (wrapper) wrapper.appendChild(note);
        }
        note.textContent = 'Selected language coming soon.';
        note.style.opacity = '1';
        clearTimeout(note._timeout);
        note._timeout = setTimeout(() => { note.style.opacity = '0'; }, 2500);
    }

    function showHoverInfo(btn) {
        const box = document.getElementById('langInfo');
        if (!box) return;
        let text;
        const lang = btn.dataset.lang;
        const locked = btn.dataset.locked === 'true';
        switch (lang) {
            case 'en':
                text = 'English version available.';
                break;
            case 'cs':
                text = locked ? 'Čeština: dostupné brzy.' : 'Čeština aktivní.';
                break;
            case 'pl':
                text = locked ? 'Polski: dostępne wkrótce.' : 'Polski aktywny.';
                break;
            default:
                text = 'Language info';
        }
        box.textContent = text;
        box.style.display = 'block';
        box.style.opacity = '1';
    }

    function hideHoverInfo() {
        const box = document.getElementById('langInfo');
        if (!box) return;
        box.style.opacity = '0';
        setTimeout(() => { if (box.style.opacity === '0') box.style.display = 'none'; }, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguage);
    } else {
        initLanguage();
    }
})();
