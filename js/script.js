const BASE_URL = "http://localhost:5000/api";


/* ===============================
   PROTECT PAGES
================================= */

const protectedPages = ["products.html", "cart.html"];

const currentPage = window.location.pathname.split("/").pop();

const token = localStorage.getItem("token");

if (protectedPages.includes(currentPage) && !token) {

    alert("Please login first");

    window.location.href = "login.html";
}

/* ===============================
   LOAD PRODUCTS FROM BACKEND
================================= */

const productsContainer = document.getElementById("productsContainer");

if (productsContainer) {

    fetch(`${BASE_URL}/products`)
        .then(res => res.json())
        .then(products => {

            productsContainer.innerHTML = "";

            products.forEach(product => {

                productsContainer.innerHTML += `
                    <div class="card">

                        <img src="./${product.image}" alt="${product.name}">

                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p class="price">$${product.price}</p>

                            <a href="product-details.html?id=${product._id}" class="btn">
                                View Details
                            </a>
                        </div>

                    </div>
                `;
            });

        });
}


/* ===============================
   SEED PRODUCTS TO DATABASE
================================= */

const localProducts = [
    {
        name: "Black Jacket",
        price: 25,
        image: "images/Classic-Black-Jacket1.png",
        description: "Premium black jacket for modern style.",
        quantity: 10
    },
    {
        name: "Grey Jacket",
        price: 45,
        image: "images/Classic-Black-Jacket2.png",
        description: "Stylish grey jacket for everyday wear.",
        quantity: 8
    },
    {
        name: "Grey Jacket",
        price: 35,
        image: "images/Classic-Black-Jacket3.png",
        description: "Stylish grey jacket for everyday wear.",
        quantity: 8
    },
    {
        name: "Grey Jacket",
        price: 15,
        image: "images/Classic-Black-Jacket4.png",
        description: "Stylish grey jacket for everyday wear.",
        quantity: 6
    },
    {
        name: "Running Shoes",
        price: 60,
        image: "images/Running-Shoes1.png",
        description: "Comfortable running shoes for daily use.",
        quantity: 15
    },
    {
        name: "Running Shoes",
        price: 60,
        image: "images/Running-Shoes2.png",
        description: "Comfortable running shoes for daily use.",
        quantity: 15
    },
    {
        name: "Running Shoes",
        price: 40,
        image: "images/Running-Shoes3.png",
        description: "Comfortable running shoes for daily use.",
        quantity: 15
    },
    {
        name: "Luxury Handbag",
        price: 80,
        image: "images/Luxury-Handbag1.png",
        description: "Elegant handbag for premium look.",
        quantity: 5
    },
    {
        name: "Luxury Handbag",
        price: 70,
        image: "images/Luxury-Handbag2.png",
        description: "Elegant handbag for premium look.",
        quantity: 5
    },
    {
        name: "Women Summer Dress",
        price: 50,
        image: "images/Women-Summer-Dress1.png",
        description: "Elegant Dress for premium look.",
        quantity: 5
    }
];

// RUN ONLY ON PRODUCTS PAGE
if (document.getElementById("productsContainer")) {

    fetch(`${BASE_URL}/products`)
        .then(res => res.json())
        .then(async data => {

            // If DB is empty → insert products
            if (data.length === 0) {

                for (let p of localProducts) {
                    await fetch(`${BASE_URL}/products`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(p)
                    });
                }

                console.log("Products inserted into DB");
            }
        });
}


/* ===============================
   ADD TO CART (BACKEND)
================================= */

const productForm = document.getElementById("productForm");

if (productForm) {

    productForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const productId = productForm.getAttribute("data-product-id");
        const name = document.querySelector(".product-name").innerText;
        const price = parseFloat(document.querySelector(".product-price").innerText.replace("$", ""));
        const size = document.getElementById("size").value;
        const quantity = parseInt(document.getElementById("quantity").value);

        const userId = localStorage.getItem("userId") || "123";

        await fetch(`${BASE_URL}/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                item: {
                    productId,
                    name,
                    price,
                    size,
                    quantity
                }
            })
        });

        alert("Added to cart!");
        window.location.href = "cart.html";
    });
}



/* ===============================
   PRODUCT DETAILS (BACKEND)
================================= */

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (productId && document.querySelector(".product-details")) {

    fetch(`${BASE_URL}/products/${productId}`)
        .then(res => res.json())
        .then(product => {

            document.getElementById("productImage").src = `./${product.image}`;
            document.querySelector(".product-name").innerText = product.name;
            document.querySelector(".product-price").innerText = `$${product.price}`;
            document.querySelector(".product-description").innerText = product.description;

            document.getElementById("productForm")
                .setAttribute("data-product-id", product._id);

        });
}

/* ===============================
   DISPLAY CART (BACKEND)
================================= */

const cartContainer = document.getElementById("cartItems");

if (cartContainer) {

    const userId = localStorage.getItem("userId") || "123";

    async function displayCart() {

        const res = await fetch(`${BASE_URL}/cart/${userId}`);
        const data = await res.json();

        if (!data || !data.items || data.items.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty</p>";
            return;
        }

        let total = 0;
        cartContainer.innerHTML = "";

        data.items.forEach((item, index) => {

            total += item.price * item.quantity;

            cartContainer.innerHTML += `
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <p>Size: ${item.size || "N/A"}</p>

                    <input type="number" value="${item.quantity}" min="1"
                    onchange="updateQuantity(${index}, this.value)">

                    <button onclick="removeItem(${index})">Remove</button>
                </div>
            `;
        });

        cartContainer.innerHTML += `<h3>Total: $${total}</h3>`;
    }

    displayCart();

    // REMOVE
    window.removeItem = async function (index) {
        await fetch(`${BASE_URL}/cart/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, index })
        });

        displayCart();
    };

    // UPDATE
    window.updateQuantity = async function (index, qty) {
        await fetch(`${BASE_URL}/cart/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, index, quantity: parseInt(qty) })
        });

        displayCart();
    };
}

/* ===============================
   REGISTER (BACKEND)
================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        await fetch(`${BASE_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        alert("Registered successfully!");
        registerForm.reset();
        window.location.href = "login.html"
    });
}


/* ===============================
   LOGIN (BACKEND)
================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const res = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log("data", data)

        if (!res.ok) {
            alert(data.message);
            return;
        }
        // ✅ SAVE SESSION
        const name = data.user.email.split("@")[0];
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", data.user._id);

        alert("Login successful!");

        window.location.href = "products.html"
    });
}


/* ===============================
   CONTACT FORM
================================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Message sent successfully!");
        contactForm.reset();
    });
}

/* ===============================
   CHECKOUT FUNCTION
================================= */

async function checkout() {

    const userId = localStorage.getItem("userId") || "123";

    const res = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    alert("Order placed successfully!");

    // Refresh cart UI
    if (typeof displayCart === "function") {
        displayCart();
    }
}

/* ===============================
   NAVBAR AUTH UI
================================= */

const userSection = document.getElementById("userSection");

if (userSection) {

    const userName = localStorage.getItem("userName");

    if (userName) {

        userSection.innerHTML = `
            <span style="color:white; margin-right:20px;">
                Welcome, ${userName}
            </span>
            <button onclick="logout()" class="btn style="margin-left:15px;">Logout</button>
        `;

    } else {

        userSection.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");

    alert("Logged out!");

    window.location.href = "login.html";
}