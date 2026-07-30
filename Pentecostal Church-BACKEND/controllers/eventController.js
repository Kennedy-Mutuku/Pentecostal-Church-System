const Event  = require('../models/Event');
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ── Multer: save posters to uploads/event-posters/ ──────────────
const posterDir = path.join(__dirname, '../uploads/event-posters');
if (!fs.existsSync(posterDir)) fs.mkdirSync(posterDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, posterDir),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `poster-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WebP) are allowed'));
  }
};

const multerInstance = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } }).single('poster');

// Apply multer only for multipart requests (skip plain JSON, e.g. toggle isActive)
exports.uploadPoster = (req, res, next) => {
  if (req.is('multipart/form-data')) {
    multerInstance(req, res, next);
  } else {
    next();
  }
};

// Helper: next Sunday at given hour:minute
function nextSundayAt(hour, minute) {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() + (day === 0 ? 7 : 7 - day));
  d.setHours(hour, minute, 0, 0);
  return d;
}

// Public — get all active events ordered soonest first
exports.getEvents = async (req, res) => {
  try {
    const now = new Date();

    // Seed or auto-advance the permanent Sunday Service
    let sunday = await Event.findOne({ isPermanent: true });
    if (!sunday) {
      await Event.create({
        title: 'Sunday Service',
        description: 'Join us every Sunday for a time of worship, prayer and the Word of God. All are welcome at RPC Nyamira.',
        date:    nextSundayAt(9, 0),
        endDate: nextSundayAt(13, 0),
        location: 'RPC Nyamira',
        category: 'Service',
        isActive: true,
        isPermanent: true,
      });
    } else if (sunday.endDate && sunday.endDate < now) {
      // Auto-advance to next Sunday keeping admin-set hours
      const sh = sunday.date.getHours(), sm = sunday.date.getMinutes();
      const eh = sunday.endDate.getHours(), em = sunday.endDate.getMinutes();
      await Event.findByIdAndUpdate(sunday._id, {
        date:    nextSundayAt(sh, sm),
        endDate: nextSundayAt(eh, em),
      });
    }

    const events = await Event.find({ isActive: true }).sort({ isPermanent: -1, date: 1 }).lean();
    res.json(events);
  } catch {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

// Patron — create
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, endDate, location, category } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description and date are required' });
    }
    const data = { title, description, date, location, category };
    if (endDate) data.endDate = endDate;
    if (req.file) data.poster = `/uploads/event-posters/${req.file.filename}`;
    const event = await Event.create(data);
    res.status(201).json(event);
  } catch {
    res.status(500).json({ message: 'Failed to create event' });
  }
};

// Patron — update
exports.updateEvent = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.poster = `/uploads/event-posters/${req.file.filename}`;
    const event = await Event.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch {
    res.status(500).json({ message: 'Failed to update event' });
  }
};

// Patron — delete (permanent events cannot be deleted)
exports.deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (ev.isPermanent) return res.status(403).json({ message: 'Sunday Service cannot be deleted' });
    await ev.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete event' });
  }
};
