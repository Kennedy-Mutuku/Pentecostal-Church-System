const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const patronMiddleware = require('../middlewares/patron');

router.get('/',        getEvents);
router.post('/',       patronMiddleware, createEvent);
router.put('/:id',    patronMiddleware, updateEvent);
router.delete('/:id', patronMiddleware, deleteEvent);

module.exports = router;
