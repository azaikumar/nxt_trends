import './index.css'

const SimilarProductItem = props => {
  const {similarProductsData} = props
  const {imageUrl, title, brand, price, rating} = similarProductsData
  return (
    <li className="similar-products-items-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <p className="title-sp">{title}</p>
      <p>{`by ${brand}`}</p>
      <div className="price-rating-container">
        <p className="price-sp">{`Rs. ${price}/-`}</p>
        <div className="rating-star-container-sp">
          <p className="rating">{rating}</p>
          <button type="button" className="rating-btn">
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star-img"
            />
          </button>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
