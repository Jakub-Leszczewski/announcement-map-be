import { Router } from 'express';
import { authRouter } from './auth.router';
import { usersRouter } from './users.router';
import { authJwt } from '../middleware/auth';
import { announcementRouter } from './announcement.router';
import { apiRateLimit } from '../utils/rate-limiter';

export const router = Router();

router.use('/auth', authRouter);
router.use('/users', apiRateLimit, authJwt, usersRouter);
router.use('/announcement', apiRateLimit, announcementRouter);
