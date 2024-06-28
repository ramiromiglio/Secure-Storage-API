import express from 'express';
import storage_controller from '../controllers/storage-controller.js';
import auth from '../middleware/auth.js';
import oneUseTokenAuth from '../middleware/one-use-token-auth.js';

const router = express.Router();

router.get('/', auth, storage_controller.listFiles);
router.post('/', auth, storage_controller.uploadFile);
router.post('/request-download/:id', auth, storage_controller.requestDownload);
router.get('/:id', [oneUseTokenAuth, auth], storage_controller.downloadFile);

export default router;