const Asset = require("../../models/financeAsset");
const { logFinanceAction } = require("../../middlewares/financeAudit");

exports.create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      recorded_by: req.user.id,
      valuationHistory: [
        {
          value: req.body.valuation,
          method: "initial",
          reason: "Initial valuation at recording.",
          valued_by: req.user.id,
          valued_at: new Date(),
        },
      ],
    };
    const asset = await Asset.create(data);
    await logFinanceAction(req.user.id, "create", "assets", asset._id, data);
    res.status(201).json({ message: "Asset recorded.", id: asset._id });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found." });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Asset.findByIdAndUpdate(req.params.id, req.body);
    await logFinanceAction(req.user.id, "update", "assets", req.params.id, req.body);
    res.json({ message: "Asset updated." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

exports.revalue = async (req, res) => {
  try {
    const { new_value, method, reason } = req.body;
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found." });

    const numericValue = Number(new_value);
    if (isNaN(numericValue) || numericValue < 0) {
      return res.status(400).json({ message: "A valid non-negative valuation is required." });
    }

    const resolvedMethod = method || (numericValue > asset.valuation ? "appreciation" : numericValue < asset.valuation ? "depreciation" : "market_appraisal");

    asset.valuationHistory.push({
      value: numericValue,
      method: resolvedMethod,
      reason: reason || "",
      valued_by: req.user.id,
      valued_at: new Date(),
    });
    asset.valuation = numericValue;
    await asset.save();

    await logFinanceAction(req.user.id, "revalue", "assets", asset._id, { new_value: numericValue, method: resolvedMethod, reason });
    res.json({ message: "Asset revalued.", asset });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    await logFinanceAction(req.user.id, "delete", "assets", req.params.id, {});
    res.json({ message: "Asset deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};
