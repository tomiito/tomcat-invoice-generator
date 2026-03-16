import { useParams } from 'react-router-dom'

export default function ViewInvoice() {
  const { id } = useParams()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Invoice {id}</h1>
      <p className="text-gray-500 mt-2">Invoice details coming soon.</p>
    </div>
  )
}
