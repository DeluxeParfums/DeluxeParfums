document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.slider-wrapper');
  const slides = document.querySelectorAll('.slider-wrapper .slide');
  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;

  wrapper.style.width = `${slides.length * 100}%`;
  slides.forEach(slide => {
    slide.style.width = `${100 / slides.length}%`;
  });

  const updateSlider = () => {
    currentTranslate = -currentIndex * window.innerWidth;
    wrapper.style.transform = `translateX(${currentTranslate}px)`;
    prevTranslate = currentTranslate;
  };

  const switchSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  };

  setInterval(switchSlide, 5000);

  const getX = (e) => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

  const dragStart = (e) => {
    isDragging = true;
    startX = getX(e);
    animationID = requestAnimationFrame(animation);
    wrapper.classList.add('grabbing');
  };

  const dragMove = (e) => {
    if (!isDragging) return;
    const currentX = getX(e);
    currentTranslate = prevTranslate + (currentX - startX);
  };

  const dragEnd = () => {
    cancelAnimationFrame(animationID);
    isDragging = false;
    const moved = currentTranslate - prevTranslate;

    if (moved < -100 && currentIndex < slides.length - 1) currentIndex++;
    if (moved > 100 && currentIndex > 0) currentIndex--;

    updateSlider();
    wrapper.classList.remove('grabbing');
  };

  const animation = () => {
    wrapper.style.transform = `translateX(${currentTranslate}px)`;
    if (isDragging) requestAnimationFrame(animation);
  };

  wrapper.addEventListener('mousedown', dragStart);
  wrapper.addEventListener('touchstart', dragStart);
  wrapper.addEventListener('mousemove', dragMove);
  wrapper.addEventListener('touchmove', dragMove);
  wrapper.addEventListener('mouseup', dragEnd);
  wrapper.addEventListener('touchend', dragEnd);
  wrapper.addEventListener('mouseleave', () => {
    if (isDragging) dragEnd();
  });

  updateSlider();
});
