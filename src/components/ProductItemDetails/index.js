import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {},
    similarProductsList: [],
    count: 1,
  }

  componentDidMount() {
    this.getProductItems()
  }

  getProductItems = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedDataOfProductsItems = await response.json()
      const updatedDataProductItems = {
        title: fetchedDataOfProductsItems.title,
        brand: fetchedDataOfProductsItems.brand,
        totalReviews: fetchedDataOfProductsItems.total_reviews,
        id: fetchedDataOfProductsItems.id,
        imageUrl: fetchedDataOfProductsItems.image_url,
        rating: fetchedDataOfProductsItems.rating,
        availability: fetchedDataOfProductsItems.availability,
        price: fetchedDataOfProductsItems.price,
        description: fetchedDataOfProductsItems.description,
      }

      const updatedDataSimilarProducts = fetchedDataOfProductsItems.similar_products.map(
        similarItem => ({
          title: similarItem.title,
          brand: similarItem.brand,
          totalReviews: similarItem.total_reviews,
          id: similarItem.id,
          imageUrl: similarItem.image_url,
          rating: similarItem.rating,
          availability: similarItem.availability,
          style: similarItem.style,
          price: similarItem.price,
          description: similarItem.description,
        }),
      )
      //   console.log(fetchedDataOfProductsItems)
      this.setState({
        productItemDetails: updatedDataProductItems,
        similarProductsList: updatedDataSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickIncrease = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onClickDecrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  renderProductItemDetailsAndSimilarProducts = () => {
    const {productItemDetails, count, similarProductsList} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productItemDetails

    return (
      <div className="product-item-container">
        <div className="product-data-container">
          <div className="image-container">
            <img src={imageUrl} alt="product" className="product-img" />
          </div>
          <div className="product-details-container">
            <h1>{title}</h1>
            <p className="price">{`Rs ${price}/-`}</p>
            <div className="rating-reviews-container">
              <div className="rating-star-container">
                <p className="rating">{rating}</p>
                <button type="button" className="rating-btn">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-img"
                  />
                </button>
              </div>
              <p className="reviews">{`${totalReviews} Reviews`}</p>
            </div>
            <p className="description">{description}</p>
            <p>{`Availability: ${availability}`}</p>
            <p>{`Brand: ${brand}`}</p>
            <hr className="horizontal-line" />
            <div className="counter-container">
              <button type="button" data-testid="minus" className="btn">
                <BsDashSquare
                  onClick={this.onClickDecrease}
                  className="counter-icons"
                />
              </button>
              <p className="count">{count}</p>
              <button type="button" data-testid="plus" className="btn">
                <BsPlusSquare
                  onClick={this.onClickIncrease}
                  className="counter-icons"
                />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <div className="similar-products-container">
          {similarProductsList.map(eachItem => (
            <SimilarProductItem
              key={eachItem.id}
              similarProductsData={eachItem}
            />
          ))}
        </div>
      </div>
    )
  }

  renderProductItemFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button
          type="button"
          className="continue-shopping-btn"
          //   onClick={this.onClickContinueShopping}
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductsItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetailsAndSimilarProducts()
      case apiStatusConstants.failure:
        return this.renderProductItemFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    // const {apiStatus} = this.state
    // console.log(apiStatus)
    return (
      <div>
        <Header />
        {this.renderProductsItemDetails()}
      </div>
    )
  }
}

export default ProductItemDetails
