/* The spine fills as you read. This is the only script on the page. */
(function(){
  var bands = Array.prototype.slice.call(document.querySelectorAll('.band[id]'));
  if(!bands.length) return;
  function paint(){
    var line = window.scrollY + window.innerHeight * 0.36, current = -1;
    bands.forEach(function(b,i){ if(b.getBoundingClientRect().top + window.scrollY <= line) current = i; });
    bands.forEach(function(b,i){
      b.classList.toggle('here', i === current);
      b.classList.toggle('passed', i < current);
    });
  }
  var queued = false;
  function onScroll(){
    if(queued) return; queued = true;
    requestAnimationFrame(function(){ paint(); queued = false; });
  }
  paint();
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
})();

/* The portrait paints itself, once, when you reach it. */
(function(){
  var fig = document.querySelector('.portrait');
  if(!fig || !('IntersectionObserver' in window)) return;
  fig.classList.add('armed');
  var io = new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){ fig.classList.add('washed'); io.disconnect(); }
  }, {threshold:0.3});
  io.observe(fig);
})();
