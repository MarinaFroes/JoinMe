import { Response, Request } from 'express'
import { Pool } from 'pg'
import jwt from 'jsonwebtoken'

import { PG_USER, PG_HOST, PG_DB, PG_PW, PG_PORT } from '../util/secrets'
import { GoogleToken } from '../types'

const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB,
  password: PG_PW,
  port: PG_PORT,
  ssl: {
    rejectUnauthorized: false
  }
})

// FIX: Add correct type to user
const googleCreate = (user: unknown) => {
  console.log('googleCreate fired:', user)
}

const findUserById = async (userId: string) => {
  console.log('findUserByID fired for id: ', userId)
}

const findAllUsers = () => {
  console.log('findAllUsers fired')
}

const updateUser = async (userId: string, update: string) => {
  console.log(
    'Update user fired for userId: ',
    userId,
    'update(should be changed from string): ',
    update
  )
}

const deleteUser = (userId: string) => {
  console.log('Delete user fired for id: ', userId)
}

const googleLogin = async (req: Request, res: Response) => {
  const googleToken = req.body
  const decodedToken = jwt.decode(googleToken)
  const {
    given_name,
    family_name,
    picture,
    email
  } = decodedToken as GoogleToken
  try {
    const user = await (
      await pool.query('SELECT * FROM users WHERE email = $1', [email])
    ).rows
    if (user.length === 0) {
      const newUser = await (
        await pool.query(
          'INSERT INTO users (profile_image, first_name, last_name, email) VALUES ($1, $2, $3, $4) RETURNING *',
          [picture, given_name, family_name, email]
        )
      ).rows
      return res.json({
        user: newUser[0]
      })
    } else {
      return res.json({
        user: user[0]
      })
    }
  } catch (error) {
    return res.status(404).json({
      error: error.message
    })
  }
}

const findUserByEmail = async (userEmail: string) => {
  console.log('Find user fired for email: ', userEmail)
}

export default {
  googleCreate,
  findUserById,
  findUserByEmail,
  findAllUsers,
  updateUser,
  googleLogin,
  deleteUser
}
