import Employee from '../models/Employee.js';

export const getAllEmployees = async (req, res) => {
  try {
    const { search, department, status } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { empFirstName: { $regex: search, $options: 'i' } },
        { empLastName: { $regex: search, $options: 'i' } },
        { empEmail: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) {
      query.department = department;
    }

    if (status) {
      query.empStatus = status;
    }

    const employees = await Employee.find(query)
      .populate('department')
      .populate('position')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department')
      .populate('position');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const {
      empFirstName,
      empLastName,
      empGender,
      empDateOfBirth,
      empEmail,
      empTelephone,
      empAddress,
      empHireDate,
      empStatus,
      department,
      position,
    } = req.body;

    if (!empFirstName || !empLastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required',
      });
    }

    const employee = new Employee({
      empFirstName,
      empLastName,
      empGender,
      empDateOfBirth,
      empEmail,
      empTelephone,
      empAddress,
      empHireDate,
      empStatus,
      department: department || undefined,
      position: position || undefined,
    });

    await employee.save();

    await employee.populate(['department', 'position']);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.department === '') updateData.department = undefined;
    if (updateData.position === '') updateData.position = undefined;

    const employee = await Employee.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('department')
      .populate('position');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
