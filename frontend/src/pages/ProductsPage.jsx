import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { getProducts } from '../services/products.js'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main>
      <h1 className="h1-heading">Усі товари</h1>
      {error && <p>{error}</p>}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </main>
  )
}

export default ProductsPage
