const aiService = require('../services/aiService');

exports.customizeVehicle = async (req, res) => {
    const { color, material, seatConfig } = req.body;

    try {
        const optimizedData = await aiService.optimizeVehicle({ color, material, seatConfig });
        res.json({ success: true, data: optimizedData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
