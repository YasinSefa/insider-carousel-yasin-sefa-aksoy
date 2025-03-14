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

const buildCSS = () => {
    const css = `
    .custom-carousel {
        margin-top: 30px;
        background: #fff;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        max-width: 100%;
        overflow: hidden;
    }
    .carousel-title {
        font-size: 30px;
        font-weight: bold;
        margin: 15px 10px;
    }
    .carousel-container {
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        width: 100%;
    }
    .carousel-items {
        display: flex;
        gap: 15px;
        overflow-x: auto;
        scroll-behavior: smooth;
        white-space: nowrap;
        padding: 20px 0;
        width: 100%;
        -ms-overflow-style: none; 
        scrollbar-width: none; 
    }

    .carousel-items a {
        text-decoration: none;
    }

    .carousel-items a:hover {
        text-decoration: none;
    }

    .carousel-item {
        min-width: 210px;
        max-width: 220px;
        margin-left: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        background: #fff;
        display: inline-block;
        position: relative;
        transition: transform 0.2s;
        overflow: hidden;
    }
    .carousel-item:hover {
        transform: scale(1.05);
    }
    .carousel-item img {
        width: 100%;
        border-radius: 5px;
        height: auto;
        object-fit: cover;
    }
    .product-title {
        margin: 10px;
        font-size: 14px;
        color: #333;
        white-space: normal; 
        overflow: hidden; 
        text-overflow: ellipsis; 
        word-wrap: break-word; 
        line-height: 1.2; 
    }


    .heart-icon {
        font-size: 14px;
        margin: px 0;
        padding: 0 5px;
        color: #333;
        font-weight: bold;
        white-space: normal; 
        overflow: hidden; 
        text-overflow: ellipsis; 
        word-wrap: break-word; 
        line-height: 1.2; 
    }


    .carousel-item:hover {
        transform: scale(1.05);
    }
        
    .product-price {
        font-size: 16px;
        font-weight: bold;
        color: #193DB0;
        margin: 20px 10px;
    }
    .carousel-prev, .carousel-next {
        position: absolute;
        background: none;
        color: white;
        border: none;
        cursor: pointer;
        padding: 10px 15px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        border-radius: 50%;
        color: rgba(0, 0, 0, 0.5); 
        font-size: 50px;
    }
    .carousel-prev { left: -10px; }
    .carousel-next { right: -10px; }
    .heart-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 32px; 
        height: 32px;
        background: white; 
        border-radius: 50%; 
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
        cursor: pointer;
        transition: background 0.3s ease, box-shadow 0.3s ease;
    }
    .heart-icon:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
    }
    .heart-icon::before {
        content: "♡"; 
        font-size: 18px;
        color: #555;
        transition: color 0.3s ease;
    }
    .heart-icon.active {
        background: white; 
    }
    .heart-icon.active::before {
        content: "💙";  
        color: blue; 
    }
    `;

    $('<style>').addClass('carousel-style').html(css).appendTo('head');
};


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
    buildCSS();
    await populateCarousel();
})();

