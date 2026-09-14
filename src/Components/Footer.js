function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">
        <div className="row g-4">

          <div className="col-md-4">
            <h3 className="fw-bold mb-3">
              NovaMart
            </h3>

            <p className="text-light">
              Your trusted online shopping destination
              for quality products at great prices.
            </p>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold mb-3">
              Quick Links
            </h5>

            <p className="mb-2">
              <a
                href="/"
                className="text-white text-decoration-none"
              >
                Home
              </a>
            </p>

            <p className="mb-2">
              <a
                href="/#products"
                className="text-white text-decoration-none"
              >
                Products
              </a>
            </p>

            <p className="mb-0">
              <a
                href="/cart"
                className="text-white text-decoration-none"
              >
                Cart
              </a>
            </p>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold mb-3">
              Contact
            </h5>

            <p className="mb-2">
              📧 support@novamart.com
            </p>

            <p className="mb-2">
              📞 +92 300 1234567
            </p>

            <p className="mb-0">
              📍 Lahore, Pakistan
            </p>
          </div>

        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center">
          <p className="mb-0 text-light">
            © 2026 NovaMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
