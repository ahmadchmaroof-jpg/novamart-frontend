import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // ================= PRODUCT =================

  useEffect(() => {
    fetch(`http://localhost:5000/api/products`)
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find(
          (item) => item.id === Number(id)
        );

        setProduct(foundProduct);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  // ================= REVIEWS =================

  const fetchReviews = useCallback(() => {
    fetch(`http://localhost:5000/api/reviews/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ================= ADD REVIEW =================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    setReviewMessage("");

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setReviewMessage("Please login to submit a review.");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      setReviewMessage("Please login again.");
      return;
    }

    if (!user.name || !user.email) {
      setReviewMessage("Please login again.");
      return;
    }

    if (!reviewText.trim()) {
      setReviewMessage("Please write a review.");
      return;
    }

    try {
      setReviewLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: Number(id),
            customer_name: user.name,
            customer_email: user.email,
            rating: Number(rating),
            review_text: reviewText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setReviewMessage(
          data.message || "Failed to add review."
        );
        setReviewLoading(false);
        return;
      }

      setReviewMessage("Review added successfully! ⭐");
      setReviewText("");
      setRating(5);

      fetchReviews();

      setReviewLoading(false);
    } catch (error) {
      console.error(error);

      setReviewMessage(
        "Something went wrong. Please try again."
      );

      setReviewLoading(false);
    }
  };

  // ================= BUY NOW =================

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  if (!product) {
    return (
      <div className="container py-5">
        <h4>Product not found.</h4>
      </div>
    );
  }

  // ================= AVERAGE RATING =================

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <section className="product-details-page py-5">
      <div className="container">

        {/* BACK BUTTON */}

        <button
          className="btn btn-secondary mb-4 back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* PRODUCT DETAILS */}

        <div className="row g-5 align-items-center">

          <div className="col-md-6">

            <img
              src={product.image}
              alt={product.name}
              className="img-fluid product-main-image"
            />

          </div>

          <div className="col-md-6">

            <h1 className="fw-bold mb-3 product-title">
              {product.name}
            </h1>

            <h3 className="text-primary fw-bold mb-3 product-price">
              Rs. {product.price}
            </h3>

            {/* RATING SUMMARY */}

            <div className="mb-4 rating-summary">

              <span className="text-warning fs-4 rating-stars">
                {"★".repeat(
                  Math.round(Number(averageRating))
                )}
              </span>

              <span className="text-secondary fs-4 rating-stars">
                {"★".repeat(
                  5 - Math.round(Number(averageRating))
                )}
              </span>

              <span className="ms-2 text-muted">
                {averageRating} / 5{" "}
                ({reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"})
              </span>

            </div>

            <p className="text-muted mb-4 product-description">
              High-quality {product.name} available at
              an affordable price. Add this product to
              your cart and enjoy a simple and convenient
              shopping experience.
            </p>

            <div className="product-actions">

              <button
                className="btn btn-primary btn-lg me-2"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>

              <button
                className="btn btn-success btn-lg"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

            </div>

          </div>

        </div>

        {/* ================= REVIEWS SECTION ================= */}

        <div className="row mt-5">

          <div className="col-lg-8">

            <h2 className="fw-bold mb-4 reviews-heading">
              Customer Reviews
            </h2>

            {/* REVIEW FORM */}

            <div className="card shadow-sm p-4 mb-5 review-form">

              <h4 className="fw-bold mb-3">
                Write a Review
              </h4>

              {reviewMessage && (
                <div
                  className={`alert ${
                    reviewMessage.includes("successfully")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                >
                  {reviewMessage}
                </div>
              )}

              <form onSubmit={handleSubmitReview}>

                {/* STAR SELECTOR */}

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Your Rating
                  </label>

                  <div className="star-selector">

                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="btn p-0 me-1"
                        onClick={() => setRating(star)}
                        style={{
                          fontSize: "32px",
                          color:
                            star <= rating
                              ? "#ffc107"
                              : "#d3d3d3",
                        }}
                      >
                        ★
                      </button>
                    ))}

                  </div>

                  <small className="text-muted">
                    {rating} out of 5 stars
                  </small>

                </div>

                {/* REVIEW TEXT */}

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Your Review
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write your experience with this product..."
                    value={reviewText}
                    onChange={(e) =>
                      setReviewText(e.target.value)
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={reviewLoading}
                >
                  {reviewLoading
                    ? "Submitting..."
                    : "Submit Review"}
                </button>

              </form>

            </div>

            {/* REVIEWS LIST */}

            {reviews.length === 0 ? (
              <div className="alert alert-info">
                No reviews yet. Be the first to review
                this product! ⭐
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="card shadow-sm mb-3 review-card"
                >
                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-start">

                      <div>

                        <h5 className="fw-bold mb-1">
                          {review.customer_name}
                        </h5>

                        <div className="text-warning fs-5">
                          {"★".repeat(
                            Number(review.rating)
                          )}

                          <span className="text-secondary">
                            {"★".repeat(
                              5 - Number(review.rating)
                            )}
                          </span>
                        </div>

                      </div>

                      <small className="text-muted">
                        {review.created_at
                          ? new Date(
                              review.created_at
                            ).toLocaleString()
                          : ""}
                      </small>

                    </div>

                    <p className="mt-3 mb-0">
                      {review.review_text}
                    </p>

                  </div>
                </div>
              ))
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

export default ProductDetails;