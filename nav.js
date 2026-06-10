// Shared navigation — edit this file to update nav on all pages
(function() {
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  var navItems = [
    { label: 'Home',    href: '/' },
    { label: 'About',   href: '/about' },
    { label: 'Courses', href: '/courses' },
    { label: 'Working with Organisations', href: '/organisations' },
    { label: 'Fulcrum', href: '/fulcrum' },
  ];

  var links = navItems.map(function(item) {
    var itemPath = item.href.replace(/\/$/, '') || '/';
    var isActive = currentPath === itemPath;
    return '<a href="' + item.href + '" class="nav-link' + (isActive ? ' nav-active' : '') + '">' + item.label + '</a>';
  }).join('');

  var html = '\
<header class="site-header">\
  <a href="/" class="brand">Wyman Associates</a>\
  <nav class="site-nav">' + links + '</nav>\
  <a href="https://calendly.com/mitziw/discovery-call" class="nav-cta" target="_blank" rel="noopener">Book a discovery call</a>\
</header>\
<div class="header-teal-bar"></div>';

  var style = '\
<style>\
  .site-header {\
    background: #2C3E50;\
    padding: 0 2rem;\
    height: 56px;\
    display: flex;\
    align-items: center;\
    justify-content: space-between;\
    position: sticky;\
    top: 0;\
    z-index: 100;\
    gap: 1rem;\
  }\
  .brand {\
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;\
    font-size: 11px;\
    font-weight: 600;\
    letter-spacing: 0.12em;\
    text-transform: uppercase;\
    color: rgba(255,255,255,0.95);\
    text-decoration: none;\
    flex-shrink: 0;\
  }\
  .site-nav {\
    display: flex;\
    gap: 0.25rem;\
    flex: 1;\
    justify-content: center;\
  }\
  .nav-link {\
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;\
    font-size: 12px;\
    font-weight: 500;\
    color: rgba(255,255,255,0.65);\
    text-decoration: none;\
    padding: 0.35rem 0.75rem;\
    border-radius: 4px;\
    transition: color 0.15s, background 0.15s;\
  }\
  .nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }\
  .nav-active { color: #fff !important; }\
  .nav-cta {\
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;\
    font-size: 12px;\
    font-weight: 600;\
    color: rgba(255,255,255,0.6);\
    text-decoration: none;\
    flex-shrink: 0;\
  }\
  .nav-cta:hover { color: rgba(255,255,255,0.9); }\
  .header-teal-bar { height: 3px; background: #6B9FBC; }\
  @media (max-width: 560px) {\
    .site-nav { display: none; }\
  }\
</style>';

  document.write(style + html);
})();
