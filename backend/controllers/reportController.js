import Employee from '../models/Employee.js';

export const getOnLeaveReport = async (req, res) => {
  try {
    const onLeaveEmployees = await Employee.find({ empStatus: 'on leave' })
      .populate('department')
      .populate('position')
      .sort('department');

    const groupedByDepartment = {};

    onLeaveEmployees.forEach((emp) => {
      const deptName = emp.department ? emp.department.departmentName : 'Unassigned';
      const deptId = emp.department ? emp.department._id : null;

      if (!groupedByDepartment[deptId]) {
        groupedByDepartment[deptId] = {
          departmentId: deptId,
          departmentName: deptName,
          employees: [],
          total: 0,
        };
      }

      groupedByDepartment[deptId].employees.push({
        id: emp._id,
        name: `${emp.empFirstName} ${emp.empLastName}`,
        email: emp.empEmail,
        position: emp.position ? emp.position.posName : 'N/A',
      });

      groupedByDepartment[deptId].total += 1;
    });

    const report = Object.values(groupedByDepartment);
    const grandTotal = onLeaveEmployees.length;

    res.status(200).json({
      success: true,
      data: {
        report,
        grandTotal,
        summary: {
          totalOnLeave: grandTotal,
          departmentCount: report.length,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStatusSummary = async (req, res) => {
  try {
    const statusSummary = await Employee.aggregate([
      {
        $group: {
          _id: '$empStatus',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const total = statusSummary.reduce((sum, item) => sum + item.count, 0);

    res.status(200).json({
      success: true,
      data: {
        statusSummary,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
