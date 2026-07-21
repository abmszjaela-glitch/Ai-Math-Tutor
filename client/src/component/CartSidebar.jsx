import { useState } from 'react';

const CartSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Cart Open Button */}
      <button
        className="cart-icon"
        onClick={() => setIsOpen(true)}
      >
        <i className="fas fa-shopping-cart"></i>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="side_bar_overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        id="targetElement"
        className={`side_bar slideInRight ${
          isOpen ? '' : 'side_bar_hidden'
        }`}
      >
        <div className="cart-title mb-50">
          <h4>Shopping Cart</h4>
        </div>

        <div className="cartmini__widget">

          {/* Product 1 */}
          <div className="cartmini__widget-item">
            <div className="cartmini__thumb">
              <a href="/shop-details">
                <img
                  src="/assets/img/shop-cart1.png"
                  alt="Baby Bib Pink"
                />
              </a>
            </div>

            <div className="cartmini__content">
              <h5>
                <a href="/shop-details">
                  Baby Bib Pink
                </a>
              </h5>

              <div className="cartmini__price-wrapper">
                <span className="cartmini__price">
                  $46.00
                </span>

                <span className="cartmini__quantity">
                  x2
                </span>
              </div>
            </div>

            <button className="cartmini__del">
              <i className="fal fa-times"></i>
            </button>
          </div>

          {/* Product 2 */}
          <div className="cartmini__widget-item">
            <div className="cartmini__thumb">
              <a href="/shop-details">
                <img
                  src="/assets/img/shop-cart2.png"
                  alt="Plastic Roller Mop"
                />
              </a>
            </div>

            <div className="cartmini__content">
              <h5>
                <a href="/shop-details">
                  Plastic Roller Mop
                </a>
              </h5>

              <div className="cartmini__price-wrapper">
                <span className="cartmini__price">
                  $78.00
                </span>

                <span className="cartmini__quantity">
                  x1
                </span>
              </div>
            </div>

            <button className="cartmini__del">
              <i className="fal fa-times"></i>
            </button>
          </div>

          {/* Checkout */}
          <div className="cartmini__checkout">

            <div className="cartmini__checkout-title mb-4">
              <h4>Subtotal:</h4>
              <span>$113.00</span>
            </div>

            <div className="cartmini__checkout-btn">
              <a
                href="/shop-cart"
                className="theme-btn mb-2 w-100"
              >
                View Cart
              </a>

              <a
                href="/checkout"
                className="theme-btn w-100 style-2"
              >
                Checkout
              </a>
            </div>

          </div>
        </div>

        {/* Close Button */}
        <button
          className="x-mark-icon"
          onClick={() => setIsOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </>
  );
};

export default CartSidebar;