const express          = require('express');
const router           = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent, uploadPoster } = require('../controllers/eventController');
const patronMiddleware = require('../middlewares/patron');

router.get('/',       getEvents);
router.post('/',      patronMiddleware, uploadPoster, createEvent);
router.put('/:id',   patronMiddleware, uploadPoster, updateEvent);
router.delete('/:id', patronMiddleware, deleteEvent);

module.exports = router;
