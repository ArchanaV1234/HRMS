// import React, { useState, useEffect } from 'react';
// import { 
//   Container, Button, Typography, Box, Grid, 
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   CircularProgress, TextField, Paper, Table, TableBody,
//   TableCell, TableContainer, TableHead, TableRow, IconButton,
//   AppBar, Toolbar, Alert, Menu, MenuItem
// } from '@mui/material';
// import { Edit, Delete, MoreVert } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { format, parseISO } from 'date-fns';

// const HRDashboard = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [currentEmployee, setCurrentEmployee] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     username: '',
//     password: '',
//     email: '',
//     phone: '',
//     job: '',
//     role: 'ROLE_EMPLOYEE',
//     salary: '',
//     joiningDate: format(new Date(), 'yyyy-MM-dd')
//   });

//   const handleApproveLeave = async (leaveId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:8081/api/leaves/${leaveId}/approve`, null, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchEmployees(); // Refresh the list after approval
//       setError(null);
//     } catch (err) {
//       setError('Failed to approve leave');
//     }
//   };
  

//   useEffect(() => {
//     const role = localStorage.getItem('role');
//     if (role !== 'ROLE_HR') {
//       navigate('/');
//     } else {
//       fetchEmployees();
//     }
//   }, [navigate]);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:8081/api/employees', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setEmployees(response.data);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch employees');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleMenuOpen = (event, employee) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedEmployee(employee);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedEmployee(null);
//   };

//   const handleEdit = (employee) => {
//     setCurrentEmployee(employee);
//     setFormData({
//       name: employee.name,
//       username: employee.username,
//       password: '',
//       email: employee.email,
//       phone: employee.phone,
//       job: employee.job,
//       role: employee.role,
//       salary: employee.salary.toString(),
//       joiningDate: format(parseISO(employee.joiningDate), 'yyyy-MM-dd')
//     });
//     setOpenDialog(true);
//     handleMenuClose();
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const url = currentEmployee 
//         ? `http://localhost:8081/api/employees/${currentEmployee.id}`
//         : 'http://localhost:8081/api/employees';

//       const data = {
//         ...formData,
//         salary: parseFloat(formData.salary),
//         joiningDate: new Date(formData.joiningDate).toISOString()
//       };

//       if (currentEmployee) {
//         await axios.put(url, data, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } else {
//         await axios.post(url, data, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       }

//       setOpenDialog(false);
//       fetchEmployees();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Operation failed');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:8081/api/employees/${selectedEmployee.id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchEmployees();
//       handleMenuClose();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('id');
//     navigate('/');
//   };

//   if (loading) {
//     return (
//       <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>HR Dashboard</Typography>
//           <Button color="inherit" onClick={handleLogout}>Logout</Button>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
//             {error}
//           </Alert>
//         )}

//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//           <Typography variant="h4">Employee Management</Typography>
//           <Button 
//             variant="contained" 
//             onClick={() => {
//               setCurrentEmployee(null);
//               setFormData({
//                 name: '',
//                 username: '',
//                 password: '',
//                 email: '',
//                 phone: '',
//                 job: '',
//                 role: 'ROLE_EMPLOYEE',
//                 salary: '',
//                 joiningDate: format(new Date(), 'yyyy-MM-dd')
//               });
//               setOpenDialog(true);
//             }}
//           >
//             Add Employee
//           </Button>
//           {selectedEmployee && selectedEmployee.leaveStatus === 'PENDING' && (
//   <Button
//     variant="contained"
//     color="success"
//     size="small"
//     onClick={() => handleApproveLeave(selectedEmployee.id)}
//   >
//     Approve
//   </Button>
// )}

//         </Box>

//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Username</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Job</TableCell>
//                 <TableCell>Role</TableCell>
//                 <TableCell>Salary</TableCell>
//                 <TableCell>Joining Date</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {employees.map((employee) => (
//                 <TableRow key={employee.id}>
//                   <TableCell>{employee.id}</TableCell>
//                   <TableCell>{employee.name}</TableCell>
//                   <TableCell>{employee.username}</TableCell>
//                   <TableCell>{employee.email}</TableCell>
//                   <TableCell>{employee.job}</TableCell>
//                   <TableCell>{employee.role.replace('ROLE_', '')}</TableCell>
//                   <TableCell>${employee.salary.toLocaleString()}</TableCell>
//                   <TableCell>{employee.joiningDate}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={(e) => handleMenuOpen(e, employee)}>
//                       <MoreVert />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem onClick={() => handleEdit(selectedEmployee)}>
//             <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
//           </MenuItem>
//           <MenuItem onClick={handleDelete}>
//             <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
//           </MenuItem>
//         </Menu>


