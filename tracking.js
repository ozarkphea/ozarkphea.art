// Ozarkphea Stats Tracking Script
// Ajouter ce script avant la fermeture du </body> sur toutes les pages

(function() {
    const TRACKING_API = 'https://ozarkphea-stats-api.sjj2-ozarkphea.workers.dev/track';
    
    // Générer un ID visiteur unique basé sur le localStorage
    function getOrCreateVisitorId() {
        const key = 'ozarkphea_visitor_id';
        let visitorId = localStorage.getItem(key);
        
        if (!visitorId) {
            visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem(key, visitorId);
        }
        
        return visitorId;
    }
    
    // Envoyer les données de tracking
    function trackPageView() {
        const visitorId = getOrCreateVisitorId();
        const page = window.location.pathname;
        
        const payload = {
            page: page,
            visitor_id: visitorId
        };
        
        // Utiliser sendBeacon pour une fiabilité maximale
        if (navigator.sendBeacon) {
            navigator.sendBeacon(TRACKING_API, JSON.stringify(payload));
        } else {
            // Fallback avec fetch
            fetch(TRACKING_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(err => console.error('Tracking error:', err));
        }
    }
    
    // Tracker au chargement de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackPageView);
    } else {
        trackPageView();
    }
    
    // Tracker aussi lors des changements de page (SPA)
    window.addEventListener('hashchange', trackPageView);
    window.addEventListener('popstate', trackPageView);
})();
