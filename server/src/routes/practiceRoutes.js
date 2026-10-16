const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const { catalog, start, submit } = require('../controllers/practiceController');
const router = express.Router();
router.use(authenticate);
router.get('/catalog', catalog);
router.post('/attempts', start);
router.post('/submit', submit);
module.exports = router;