//         <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//           <DialogTitle>{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="name"
//                   label="Name"
//                   fullWidth
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   sx={{ mt: 2 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="username"
//                   label="Username"
//                   fullWidth
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   required
//                   sx={{ mt: 2 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="password"
//                   label="Password"
//                   type="password"
//                   fullWidth
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required={!currentEmployee}
//                   sx={{ mt: 2 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="email"
//                   label="Email"
//                   type="email"
//                   fullWidth
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   sx={{ mt: 2 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="phone"
//                   label="Phone"
//                   fullWidth
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   sx={{ mt: 2 }}
//                 />
//               </Grid>
             


//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="job"
//                   label="Job Title"
//                   fullWidth
//                   value={formData.job}
//                   onChange={handleInputChange}
//                   sx={{ mt: 2 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="role"
//                   label="Role"
//                   select
//                   fullWidth
//                   value={formData.role}
//                   onChange={handleInputChange}
//                   sx={{ mt: 2 }}
//                 >
//                   <MenuItem value="ROLE_EMPLOYEE">Employee</MenuItem>
//                   <MenuItem value="ROLE_HR">HR</MenuItem>
//                 </TextField>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="salary"
//                   label="Salary"
//                   type="number"
//                   fullWidth
//                   value={formData.salary}
//                   onChange={handleInputChange}
//                   sx={{ mt: 2 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   name="joiningDate"
//                   label="Joining Date"
//                   type="date"
//                   fullWidth
//                   value={formData.joiningDate}
//                   onChange={handleInputChange}
//                   InputLabelProps={{ shrink: true }}
//                   sx={{ mt: 2 }}
//                 />
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//             <Button onClick={handleSubmit} variant="contained" color="primary">
//               {currentEmployee ? 'Update' : 'Create'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </>
//   );
// };

// export default HRDashboard;
import React, { useState, useEffect } from 'react';
import { 
  Container, Button, Typography, Box, Grid, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, TextField, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  AppBar, Toolbar, Alert, Menu, MenuItem, Tab, Tabs
} from '@mui/material';
import { Edit, Delete, MoreVert } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    job: '',
    role: 'ROLE_EMPLOYEE',
    salary: '',
    joiningDate: format(new Date(), 'yyyy-MM-dd')
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    navigate('/');
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ROLE_HR') {
      navigate('/');
    } else {
      fetchEmployees();
      fetchPendingLeaves();
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingLeaves(response.data);
    } catch (err) {
      console.error('Failed to fetch pending leaves:', err);
    }
  };

  const handleApproveLeave = async (employeeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8081/api/leaves/${employeeId}/approve`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingLeaves();
      setError(null);
    } catch (err) {
      setError('Failed to approve leave');
    }
  };
  
  const handleRejectLeave = async (employeeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8081/api/leaves/${employeeId}/reject`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingLeaves();
      setError(null);
    } catch (err) {
      setError('Failed to reject leave');
    }
  };
  

  const handleMenuOpen = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
  
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/employees/${selectedEmployee.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
      handleMenuClose();
      setError(null);
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      username: employee.username,
      password: '',
      email: employee.email,
      phone: employee.phone,
      job: employee.job,
      role: employee.role,
      salary: employee.salary,
      joiningDate: format(parseISO(employee.joiningDate), 'yyyy-MM-dd')
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = currentEmployee 
        ? `http://localhost:8081/api/employees/${currentEmployee.id}`
        : 'http://localhost:8081/api/employees';
      
      const method = currentEmployee ? 'put' : 'post';
      
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchEmployees();
      setOpenDialog(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>HR Dashboard</Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Employee Management" />
          <Tab label="Pending Leave Requests" />
        </Tabs>

        {tabValue === 0 ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4">Employee Management</Typography>
              <Button 
                variant="contained" 
                onClick={() => {
                  setCurrentEmployee(null);
                  setFormData({
                    name: '',
                    username: '',
                    password: '',
                    email: '',
                    phone: '',
                    job: '',
                    role: 'ROLE_EMPLOYEE',
                    salary: '',
                    joiningDate: format(new Date(), 'yyyy-MM-dd')
                  });
                  setOpenDialog(true);
                }}
              >
                Add Employee
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Job</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell>Joining Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.username}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.job}</TableCell>
                      <TableCell>{employee.role.replace('ROLE_', '')}</TableCell>
                      <TableCell>${employee.salary.toLocaleString()}</TableCell>
                      <TableCell>{format(parseISO(employee.joiningDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, employee)}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleEdit(selectedEmployee)}>
                <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>Pending Leave Requests</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingLeaves.length > 0 ? (
                    pendingLeaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>{leave.employee.name}</TableCell>
                        <TableCell>{format(parseISO(leave.startDate), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{format(parseISO(leave.endDate), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApproveLeave(leave.id)}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleRejectLeave(leave.id)}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No pending leave requests
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!currentEmployee}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    name="job"
                    value={formData.job}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    select
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="ROLE_EMPLOYEE">Employee</MenuItem>
                    <MenuItem value="ROLE_HR">HR</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Joining Date"
                    name="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {currentEmployee ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default HRDashboard;