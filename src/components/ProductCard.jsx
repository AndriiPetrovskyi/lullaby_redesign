import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  return (
    <div>
      <p className="body-text">{product.name}</p>
      <Link to={`/products/${product.slug}`}>
        <button type="button">Переглянути</button>
      </Link>
    </div>
  )
}

export default ProductCard
