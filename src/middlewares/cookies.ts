import { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'

const cookies = cookieParser('my super secret code')

export default cookies
