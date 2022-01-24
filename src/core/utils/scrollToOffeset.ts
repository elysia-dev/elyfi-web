const scrollToOffeset = (ref: string, offset: number): void => {
  const element = document.getElementById(ref);

  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element!.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

export default scrollToOffeset;
