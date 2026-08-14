import { useParams } from 'react-router-dom'

function ProductPage() {
  const { slug } = useParams()

  return (
    <main>
      <h1 className="h1-heading">Товар {slug}</h1>
    </main>
  )
}

export default ProductPage
