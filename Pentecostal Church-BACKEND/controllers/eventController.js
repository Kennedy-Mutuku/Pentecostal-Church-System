const Event = require('../models/Event');

// Public — get all active events ordered by soonest first
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 }).lean();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

// Patron — create
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description and date are required' });
    }
    const event = await Event.create({ title, description, date, location, category });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event' });
  }
};

// Patron — update
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event' });
  }
};

// Patron — delete
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event' });
  }
};
