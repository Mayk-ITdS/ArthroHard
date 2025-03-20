document.addEventListener("DOMContentLoaded", function () {
  const hamburgerButton = document.querySelector(".header__hamburger");
  const overlay = document.querySelector(".overlay");
  const menu = document.querySelector(".menu");
  const menuItems = document.querySelectorAll(".menu__item");
  const selectWrapper = document.querySelector(".custom__select");
  const productSelect = document.getElementById("product-select");
  const customInput = document.getElementById("custom-input");
  const customOption = productSelect.querySelector('option[value="custom"]');
  const productContainer = document.querySelector(".products__list");

  let currentPage = 1;
  let isLoading = false;
  let selectedValue = productSelect.value;
  const fetchProducts = async (page, selectedValue) => {
    isLoading = true;

    try {
      selectedValue =
        productSelect.value === "custom" && customInput.value
          ? parseInt(customInput.value)
          : parseInt(productSelect.value);
      const response = await fetch(
        `https://brandstestowy.smallhost.pl/api/random?pageNumber=${page}&pageSize=${selectedValue}`
      );
      const data = await response.json();

      data.data.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.text}">
          <p>Id:${product.id}</p>
        `;

        productContainer.appendChild(productDiv);
      });

      if (data.data.length > data.totalPages) {
        currentPage++;
        isLoading = false;
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      isLoading = false;
    }
  };

  fetchProducts(currentPage, selectedValue);

  const changePostition = () => {
    if (select.value === "custom") {
      selectWrapper.style.setProperty("--arrow-position", "72%");
    } else {
      selectWrapper.style.setProperty("--arrow-position", "58%");
    }
  };
  const hideInputOnEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      customInput.style.display = "none";
      customInput.blur();
    }
  };
  const toggleInputVisibility = () => {
    if (productSelect.value === "custom") {
      customInput.style.display = "block";
      customInput.focus();
    } else {
      customInput.style.display = "none";
    }
  };
  const clearCustomOptionText = () => {
    customOption.textContent = "Inna liczba...";
  };

  const handleSelectedValue = () => {
    if (selectedValue === "custom") {
      let value = parseInt(customInput.value);
      customOption.textContent = value;
      selectedValue = value;
      productSelect.value = "custom";
      fetchProducts(currentPage, selectedValue);
    } else {
      selectedValue = parseInt(selectedValue);
      productContainer.innerHTML = "";
      fetchProducts(currentPage, selectedValue);
      customOption.textContent = "Inna liczba...";
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      selectedValue < 100
    ) {
      fetchProducts(currentPage, selectedValue);
    }
  };

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

  customInput.addEventListener("keydown", hideInputOnEnter);
  productSelect.addEventListener("change", toggleInputVisibility);
  productSelect.addEventListener("click", clearCustomOptionText);
  productSelect.addEventListener("change", handleSelectedValue);
  select.addEventListener("change", changePostition);
  window.addEventListener("scroll", handleScroll);
  changePostition();
});
