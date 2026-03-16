import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/clients', label: 'Clients' },
  { path: '/settings', label: 'Settings' },
]

export default function Navbar() {
  const { user, logout } = useAuth0()
  const location = useLocation()

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold">
            Invoice Generator
          </Link>
          <div className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm ${
                  location.pathname === item.path
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.name}</span>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
