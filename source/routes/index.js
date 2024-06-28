import express from 'express';
import auth_routes from './auth-routes.js';
import storage_routes from './storage-routes.js';

const router = express.Router();

router.use('/api/auth', auth_routes);
router.use('/api/storage', storage_routes);

export default router;