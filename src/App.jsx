
import { useMemo, useState } from "react";
import "./App.css";

const initialProducts = [
  { id: 1, name: "Fresh Tomatoes", category: "Vegetables", price: 30, unit: "kg", emoji: "🍅", farmer: "Ravi Kumar" },
  { id: 2, name: "Organic Rice", category: "Grains", price: 60, unit: "kg", emoji: "🌾", farmer: "Suresh Reddy" },
  { id: 3, name: "Fresh Mangoes", category: "Fruits", price: 80, unit: "kg", emoji: "🥭", farmer: "Lakshmi Devi" },
  { id: 4, name: "Green Spinach", category: "Vegetables", price: 25, unit: "bunch", emoji: "🥬", farmer: "Ramu" },
  { id: 5, name: "Red Lentils", category: "Pulses", price: 90, unit: "kg", emoji: "🫘", farmer: "Anil Kumar" },
  { id: 6, name: "Fresh Bananas", category: "Fruits", price: 45, unit: "dozen", emoji: "🍌", farmer: "Geetha" },
  { id: 7, name: "Wheat", category: "Grains", price: 40, unit: "kg", emoji: "🌿", farmer: "Mohan Rao" },
  { id: 8, name: "Fresh Carrots", category: "Vegetables", price: 35, unit: "kg", emoji: "🥕", farmer: "Krishna" },
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [products, setProducts] = useState(() =>
    readStorage("agriProducts", initialProducts)
  );
  const [cart, setCart] = useState(() =>
    readStorage("agriCart", [])
  );
  const [users, setUsers] = useState(() =>
    readStorage("agriUsers", [])
  );
  const [orders, setOrders] = useState(() =>
    readStorage("agriOrders", [])
  );
  const [currentUser, setCurrentUser] = useState(() =>
    readStorage("agriCurrentUser", null)
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [role, setRole] = useState("Buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Vegetables",
    price: "",
    unit: "kg",
    emoji: "🥬",
  });

  function saveProducts(data) {
    setProducts(data);
    localStorage.setItem("agriProducts", JSON.stringify(data));
  }

  function saveCart(data) {
    setCart(data);
    localStorage.setItem("agriCart", JSON.stringify(data));
  }

  function saveOrders(data) {
    setOrders(data);
    localStorage.setItem("agriOrders", JSON.stringify(data));
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function addToCart(product) {
    if (currentUser?.role !== "Buyer") {
      setMessage("Please login as a Buyer to add products to your cart.");
      setAuthMode("login");
      setShowAuth(true);
      return;
    }

    const existing = cart.find((item) => item.id === product.id);

    const updated = existing
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];

    saveCart(updated);
  }

  function changeQuantity(id, amount) {
    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + amount }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  }

  function handleSignup(event) {
    event.preventDefault();

    if (role === "Admin") {
      setMessage("Admin accounts cannot be created through signup.");
      return;
    }

    const existing = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existing) {
      setMessage("This email is already registered.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("agriUsers", JSON.stringify(updatedUsers));

    setMessage("Account created successfully. Please login.");
    setAuthMode("login");
    setName("");
    setPassword("");
  }

  function handleLogin(event) {
    event.preventDefault();

    if (
      role === "Admin" &&
      email === "admin@agriconnect.com" &&
      password === "admin123"
    ) {
      const admin = {
        name: "Administrator",
        email,
        role: "Admin",
      };

      setCurrentUser(admin);
      localStorage.setItem("agriCurrentUser", JSON.stringify(admin));
      setShowAuth(false);
      setMessage("");
      return;
    }

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password &&
        item.role === role
    );

    if (!user) {
      setMessage("Invalid email, password or account type.");
      return;
    }

    setCurrentUser(user);
    localStorage.setItem("agriCurrentUser", JSON.stringify(user));
    setShowAuth(false);
    setMessage("");
    setName("");
    setPassword("");
  }

  function handleLogout() {
    setCurrentUser(null);
    localStorage.removeItem("agriCurrentUser");
    setCart([]);
    localStorage.removeItem("agriCart");
    setShowCart(false);
    setMessage("You have logged out successfully.");
  }

  function checkout() {
    if (!currentUser || currentUser.role !== "Buyer") {
      setMessage("Please login as a Buyer to place an order.");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    const order = {
      id: Date.now(),
      buyer: currentUser.email,
      buyerName: currentUser.name,
      items: cart,
      total: cartTotal + 40,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    saveOrders([...orders, order]);
    saveCart([]);
    setShowCart(false);
    setMessage("Order placed successfully!");
  }

  function addProduct(event) {
    event.preventDefault();

    if (currentUser?.role !== "Farmer") {
      setMessage("Only farmers can add products.");
      return;
    }

    const product = {
      id: Date.now(),
      ...newProduct,
      price: Number(newProduct.price),
      farmer: currentUser.name,
    };

    saveProducts([...products, product]);

    setNewProduct({
      name: "",
      category: "Vegetables",
      price: "",
      unit: "kg",
      emoji: "🥬",
    });

    setMessage("Product added successfully.");
  }

  function updateOrderStatus(orderId, status) {
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    saveOrders(updated);
  }

  const visibleOrders = orders.filter((order) => {
    if (currentUser?.role === "Admin") return true;
    if (currentUser?.role === "Buyer") {
      return order.buyer === currentUser.email;
    }
    return order.items.some(
      (item) => item.farmer === currentUser?.name
    );
  });

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#home">🌾 AgriConnect</a>

        <nav>
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          {currentUser && <a href="#dashboard">Dashboard</a>}
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          {currentUser ? (
            <>
              <span className="welcome-user">
                Hi, {currentUser.name}
              </span>
              {currentUser.role === "Buyer" && (
                <button className="cart-button" onClick={() => setShowCart(true)}>
                  🛒 Cart ({cartCount})
                </button>
              )}
              <button className="login-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="login-button"
              onClick={() => {
                setAuthMode("login");
                setRole("Buyer");
                setMessage("");
                setShowAuth(true);
              }}
            >
              Login / Signup
            </button>
          )}
        </div>
      </header>

      {message && !showAuth && (
        <div className="notice">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">FARM FRESH • NATURALLY GOOD</span>
            <h1>Fresh From Farm,<br /><span>Direct To Your Home.</span></h1>
            <p>
              Connecting farmers directly with buyers. Discover fresh,
              quality agricultural products at fair prices.
            </p>
            <a className="primary-button" href="#products">
              Explore Products →
            </a>
          </div>

          <div className="hero-art">
            <div className="hero-circle">🌾</div>
            <span className="floating-produce produce-one">🥕</span>
            <span className="floating-produce produce-two">🍅</span>
            <span className="floating-produce produce-three">🥬</span>
          </div>
        </section>

        <section className="benefits">
          <div><span>🌱</span><div><strong>Farm Fresh</strong><small>Fresh from the fields</small></div></div>
          <div><span>🤝</span><div><strong>Direct Connection</strong><small>Buy directly from farmers</small></div></div>
          <div><span>💚</span><div><strong>Fair Prices</strong><small>Better value for everyone</small></div></div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <span className="eyebrow">OUR MARKETPLACE</span>
            <h2>Explore Fresh Products</h2>
            <p>Choose from quality products grown by local farmers.</p>
          </div>

          <div className="filters">
            <input
              type="search"
              placeholder="Search agricultural products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Grains">Grains</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Pulses">Pulses</option>
            </select>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">{product.emoji}</div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="farmer-name">👨‍🌾 {product.farmer}</p>
                  <div className="product-bottom">
                    <strong>₹{product.price}<small> / {product.unit}</small></strong>
                    <button onClick={() => addToCart(product)}>+ Add</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="empty-message">No products found.</p>
          )}
        </section>

        {currentUser && (
          <section className="dashboard-section" id="dashboard">
            <span className="eyebrow">{currentUser.role} MODULE</span>
            <h2>{currentUser.role} Dashboard</h2>
            <p>Welcome, {currentUser.name}.</p>

            {currentUser.role === "Buyer" && (
              <div className="dashboard-card">
                <h3>My Orders</h3>
                <p>Total orders: {visibleOrders.length}</p>
                {visibleOrders.map((order) => (
                  <div className="order-row" key={order.id}>
                    <span>Order #{order.id} — ₹{order.total}</span>
                    <strong>{order.status}</strong>
                  </div>
                ))}
                {visibleOrders.length === 0 && <p>No orders yet.</p>}
              </div>
            )}

            {currentUser.role === "Farmer" && (
              <>
                <div className="dashboard-card">
                  <h3>Add a Product</h3>
                  <form className="product-form" onSubmit={addProduct}>
                    <input
                      placeholder="Product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      <option>Vegetables</option>
                      <option>Grains</option>
                      <option>Fruits</option>
                      <option>Pulses</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      placeholder="Price in rupees"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                    />
                    <button className="primary-button" type="submit">Add Product</button>
                  </form>
                </div>

                <div className="dashboard-card">
                  <h3>My Products</h3>
                  {products.filter((p) => p.farmer === currentUser.name).map((p) => (
                    <div className="order-row" key={p.id}>
                      {p.emoji} {p.name} — ₹{p.price}/{p.unit}
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentUser.role === "Admin" && (
              <div className="admin-stats">
                <div className="dashboard-card"><h3>Registered Users</h3><strong>{users.length}</strong></div>
                <div className="dashboard-card"><h3>Products</h3><strong>{products.length}</strong></div>
                <div className="dashboard-card"><h3>Orders</h3><strong>{orders.length}</strong></div>
                <div className="dashboard-card">
                  <h3>Users List</h3>
                  {users.map((user) => (
                    <div className="order-row" key={user.id}>
                      {user.name} — {user.role}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(currentUser.role === "Farmer" || currentUser.role === "Admin") && (
              <div className="dashboard-card">
                <h3>Order Management</h3>
                {visibleOrders.map((order) => (
                  <div className="order-row" key={order.id}>
                    <span>Order #{order.id} — {order.buyerName} — ₹{order.total}</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </div>
                ))}
                {visibleOrders.length === 0 && <p>No orders available.</p>}
              </div>
            )}
          </section>
        )}

        <section className="about-section" id="about">
          <span className="eyebrow">ABOUT AGRICONNECT</span>
          <h2>Supporting Farmers, Serving Communities.</h2>
          <p>
            AgriConnect is a digital marketplace designed to help farmers
            reach buyers directly and make fresh agricultural products easier
            to discover.
          </p>
        </section>
      </main>

      <footer>
        <strong>🌾 AgriConnect</strong>
        <p>Connecting Farmers and Buyers • © 2026 AgriConnect</p>
      </footer>

      {showAuth && (
        <div className="auth-overlay">
          <div className="auth-box">
            <button className="auth-close" onClick={() => setShowAuth(false)}>×</button>
            <h2>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>
            <p>AgriConnect – Farmer Marketplace</p>

            <div className="auth-tabs">
              <button
                className={authMode === "login" ? "active" : ""}
                onClick={() => { setAuthMode("login"); setMessage(""); }}
              >
                Login
              </button>
              <button
                className={authMode === "signup" ? "active" : ""}
                onClick={() => { setAuthMode("signup"); setRole("Buyer"); setMessage(""); }}
              >
                Signup
              </button>
            </div>

            <form onSubmit={authMode === "login" ? handleLogin : handleSignup}>
              {authMode === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Buyer">Buyer</option>
                <option value="Farmer">Farmer</option>
                {authMode === "login" && <option value="Admin">Admin</option>}
              </select>

              <button className="auth-submit" type="submit">
                {authMode === "login" ? "Login" : "Create Account"}
              </button>
            </form>

            {message && <p className="auth-message">{message}</p>}

            {authMode === "login" && (
              <p className="admin-hint">
                Demo Admin: admin@agriconnect.com / admin123
              </p>
            )}
          </div>
        </div>
      )}

      {showCart && (
        <div className="auth-overlay">
          <div className="auth-box cart-box">
            <button className="auth-close" onClick={() => setShowCart(false)}>×</button>
            <h2>Your Shopping Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div className="cart-row" key={item.id}>
                    <span>{item.emoji} {item.name}</span>
                    <div>
                      <button onClick={() => changeQuantity(item.id, -1)}>−</button>
                      <strong>{item.quantity}</strong>
                      <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                    </div>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
                <div className="cart-total">
                  <p>Subtotal: ₹{cartTotal}</p>
                  <p>Delivery: ₹40</p>
                  <h3>Total: ₹{cartTotal + 40}</h3>
                </div>
                <button className="auth-submit" onClick={checkout}>
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
