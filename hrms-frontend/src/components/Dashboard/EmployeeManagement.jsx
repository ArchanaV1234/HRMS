

// import React, { useState, useEffect } from 'react';
// import {
//   Container, Typography, Box, AppBar, Toolbar, Button,
//   Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent,
//   DialogActions, Alert, Chip, Select, MenuItem, FormControl, InputLabel,
//   CircularProgress, Grid, IconButton, DialogContentText
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { format, parseISO } from 'date-fns';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';

// const EmployeeManagement = () => {
//   const navigate = useNavigate();
//   const [tabValue, setTabValue] = useState(0);
//   const [employee, setEmployee] = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [leaves, setLeaves] = useState([]);
//   const [payrolls, setPayrolls] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [editMode, setEditMode] = useState(false);
//   const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
//   const [openPayrollDialog, setOpenPayrollDialog] = useState(false);
//   const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [periodAttendance, setPeriodAttendance] = useState([]);
//   const [showPeriodAttendance, setShowPeriodAttendance] = useState(false);
//   const [periodDates, setPeriodDates] = useState({
//     startDate: format(new Date(), 'yyyy-MM-dd'),
//     endDate: format(new Date(), 'yyyy-MM-dd')
//   });

//   const [formData, setFormData] = useState({
//     name: '',
//     username: '',
//     email: '',
//     phone: '',
//     job: '',
//     salary: '',
//     joiningDate: '',
//     leaveType: 'VACATION',
//     leaveStartDate: format(new Date(), 'yyyy-MM-dd'),
//     leaveEndDate: format(new Date(), 'yyyy-MM-dd'),
//     leaveReason: '',
//     payrollBasicSalary: '',
//     payrollDeductions: '',
//     payrollPeriod: format(new Date(), 'yyyy-MM-dd')
//   });

//   const [payrollForm, setPayrollForm] = useState({
//     employeeId: '',
//     basicSalary: '',
//     deductions: '',
//     payPeriod: format(new Date(), 'yyyy-MM-dd')
//   });

//   useEffect(() => {
//     const employeeId = localStorage.getItem('id');
//     const role = localStorage.getItem('role');

//     if (!employeeId) {
//       navigate('/login');
//     } else {
//       fetchEmployeeData(employeeId);
//       fetchEmployeeRecords(employeeId);
//     }
//   }, [navigate]);

//   const fetchEmployeeData = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:8081/api/employees/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setEmployee(response.data);
//       setFormData(prev => ({
//         ...prev,
//         name: response.data.name,
//         username: response.data.username,
//         email: response.data.email,
//         phone: response.data.phone,
//         job: response.data.job,
//         salary: response.data.salary,
//         joiningDate: format(new Date(response.data.joiningDate), 'yyyy-MM-dd')
//       }));
//       setPayrollForm(prev => ({
//         ...prev,
//         employeeId: response.data.id
//       }));
//     } catch (err) {
//       setError('Failed to fetch employee data');
//     }
//   };

//   const fetchEmployeeRecords = async (id) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
  
//       const [attRes, leaveRes, payrollRes] = await Promise.all([
//         axios.get(`http://localhost:8081/api/attendance/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`http://localhost:8081/api/leaves/employee/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`http://localhost:8081/api/payrolls/employee/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }).catch(err => {
//           console.error('Payroll fetch error:', err);
//           return { data: [] };
//         })
//       ]);
  
//       setAttendance(attRes.data);
//       setLeaves(leaveRes.data);
//       setPayrolls(payrollRes.data || []);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching records:', err);
//       setError('Failed to fetch records');
//       setLoading(false);
//       setPayrolls([]);
//     }
//   };

