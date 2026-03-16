import type { VercelRequest, VercelResponse } from '@vercel/node'
import pool from './_lib/db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { auth0_id } = req.query

    if (!auth0_id || typeof auth0_id !== 'string') {
      return res.status(400).json({ error: 'auth0_id is required' })
    }

    try {
      const result = await pool.query(
        'SELECT * FROM profiles WHERE auth0_id = $1',
        [auth0_id],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      return res.status(200).json({ profile: result.rows[0] })
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  if (req.method === 'PUT') {
    const {
      auth0_id,
      name,
      phone,
      address,
      city,
      zip,
      country,
      vat_id,
      tax_id,
    } = req.body

    if (!auth0_id) {
      return res.status(400).json({ error: 'auth0_id is required' })
    }

    try {
      const result = await pool.query(
        `UPDATE profiles
         SET name = $2, phone = $3, address = $4, city = $5, zip = $6,
             country = $7, vat_id = $8, tax_id = $9
         WHERE auth0_id = $1
         RETURNING *`,
        [auth0_id, name, phone, address, city, zip, country, vat_id, tax_id],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      return res.status(200).json({ profile: result.rows[0] })
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to update profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
