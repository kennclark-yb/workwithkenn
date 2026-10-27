/* Native mobile navigation, enhanced without blocking section links. */
document.querySelectorAll('.sprint-menu a').forEach(link=>link.addEventListener('click',()=>link.closest('details').removeAttribute('open')));
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.sprint-menu[open]').forEach(menu=>{menu.open=false;menu.querySelector('summary').focus()})});
