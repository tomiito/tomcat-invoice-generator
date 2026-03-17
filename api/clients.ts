import type { VercelRequest, VercelResponse } from '@vercel/node'
import pool from './_lib/db.js'

async function getUserId(auth0Id: string): Promise<string | null> {
  const result = await pool.query(
    'SELECT id FROM profiles WHERE auth0_id = $1',
    [auth0Id],
  )
  return result.rows[0]?.id ?? null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth0_id =
    req.method === 'GET' ? (req.query.auth0_id as string) : req.body?.auth0_id

  if (!auth0_id) {
    return res.status(400).json({ error: 'auth0_id is required' })
  }

  const userId = await getUserId(auth0_id)
  if (!userId) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC',
        [userId],
      )
      return res.status(200).json({ clients: result.rows })
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch clients',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  if (req.method === 'POST') {
    const {
      is_business,
      business_name,
      first_name,
      last_name,
      email,
      country,
      street,
      city,
      zip,
      vat_number,
    } = req.body

    if (!country || !street || !city || !zip) {
      return res
        .status(400)
        .json({ error: 'country, street, city, and zip are required' })
    }

    try {
      const result = await pool.query(
        `INSERT INTO clients (user_id, is_business, business_name, first_name, last_name, email, country, street, city, zip, vat_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          userId,
          is_business ?? false,
          business_name,
          first_name,
          last_name,
          email,
          country,
          street,
          city,
          zip,
          vat_number,
        ],
      )
      return res.status(201).json({ client: result.rows[0] })
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to create client',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  if (req.method === 'PUT') {
    const {
      id,
      is_business,
      business_name,
      first_name,
      last_name,
      email,
      country,
      street,
      city,
      zip,
      vat_number,
    } = req.body

    if (!id) {
      return res.status(400).json({ error: 'id is required' })
    }

    try {
      const result = await pool.query(
        `UPDATE clients
         SET is_business = $3, business_name = $4, first_name = $5, last_name = $6,
             email = $7, country = $8, street = $9, city = $10, zip = $11, vat_number = $12
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [
          id,
          userId,
          is_business ?? false,
          business_name,
          first_name,
          last_name,
          email,
          country,
          street,
          city,
          zip,
          vat_number,
        ],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' })
      }
      return res.status(200).json({ client: result.rows[0] })
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to update client',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({ error: 'id is required' })
    }

    try {
      const result = await pool.query(
        'DELETE FROM clients WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' })
      }
      return res.status(200).json({ deleted: true })
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to delete client',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
