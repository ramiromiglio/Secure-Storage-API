import express from 'express';
import auth_controller from '../controllers/auth-controller.js';
import schema_validator from '../middleware/schema-validator.js';

const router = express.Router();

router.post('/signup', schema_validator('/auth/signup'), auth_controller.signUp);
router.post('/signin', schema_validator('/auth/signin'), auth_controller.signIn);

export default router;