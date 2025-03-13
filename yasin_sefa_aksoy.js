const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
const STORAGE_KEY = "carousel_products";
const FAVORITES_KEY = "favorite_products";

async function fetchProducts() {
    let products = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!products) {
        try {
            const response = await fetch(API_URL);
            products = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        } catch (error) {
            console.error("Ürün verileri yüklenirken hata oluştu:", error);
        }
    }

    return products;
}

function loadStyles() {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "styles.css";
    document.head.appendChild(link);
}
loadStyles();



function buildHTML() {
    const carouselHTML = `
        <div class="custom-carousel">
            <h2 class="carousel-title">Benzer Ürünler</h2>
            <div class="carousel-container">
                <button class="carousel-prev">‹</button>
                <div class="carousel-items"></div>
                <button class="carousel-next">›</button>
            </div>
        </div>
    `;

    $(".product-detail").after(carouselHTML);
}

async function populateCarousel() {
    const products = await fetchProducts();
    const $carousel = $(".carousel-items");
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

    products.forEach(product => {
        const isFavorite = favorites.includes(product.id);
        const itemHTML = `
            <div class="carousel-item">
                <a href="${product.url}" target="_blank">
                    <img src="${product.img}" alt="${product.name}">
                    <p class="product-title">${product.name}</p>
                    <p class="product-price">${product.price.toFixed(2)} TRY</p>
                </a>
                <span class="heart-icon ${isFavorite ? 'active' : ''}" data-id="${product.id}"></span>
            </div>
        `;
        $carousel.append(itemHTML);
    });

    setEvents();
    setCarouselScroll();
}

function setEvents() {
    $(".heart-icon").on("click", function () {
        const productId = $(this).data("id");
        let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
            $(this).removeClass("active");
        } else {
            favorites.push(productId);
            $(this).addClass("active");
        }

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    });
}

function setCarouselScroll() {
    const $carousel = $(".carousel-items");
    const $prevBtn = $(".carousel-prev");
    const $nextBtn = $(".carousel-next");

    $prevBtn.on("click", function () {
        $carousel.animate({ scrollLeft: "-=220" }, 300);
    });

    $nextBtn.on("click", function () {
        $carousel.animate({ scrollLeft: "+=220" }, 300);
    });
}

(async function init() {
    buildHTML();
    await populateCarousel();
})();

