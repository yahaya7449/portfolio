const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');

if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function(){
        const isOpen = primaryNav.classList.toggle('open');
        // keep the accessibility state in sync with the visual state
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach(function (link){
        link.addEventListener('click', function (){
            primaryNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

//Fills every <span data-year the the current year automatiacally
document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
})