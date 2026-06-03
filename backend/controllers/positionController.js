import Position from '../models/Position.js';

export const getAllPositions = async (req, res) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: positions.length,
      data: positions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPositionById = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found',
      });
    }

    res.status(200).json({
      success: true,
      data: position,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPosition = async (req, res) => {
  try {
    const { posName, requiredQualification } = req.body;

    if (!posName) {
      return res.status(400).json({
        success: false,
        message: 'Position name is required',
      });
    }

    const position = new Position({
      posName,
      requiredQualification,
    });

    await position.save();

    res.status(201).json({
      success: true,
      message: 'Position created successfully',
      data: position,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Position updated successfully',
      data: position,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Position deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
