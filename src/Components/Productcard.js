import { useNavigate } from "react-router-dom";

function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();
  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="col-md-6 col-lg-3">
      <div className="card h-100 shadow-sm">

        <img
          src={product.image}
          className="card-img-top"
          alt={product.name}
          onClick={handleProductClick}
          style={{
            height: "220px",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />

        <div className="card-body d-flex flex-column">

          <h5 className="card-title fw-bold">
            {product.name}
          </h5>

          <p className="text-primary fw-bold fs-5">
            Rs. {product.price}
          </p>

          <button
            className="btn btn-primary mt-auto"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>

          <button
            className="btn btn-success mt-2"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;
