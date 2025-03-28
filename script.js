document.addEventListener('DOMContentLoaded', function () {
  const hamburgerButton = document.querySelector('.header__hamburger')
  const overlay = document.querySelector('.overlay')
  const menu = document.querySelector('.menu')
  const menuItems = document.querySelectorAll('.menu__item')
  const newSelect = document.getElementById('select')
  const customInput = document.getElementById('custom-input')
  const customOption = newSelect.querySelector('option[value="custom"]')
  const productContainer = document.querySelector('.products__list')
  const normalSelect = document.querySelector('.custom__select-wrapper')
  const customSelect = document.querySelector('.custom__select')
  let currentPage = 1
  let isLoading = false

  const fetchProducts = async (page, selectedValue) => {
    if (isLoading) return
    isLoading = true
    try {
      const response = await fetch(
        `https://brandstestowy.smallhost.pl/api/random?pageNumber=${page}&pageSize=${selectedValue}`
      )
      console.log('Selected value after fatch:', selectedValue, 'page:', page)
      const data = await response.json()

      data.data.forEach((product) => {
        const productDiv = document.createElement('div')
        productDiv.classList.add('product')

        productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.text}">
          <p>Id:${product.id}</p>
        `

        productContainer.appendChild(productDiv)
      })

      currentPage++
      isLoading = false
    } catch (error) {
      console.error('Error fetching products:', error)
      isLoading = false
    }
  }
  const getSelectedValue = () => {
    if (newSelect.value === 'custom' && customInput.value) {
      return parseInt(customInput.value)
    }
    return parseInt(newSelect.value)
  }
  fetchProducts(currentPage, getSelectedValue())

  const handleInputOnEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const dynamicOption = new Option(
        getSelectedValue(),
        getSelectedValue(),
        false,
        true
      )
      newSelect.add(dynamicOption)
      customOption.textContent = 'Inna liczba...'
      toggleInputVisibility()
      fetchProducts(currentPage, getSelectedValue())
    }
  }
  const toggleInputVisibility = () => {
    const isCustom = newSelect.classList.contains('custom--active')
    if (newSelect.value === 'custom' && !isCustom) {
      customSelect.classList.add('custom--active')
      newSelect.classList.add('custom--active')
      customInput.style.display = 'block'
    } else {
      customSelect.classList.remove('custom--active')
      newSelect.classList.remove('custom--active')
      customInput.style.display = 'none'
    }
  }

  const handleSelectedValue = (value) => {
    if (customInput.value) {
      customOption.textContent = value
      currentPage = 1
      productContainer.innerHTML = ''
    } else {
      customOption.textContent = 'Inna liczba...'
      productContainer.innerHTML = ''
      currentPage = 1
      fetchProducts(currentPage, getSelectedValue())
    }
  }

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      fetchProducts(currentPage, getSelectedValue())
    }
  }

  const createCanvas = (input) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = '24px Futura PT'
    return context.measureText(input).width
  }

  hamburgerButton.addEventListener('click', function () {
    menu.classList.toggle('menu--open')
    overlay.classList.toggle('overlay--visible')
    document.body.classList.toggle('overlay--visible')
    hamburgerButton.classList.toggle('menu--active')
  })

  overlay.addEventListener('click', function () {
    menu.classList.remove('menu--open')
    overlay.classList.remove('overlay--visible')
    hamburgerButton.classList.remove('menu--active')
    document.body.classList.remove('overlay--visible')
  })

  menuItems.forEach((item) => {
    item.addEventListener('click', function (e) {
      menuItems.forEach((li) => li.classList.remove('active'))
      e.target.classList.add('active')
    })
  })
  customInput.addEventListener('keydown', handleInputOnEnter)
  window.addEventListener('scroll', handleScroll)
  newSelect.addEventListener('change', (e) => {
    e.preventDefault()

    Array.from(newSelect.options).forEach((option) => {
      if (
        option.value !== 'custom' &&
        !['4', '50', '100'].includes(option.value)
      ) {
        option.remove()
      }
    })
    handleSelectedValue(getSelectedValue())
    toggleInputVisibility()
    normalSelect.style.setProperty(
      '--arrow-position',
      `calc(50% + ${createCanvas(e.target.value)}px)`
    )
  })
})
