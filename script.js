document.addEventListener("DOMContentLoaded", function () {
  const hamburgerButton = document.querySelector(".header__hamburger");
  const overlay = document.querySelector(".overlay");
  const menu = document.querySelector(".menu");
  const menuItems = document.querySelectorAll(".menu__item");

  if (!hamburgerButton || !overlay || !menu) {
    console.error("Nie znaleziono wymaganych elementów w DOM.");
    return;
  }

  hamburgerButton.addEventListener("click", function () {
    menu.classList.toggle("menu--open");
    overlay.classList.toggle("overlay--visible");
    document.body.classList.toggle("overlay--visible");
    hamburgerButton.classList.toggle("menu--active");
  });

  overlay.addEventListener("click", function () {
    menu.classList.remove("menu--open");
    overlay.classList.remove("overlay--visible");
    hamburgerButton.classList.remove("menu--active");
    document.body.classList.remove("overlay--visible");
  });

  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      menuItems.forEach((li) => li.classList.remove("active"));
      e.target.classList.add("active");
    });
  });
});

const addIconToList = (className) => {
  const list = document.querySelectorAll(className);

  list.forEach((el, i) => {
    el.classList.add(`.ico${i + 1}`);
  });
};

document.addEventListener("DOMContentLoaded", () =>
  addIconToList(".benefit__icon")
);
