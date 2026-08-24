import { useState } from 'react';

const CartSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile responsive CSS - scoped to this component's markup */}
      <style>{`
        /* ---------- Tablet (max-width: 767px) ---------- */
        @media (max-width: 767px) {
          .side_bar {
            width: 340px;
            padding: 24px;
            padding-top: 22px;
          }

          .side_bar .cart-title h4 {
            font-size: 20px;
          }

          .side_bar .cartmini__widget-item {
            gap: 16px;
            padding: 16px 0;
            padding-top: 22px;
            padding-bottom: 20px;
          }

          .side_bar .cartmini__widget-item .cartmini__thumb {
            max-width: 70px;
            height: 70px;
          }

          .side_bar .cartmini__widget-item .cartmini__content h5 {
            font-size: 15px;
          }

          .side_bar .cartmini__checkout {
            margin-top: 100px;
            padding-bottom: 70px;
          }
        }

        /* ---------- Mobile (max-width: 575px) ---------- */
        @media (max-width: 575px) {
          .side_bar {
            width: 100%;
            max-width: 100%;
            padding: 20px;
            padding-top: 20px;
          }

          .side_bar .cart-title {
            margin-bottom: 30px !important;
          }
          .side_bar .cart-title h4 {
            font-size: 18px;
          }

          .side_bar .x-mark-icon {
            right: 20px;
            top: 18px;
            font-size: 18px;
          }

          .side_bar .cartmini__widget-item {
            gap: 12px;
            padding-top: 20px;
            padding-bottom: 18px;
          }

          .side_bar .cartmini__widget-item .cartmini__thumb {
            max-width: 60px;
            height: 60px;
          }

          .side_bar .cartmini__widget-item .cartmini__content h5 {
            font-size: 14px;
            line-height: 1.4;
          }

          .side_bar .cartmini__widget-item .cartmini__price-wrapper {
            font-size: 13px;
          }

          .side_bar .cartmini__del {
            top: 6px;
            right: 0;
          }

          .side_bar .cartmini__checkout {
            margin-top: 80px;
            padding: 16px 0;
            padding-bottom: 60px;
          }

          .side_bar .cartmini__checkout .cartmini__checkout-title h4 {
            font-size: 16px;
          }
          .side_bar .cartmini__checkout .cartmini__checkout-title span {
            font-size: 16px;
          }

          .side_bar .cartmini__checkout-btn .theme-btn {
            font-size: 14px;
            height: 48px;
            line-height: 48px;
          }
        }

        /* ---------- Extra small phones (max-width: 380px) ---------- */
        @media (max-width: 380px) {
          .side_bar {
            padding: 16px;
          }

          .side_bar .cartmini__widget-item {
            flex-wrap: wrap;
          }

          .side_bar .cartmini__widget-item .cartmini__thumb {
            max-width: 54px;
            height: 54px;
          }

          .side_bar .cartmini__widget-item .cartmini__content h5 {
            font-size: 13px;
          }

          .side_bar .cartmini__checkout-btn .theme-btn {
            font-size: 13px;
            height: 44px;
            line-height: 44px;
          }
        }

        /* Overlay dims the page behind the cart on all screen sizes */
        .side_bar_overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99998;
        }
      `}</style>

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