//   const fetchPeriodAttendance = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:8081/api/attendance/period`, {
//         params: {
//           startDate: periodDates.startDate,
//           endDate: periodDates.endDate
//         },
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setPeriodAttendance(response.data);
//       setShowPeriodAttendance(true);
//     } catch (err) {
//       setError('Failed to fetch period attendance');
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePayrollInputChange = (e) => {
//     const { name, value } = e.target;
//     setPayrollForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePeriodDateChange = (e) => {
//     const { name, value } = e.target;
//     setPeriodDates(prev => ({ ...prev, [name]: value }));
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const id = localStorage.getItem('id');
//       await axios.put(`http://localhost:8081/api/employees/${id}`, {
//         ...formData,
//         username: employee.username
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setEditMode(false);
//       fetchEmployeeData(id);
//     } catch (err) {
//       setError('Failed to update profile: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleLeaveSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post('http://localhost:8081/api/leaves', {
//         employeeId: employee.id,
//         startDate: formData.leaveStartDate,
//         endDate: formData.leaveEndDate,
//         reason: formData.leaveReason,
//         type: formData.leaveType,
//         status: 'PENDING'
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setOpenLeaveDialog(false);
//       fetchEmployeeRecords(employee.id);
//     } catch (err) {
//       setError('Failed to apply leave: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handlePayrollSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post('http://localhost:8081/api/payrolls', {
//         employeeId: payrollForm.employeeId,
//         basicSalary: parseFloat(payrollForm.basicSalary),
//         deductions: parseFloat(payrollForm.deductions),
//         payPeriod: payrollForm.payPeriod
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       setOpenPayrollDialog(false);
//       fetchEmployeeRecords(employee.id);
//       setPayrollForm({
//         employeeId: employee.id,
//         basicSalary: '',
//         deductions: '',
//         payPeriod: format(new Date(), 'yyyy-MM-dd')
//       });
//     } catch (err) {
//       setError('Failed to add payroll: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleCheckIn = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`http://localhost:8081/api/attendance/${employee.id}/checkin`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchEmployeeRecords(employee.id);
//     } catch (err) {
//       setError('Failed to check in: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleCheckOut = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`http://localhost:8081/api/attendance/${employee.id}/checkout`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchEmployeeRecords(employee.id);
//     } catch (err) {
//       setError('Failed to check out: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleDeletePayroll = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:8081/api/payrolls/${deleteId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setOpenDeleteConfirm(false);
//       fetchEmployeeRecords(employee.id);
//     } catch (err) {
//       setError('Failed to delete payroll: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleApproveLeave = async (leaveId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:8081/api/leaves/${leaveId}/approve`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchEmployeeRecords(employee.id);
//     } catch (err) {
//       setError('Failed to approve leave: ' + (err.response?.data?.message || err.message));
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
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Employee Dashboard - {employee?.name}
//           </Typography>
//           <Button color="inherit" onClick={handleLogout}>Logout</Button>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//             {error}
//           </Alert>
//         )}

//         <Paper sx={{ mb: 3 }}>
//           <Tabs value={tabValue} onChange={handleTabChange} centered>
//             <Tab label="Profile" />
//             <Tab label="Attendance" />
//             <Tab label="Leaves" />
//             <Tab label="Payroll" />
//           </Tabs>
//         </Paper>

//         {tabValue === 0 && (
//           <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//               <Typography variant="h6">Personal Information</Typography>
//               <Button variant="contained" onClick={() => setEditMode(!editMode)}>
//                 {editMode ? 'Cancel' : 'Edit'}
//               </Button>
//             </Box>

//             {editMode ? (
//               <form onSubmit={handleProfileSubmit}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label="Name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       margin="normal"
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label="Username"
//                       name="username"
//                       value={formData.username}
//                       onChange={handleInputChange}
//                       margin="normal"
//                       disabled
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label="Email"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       margin="normal"
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label="Phone"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       margin="normal"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label="Job"
//                       name="job"
//                       value={formData.job}
//                       onChange={handleInputChange}
//                       margin="normal"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label="Salary"
//                       name="salary"
//                       type="number"
//                       value={formData.salary}
//                       onChange={handleInputChange}
//                       margin="normal"
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label="Joining Date"
//                       name="joiningDate"
//                       type="date"
//                       InputLabelProps={{ shrink: true }}
//                       value={formData.joiningDate}
//                       onChange={handleInputChange}
//                       margin="normal"
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Button type="submit" variant="contained" color="primary">
//                       Save Changes
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </form>
//             ) : (
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <Typography><strong>Name:</strong> {employee?.name}</Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography><strong>Username:</strong> {employee?.username}</Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography><strong>Email:</strong> {employee?.email}</Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography><strong>Phone:</strong> {employee?.phone}</Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography><strong>Job:</strong> {employee?.job}</Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography><strong>Salary:</strong> ${employee?.salary?.toLocaleString()}</Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography>
//                     <strong>Joining Date:</strong> {format(parseISO(employee?.joiningDate), 'MMM dd, yyyy')}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             )}
//           </Paper>
//         )}

//         {tabValue === 1 && (
//           <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//               <Typography variant="h6">Attendance Records</Typography>
//               <Box>
//                 <Button variant="contained" color="success" onClick={handleCheckIn} sx={{ mr: 2 }}>
//                   Check In
//                 </Button>
//                 <Button variant="contained" color="error" onClick={handleCheckOut}>
//                   Check Out
//                 </Button>
//               </Box>
//             </Box>

//             <Box sx={{ mb: 3 }}>
//               <Typography variant="subtitle1" gutterBottom>View Attendance by Period</Typography>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid item xs={12} sm={5}>
//                   <TextField
//                     fullWidth
//                     label="Start Date"
//                     name="startDate"
//                     type="date"
//                     InputLabelProps={{ shrink: true }}
//                     value={periodDates.startDate}
//                     onChange={handlePeriodDateChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={5}>
//                   <TextField
//                     fullWidth
//                     label="End Date"
//                     name="endDate"
//                     type="date"
//                     InputLabelProps={{ shrink: true }}
//                     value={periodDates.endDate}
//                     onChange={handlePeriodDateChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={2}>
//                   <Button
//                     variant="contained"
//                     onClick={fetchPeriodAttendance}
//                     fullWidth
//                   >
//                     Search
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Box>

//             {showPeriodAttendance ? (
//               <>
//                 <Typography variant="h6" gutterBottom>
//                   Attendance from {format(new Date(periodDates.startDate), 'MMM dd, yyyy')} to {format(new Date(periodDates.endDate), 'MMM dd, yyyy')}
//                 </Typography>
//                 <Button
//                   variant="outlined"
//                   onClick={() => setShowPeriodAttendance(false)}
//                   sx={{ mb: 2 }}
//                 >
//                   Back to My Attendance
//                 </Button>
//                 <TableContainer>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Employee</TableCell>
//                         <TableCell>Date</TableCell>
//                         <TableCell>Status</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {periodAttendance.map((record) => (
//                         <TableRow key={record.id}>
//                           <TableCell>{record.employee.name}</TableCell>
//                           <TableCell>{format(parseISO(record.date), 'MMM dd, yyyy')}</TableCell>
//                           <TableCell>
//                             <Chip
//                               label={record.present ? 'PRESENT' : 'ABSENT'}
//                               color={record.present ? 'success' : 'error'}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </>
//             ) : (
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Date</TableCell>
//                       <TableCell>Status</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {attendance.map((record) => (
//                       <TableRow key={record.id}>
//                         <TableCell>{format(parseISO(record.date), 'MMM dd, yyyy')}</TableCell>
//                         <TableCell>
//                           <Chip
//                             label={record.present ? 'PRESENT' : 'ABSENT'}
//                             color={record.present ? 'success' : 'error'}
//                           />
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Paper>
//         )}

//         {tabValue === 2 && (
//           <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//               <Typography variant="h6">Leave History</Typography>
//               <Button variant="contained" onClick={() => setOpenLeaveDialog(true)}>
//                 Apply Leave
//               </Button>
//             </Box>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Type</TableCell>
//                     <TableCell>Period</TableCell>
//                     <TableCell>Reason</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {leaves.map((leave) => (
//                     <TableRow key={leave.id}>
//                       <TableCell>{leave.type}</TableCell>
//                       <TableCell>
//                         {format(parseISO(leave.startDate), 'MMM dd')} - {format(parseISO(leave.endDate), 'MMM dd, yyyy')}
//                       </TableCell>
//                       <TableCell>{leave.reason}</TableCell>
//                       <TableCell>
//                         <Chip
//                           label={leave.status}
//                           color={
//                             leave.status === 'APPROVED' ? 'success' :
//                               leave.status === 'REJECTED' ? 'error' : 'warning'
//                           }
//                         />
//                       </TableCell>
//                       <TableCell>
//                         {leave.status === 'PENDING' && localStorage.getItem('role') === 'ROLE_HR' && (
//                           <Button
//                             variant="contained"
//                             color="success"
//                             size="small"
//                             onClick={() => handleApproveLeave(leave.id)}
//                           >
//                             Approve
//                           </Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         )}

//         {tabValue === 3 && (
//           <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//               <Typography variant="h6">Payroll History</Typography>
//               {localStorage.getItem('role') === 'ROLE_HR' && (
//                 <Button variant="contained" onClick={() => setOpenPayrollDialog(true)}>
//                   Add Payroll
//                 </Button>
//               )}
//             </Box>

//             {loading ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Period</TableCell>
//                       <TableCell>Basic Salary</TableCell>
//                       <TableCell>Deductions</TableCell>
//                       <TableCell>Net Salary</TableCell>
//                       {localStorage.getItem('role') === 'ROLE_HR' && <TableCell>Actions</TableCell>}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {payrolls.length > 0 ? (
//                       payrolls.map((payroll) => (
//                         <TableRow key={payroll.id}>
//                           <TableCell>
//                             {payroll.payPeriod ? format(parseISO(payroll.payPeriod), 'MMM yyyy') : 'N/A'}
//                           </TableCell>
//                           <TableCell>
//                             ${(payroll.basicSalary || 0).toFixed(2)}
//                           </TableCell>
//                           <TableCell>
//                             ${(payroll.deductions || 0).toFixed(2)}
//                           </TableCell>
//                           <TableCell>
//                             ${((payroll.basicSalary || 0) - (payroll.deductions || 0)).toFixed(2)}
//                           </TableCell>
//                           {localStorage.getItem('role') === 'ROLE_HR' && (
//                             <TableCell>
//                               <IconButton
//                                 color="error"
//                                 onClick={() => {
//                                   setDeleteId(payroll.id);
//                                   setOpenDeleteConfirm(true);
//                                 }}
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             </TableCell>
//                           )}
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={5} align="center">
//                           No payroll records found
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Paper>
//         )}

//         {/* Leave Application Dialog */}
//         <Dialog open={openLeaveDialog} onClose={() => setOpenLeaveDialog(false)}>
//           <DialogTitle>Apply for Leave</DialogTitle>
//           <DialogContent>
//             <FormControl fullWidth sx={{ mt: 2 }}>
//               <InputLabel>Leave Type</InputLabel>
//               <Select
//                 name="leaveType"
//                 value={formData.leaveType}
//                 onChange={handleInputChange}
//                 label="Leave Type"
//               >
//                 <MenuItem value="VACATION">Vacation</MenuItem>
//                 <MenuItem value="SICK">Sick Leave</MenuItem>
//                 <MenuItem value="PERSONAL">Personal</MenuItem>
//               </Select>
//             </FormControl>
//             <TextField
//               fullWidth
//               label="Start Date"
//               name="leaveStartDate"
//               type="date"
//               InputLabelProps={{ shrink: true }}
//               value={formData.leaveStartDate}
//               onChange={handleInputChange}
//               margin="normal"
//             />
//             <TextField
//               fullWidth
//               label="End Date"
//               name="leaveEndDate"
//               type="date"
//               InputLabelProps={{ shrink: true }}
//               value={formData.leaveEndDate}
//               onChange={handleInputChange}
//               margin="normal"
//             />
//             <TextField
//               fullWidth
//               label="Reason"
//               name="leaveReason"
//               multiline
//               rows={4}
//               value={formData.leaveReason}
//               onChange={handleInputChange}
//               margin="normal"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenLeaveDialog(false)}>Cancel</Button>
//             <Button onClick={handleLeaveSubmit} variant="contained">Submit</Button>
//           </DialogActions>
//         </Dialog>

//         {/* Payroll Dialog */}
//         <Dialog open={openPayrollDialog} onClose={() => setOpenPayrollDialog(false)}>
//           <DialogTitle>Add Payroll Record</DialogTitle>
//           <DialogContent>
//             <TextField
//               fullWidth
//               label="Employee ID"
//               name="employeeId"
//               value={payrollForm.employeeId}
//               onChange={handlePayrollInputChange}
//               margin="normal"
//               disabled
//             />
//             <TextField
//               fullWidth
//               label="Basic Salary"
//               name="basicSalary"
//               type="number"
//               value={payrollForm.basicSalary}
//               onChange={handlePayrollInputChange}
//               margin="normal"
//               inputProps={{ min: 0, step: "0.01" }}
//             />
//             <TextField
//               fullWidth
//               label="Deductions"
//               name="deductions"
//               type="number"
//               value={payrollForm.deductions}
//               onChange={handlePayrollInputChange}
//               margin="normal"
//               inputProps={{ min: 0, step: "0.01" }}
//             />
//             <TextField
//               fullWidth
//               label="Pay Period"
//               name="payPeriod"
//               type="date"
//               InputLabelProps={{ shrink: true }}
//               value={payrollForm.payPeriod}
//               onChange={handlePayrollInputChange}
//               margin="normal"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenPayrollDialog(false)}>Cancel</Button>
//             <Button onClick={handlePayrollSubmit} variant="contained">Save</Button>
//           </DialogActions>
//         </Dialog>

//         {/* Delete Confirmation Dialog */}
//         <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
//           <DialogTitle>Confirm Delete</DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Are you sure you want to delete this payroll record? This action cannot be undone.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
//             <Button onClick={handleDeletePayroll} color="error" variant="contained">
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </>
//   );
// };

// export default EmployeeManagement;
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, AppBar, Toolbar, Button,
  Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Chip, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Grid, IconButton, DialogContentText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [openPayrollDialog, setOpenPayrollDialog] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [periodAttendance, setPeriodAttendance] = useState([]);
  const [showPeriodAttendance, setShowPeriodAttendance] = useState(false);
  const [periodDates, setPeriodDates] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    job: '',
    salary: '',
    joiningDate: '',
    leaveType: 'VACATION',
    leaveStartDate: format(new Date(), 'yyyy-MM-dd'),
    leaveEndDate: format(new Date(), 'yyyy-MM-dd'),
    leaveReason: '',
    payrollBasicSalary: '',
    payrollDeductions: '',
    payrollPeriod: format(new Date(), 'yyyy-MM-dd')
  });

  const [payrollForm, setPayrollForm] = useState({
    employeeId: '',
    basicSalary: '',
    deductions: '',
    payPeriod: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    const employeeId = localStorage.getItem('id');
    if (!employeeId) {
      navigate('/login');
    } else {
      fetchEmployeeData(employeeId);
      fetchEmployeeRecords(employeeId);
    }
  }, [navigate]);

  const fetchEmployeeData = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8081/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployee(response.data);
      setFormData(prev => ({
        ...prev,
        name: response.data.name,
        username: response.data.username,
        email: response.data.email,
        phone: response.data.phone,
        job: response.data.job,
        salary: response.data.salary,
        joiningDate: format(new Date(response.data.joiningDate), 'yyyy-MM-dd')
      }));
      setPayrollForm(prev => ({
        ...prev,
        employeeId: response.data.id
      }));
    } catch (err) {
      setError('Failed to fetch employee data');
    }
  };

  const fetchEmployeeRecords = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('No token found in localStorage');
      }
      console.log(id);
  
      const [attRes, leaveRes, payrollRes] = await Promise.all([
        axios.get(`http://localhost:8081/api/attendance/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8081/api/leaves/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8081/api/payrolls/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => {
          console.error('Payroll fetch error:', err);
          return { data: [] };
        })
      ]);
  
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setPayrolls(payrollRes.data || []);
      console.log(attRes);
      console.log(payrollRes);
      console.log(leaveRes);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to fetch records');
      setLoading(false);
      setPayrolls([]);
    }
  };
  
  

  const fetchPeriodAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8081/api/attendance/period`, {
        params: {
          startDate: periodDates.startDate,
          endDate: periodDates.endDate
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setPeriodAttendance(response.data);
      setShowPeriodAttendance(true);
    } catch (err) {
      setError('Failed to fetch period attendance');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayrollInputChange = (e) => {
    const { name, value } = e.target;
    setPayrollForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePeriodDateChange = (e) => {
    const { name, value } = e.target;
    setPeriodDates(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      await axios.put(`http://localhost:8081/api/employees/${id}`, {
        ...formData,
        username: employee.username
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setEditMode(false);
      fetchEmployeeData(id);
    } catch (err) {
      setError('Failed to update profile: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLeaveSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8081/api/leaves', {
        employeeId: employee.id,
        startDate: formData.leaveStartDate,
        endDate: formData.leaveEndDate,
        reason: formData.leaveReason,
        type: formData.leaveType,
        status: 'PENDING'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenLeaveDialog(false);
      fetchEmployeeRecords(employee.id);
    } catch (err) {
      setError('Failed to apply leave: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePayrollSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8081/api/payrolls', {
        employeeId: payrollForm.employeeId,
        basicSalary: parseFloat(payrollForm.basicSalary),
        deductions: parseFloat(payrollForm.deductions),
        payPeriod: payrollForm.payPeriod
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setOpenPayrollDialog(false);
      fetchEmployeeRecords(employee.id);
      setPayrollForm({
        employeeId: employee.id,
        basicSalary: '',
        deductions: '',
        payPeriod: format(new Date(), 'yyyy-MM-dd')
      });
    } catch (err) {
      setError('Failed to add payroll: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8081/api/attendance/${employee.id}/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployeeRecords(employee.id);
    } catch (err) {
      setError('Failed to check in: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8081/api/attendance/${employee.id}/checkout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployeeRecords(employee.id);
    } catch (err) {
      setError('Failed to check out: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeletePayroll = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/payrolls/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenDeleteConfirm(false);
      fetchEmployeeRecords(employee.id);
    } catch (err) {
      setError('Failed to delete payroll: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8081/api/leaves/${leaveId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployeeRecords(employee.id);
    } catch (err) {
      setError('Failed to approve leave: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    navigate('/');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employee Dashboard - {employee?.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Profile" />
            <Tab label="Attendance" />
            <Tab label="Leaves" />
            <Tab label="Payroll" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Personal Information</Typography>
              <Button variant="contained" onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Cancel' : 'Edit'}
              </Button>
            </Box>

            {editMode ? (
              <form onSubmit={handleProfileSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      margin="normal"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Job"
                      name="job"
                      value={formData.job}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Salary"
                      name="salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Joining Date"
                      name="joiningDate"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Name:</strong> {employee?.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Username:</strong> {employee?.username}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Email:</strong> {employee?.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Phone:</strong> {employee?.phone}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Job:</strong> {employee?.job}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Salary:</strong> ${employee?.salary?.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography>
                  <strong>Joining Date:</strong> {employee?.joiningDate ? format(parseISO(employee.joiningDate), 'MMM dd, yyyy') : 'N/A'}

                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Attendance Records</Typography>
              <Box>
                <Button variant="contained" color="success" onClick={handleCheckIn} sx={{ mr: 2 }}>
                  Check In
                </Button>
                <Button variant="contained" color="error" onClick={handleCheckOut}>
                  Check Out
                </Button>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>View Attendance by Period</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={periodDates.startDate}
                    onChange={handlePeriodDateChange}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={periodDates.endDate}
                    onChange={handlePeriodDateChange}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    onClick={fetchPeriodAttendance}
                    fullWidth
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {showPeriodAttendance ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Attendance from {format(new Date(periodDates.startDate), 'MMM dd, yyyy')} to {format(new Date(periodDates.endDate), 'MMM dd, yyyy')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setShowPeriodAttendance(false)}
                  sx={{ mb: 2 }}
                >
                  Back to My Attendance
                </Button>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {periodAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.employee.name}</TableCell>
                          <TableCell>{format(parseISO(record.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <Chip
                              label={record.present ? 'PRESENT' : 'ABSENT'}
                              color={record.present ? 'success' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(parseISO(record.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.present ? 'PRESENT' : 'ABSENT'}
                            color={record.present ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Leave History</Typography>
              <Button variant="contained" onClick={() => setOpenLeaveDialog(true)}>
                Apply Leave
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    {/* <TableCell>Actions</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>{leave.type}</TableCell>
                      <TableCell>
                        {format(parseISO(leave.startDate), 'MMM dd')} - {format(parseISO(leave.endDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>
  <Chip
    label={leave.status}
    color={
      leave.status === 'APPROVED' ? 'success' :
      leave.status === 'REJECTED' ? 'error' : 'warning'
    }
  />
</TableCell>

                      {/* <TableCell>
                        {leave.status === 'PENDING' && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApproveLeave(leave.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {tabValue === 3 && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Payroll History</Typography>
              <Button 
                variant="contained" 
                onClick={() => setOpenPayrollDialog(true)}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                Add Payroll
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Basic Salary</TableCell>
                      <TableCell>Deductions</TableCell>
                      <TableCell>Net Salary</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payrolls.length > 0 ? (
                      payrolls.map((payroll) => (
                        <TableRow key={payroll.id}>
                          <TableCell>
                            {payroll.payPeriod ? format(parseISO(payroll.payPeriod), 'MMM yyyy') : 'N/A'}
                          </TableCell>
                          <TableCell>${payroll.basicSalary?.toFixed(2)}</TableCell>
                          <TableCell>${payroll.deductions?.toFixed(2)}</TableCell>
                          <TableCell>${(payroll.basicSalary - payroll.deductions)?.toFixed(2)}</TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setDeleteId(payroll.id);
                                setOpenDeleteConfirm(true);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No payroll records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {/* Leave Application Dialog */}
        <Dialog open={openLeaveDialog} onClose={() => setOpenLeaveDialog(false)}>
          <DialogTitle>Apply for Leave</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Leave Type</InputLabel>
              <Select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                label="Leave Type"
              >
                <MenuItem value="VACATION">Vacation</MenuItem>
                <MenuItem value="SICK">Sick Leave</MenuItem>
                <MenuItem value="PERSONAL">Personal</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Start Date"
              name="leaveStartDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.leaveStartDate}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="End Date"
              name="leaveEndDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.leaveEndDate}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reason"
              name="leaveReason"
              multiline
              rows={4}
              value={formData.leaveReason}
              onChange={handleInputChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLeaveDialog(false)}>Cancel</Button>
            <Button onClick={handleLeaveSubmit} variant="contained">Submit</Button>
          </DialogActions>
        </Dialog>

        {/* Payroll Dialog */}
        <Dialog 
          open={openPayrollDialog} 
          onClose={() => setOpenPayrollDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add Payroll Record</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Employee ID"
              name="employeeId"
              value={payrollForm.employeeId}
              onChange={handlePayrollInputChange}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Basic Salary"
              name="basicSalary"
              type="number"
              value={payrollForm.basicSalary}
              onChange={handlePayrollInputChange}
              margin="normal"
              inputProps={{ min: 0, step: "0.01" }}
            />
            <TextField
              fullWidth
              label="Deductions"
              name="deductions"
              type="number"
              value={payrollForm.deductions}
              onChange={handlePayrollInputChange}
              margin="normal"
              inputProps={{ min: 0, step: "0.01" }}
            />
            <TextField
              fullWidth
              label="Pay Period"
              name="payPeriod"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={payrollForm.payPeriod}
              onChange={handlePayrollInputChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenPayrollDialog(false)} 
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayrollSubmit} 
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={openDeleteConfirm} 
          onClose={() => setOpenDeleteConfirm(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this payroll record? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenDeleteConfirm(false)} 
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeletePayroll} 
              color="error" 
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default EmployeeManagement;