(function () {
    const shutdownDate = new Date(2027, 4, 7);
    const today = new Date();
    const hasBypass = new URLSearchParams(window.location.search).get('password') === '2137';
    const isAnnouncementPage = window.location.pathname.endsWith('/shutdown-announcement.html');

    function preserveBypass(url) {
        if (!hasBypass || url.origin !== window.location.origin || url.searchParams.has('password')) {
            return url;
        }

        new URLSearchParams(window.location.search).forEach((value, key) => {
            url.searchParams.append(key, value);
        });
        return url;
    }

    window.siteNavigate = function (destination) {
        const url = preserveBypass(new URL(destination, document.baseURI));
        window.location.href = url.href;
    };

    if (today >= shutdownDate && !hasBypass && !isAnnouncementPage) {
        window.location.replace(new URL('shutdown-announcement.html', document.baseURI).href);
        return;
    }

    document.addEventListener('click', function (event) {
        const link = event.target.closest('a');
        if (!link || !hasBypass || link.target === '_blank') {
            return;
        }

        const url = new URL(link.href, document.baseURI);
        if (url.origin !== window.location.origin || url.hash && url.pathname === window.location.pathname) {
            return;
        }

        event.preventDefault();
        window.location.href = preserveBypass(url).href;
    }, true);

    document.addEventListener('DOMContentLoaded', function () {
        const notice = document.querySelector('.site-takedown-notice');
        if (!notice) {
            return;
        }

        const marchDate = new Date(2027, 2, 1);
        const aprilDate = new Date(2027, 3, 1);
        const aprilFoolsNotice = document.querySelector('.april-fools-notice');

        if (today >= marchDate) {
            notice.classList.add('escalation-stage-1');
        }
        if (today >= aprilDate) {
            notice.classList.remove('escalation-stage-1');
            notice.classList.add('escalation-stage-2');
        }
        if (today.getFullYear() === 2027 && today.getMonth() === 3 && today.getDate() === 1 && aprilFoolsNotice) {
            aprilFoolsNotice.hidden = false;
        }
    });
}());
