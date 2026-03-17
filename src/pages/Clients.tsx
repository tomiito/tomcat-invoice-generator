import { useState } from 'react'
import useClients, {
  getClientDisplayName,
  clientToForm,
} from '../hooks/useClients'
import type { Client, ClientFormData } from '../hooks/useClients'
import ClientForm from '../components/ClientForm'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Badge } from '../components/ui/badge'

type View = 'list' | 'create' | { edit: Client }

export default function Clients() {
  const { clients, loading, error, createClient, updateClient, deleteClient } =
    useClients()
  const [view, setView] = useState<View>('list')
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleCreate(data: ClientFormData) {
    await createClient(data)
    setView('list')
  }

  async function handleUpdate(data: ClientFormData) {
    if (typeof view === 'object' && 'edit' in view) {
      await updateClient(view.edit.id, data)
      setView('list')
    }
  }

  async function handleDelete(client: Client) {
    if (!window.confirm(`Delete ${getClientDisplayName(client)}?`)) return
    setDeleting(client.id)
    try {
      await deleteClient(client.id)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading clients...</p>
      </div>
    )
  }

  if (view === 'create') {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">New Client</h1>
        <Card>
          <CardContent className="pt-6">
            <ClientForm
              onSubmit={handleCreate}
              onCancel={() => setView('list')}
              submitLabel="Create Client"
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (typeof view === 'object' && 'edit' in view) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Client</h1>
        <Card>
          <CardContent className="pt-6">
            <ClientForm
              initial={clientToForm(view.edit)}
              onSubmit={handleUpdate}
              onCancel={() => setView('list')}
              submitLabel="Update Client"
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={() => setView('create')}>New Client</Button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {clients.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-gray-500 font-normal">
              No clients yet. Create your first client to get started.
            </CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {getClientDisplayName(client)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={client.is_business ? 'default' : 'secondary'}
                      >
                        {client.is_business ? 'Business' : 'Individual'}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.country}</TableCell>
                    <TableCell>{client.email || '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setView({ edit: client })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(client)}
                        disabled={deleting === client.id}
                      >
                        {deleting === client.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
