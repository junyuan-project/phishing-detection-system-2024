import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Toolbar,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    TablePagination,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';

const AdminUsers = () => {
    const [tableData, setTableData] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editedUsername, setEditedUsername] = useState('');
    const [editedPhoneNumber, setEditedPhoneNumber] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const navigate = useNavigate();

    const contentStyle = {
        flexGrow: 1,
        padding: '20px',
        marginLeft: '50px',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken2');

                if (!accessToken) {
                    navigate('/admin/login');
                } else {
                    try {
                        const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
                        const userRole = decodedToken.role;

                        if (userRole !== 'Admin') {
                            navigate('/admin/login');
                        } else {
                            const response = await axios.get('http://localhost:8080/auth/all', {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            });
                            setTableData(response.data);
                        }
                    } catch (error) {
                        console.error('Error decoding token:', error);
                        navigate('/admin/login');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [navigate]);

    const handleEditClick = (rowId) => {
        setEditDialogOpen(true);
        setSelectedUserId(rowId);

        const selectedUser = tableData.find((user) => user.user_id === rowId);
        setEditedUsername(selectedUser.username);
        setEditedPhoneNumber(selectedUser.phoneNumber);
    };

    const handleDeleteClick = (rowId) => {
        setDeleteDialogOpen(true);
        setSelectedUserId(rowId);
    };

    const handleEditCloseDialog = () => {
        setEditDialogOpen(false);
        setSelectedUserId(null);
    };

    const handleDeleteCloseDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedUserId(null);
    };

    const handleEditSave = async () => {
        try {
            await axios.put(
                `http://localhost:8080/auth/edit/${selectedUserId}`,
                {
                    username: editedUsername,
                    phoneNumber: editedPhoneNumber,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken2')}`,
                    },
                }
            );

            const response = await axios.get('http://localhost:8080/auth/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken2')}`,
                },
            });

            setSnackbarMessage('User information updated successfully.');
            setSnackbarOpen(true);
            setTableData(response.data);

            handleEditCloseDialog();
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarOpen(true);
            console.error('Error editing user:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:8080/auth/delete/${selectedUserId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken2')}`,
                },
            });

            const response = await axios.get('http://localhost:8080/auth/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken2')}`,
                },
            });

            setSnackbarMessage('User deleted successfully.');
            setSnackbarOpen(true);
            setTableData(response.data);

            handleDeleteCloseDialog();
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarOpen(true);
            console.error('Error deleting user:', error);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Header />
            <div style={{ backgroundColor: '#f5f5f5', minHeight: '750px', height: 'auto' }}>
                <main style={contentStyle}>
                    <Toolbar />
                    <Container>
                        <Typography variant="h5" gutterBottom marginTop={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
                            Users
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '5%' }}>ID</TableCell>
                                        <TableCell style={{ width: '10%' }}>User ID</TableCell>
                                        <TableCell style={{ width: '20%' }}>Username</TableCell>
                                        <TableCell style={{ width: '25%' }}>Email</TableCell>
                                        <TableCell style={{ width: '15%' }}>Phone Number</TableCell>
                                        <TableCell style={{ width: '15%' }}>Created At</TableCell>
                                        <TableCell style={{ width: '15%' }}>Updated At</TableCell>
                                        <TableCell><SettingsIcon /></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.user_id}</TableCell>
                                            <TableCell>{row.username}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.phoneNumber}</TableCell>
                                            <TableCell>{row.createdAt}</TableCell>
                                            <TableCell>{row.updatedAt}</TableCell>
                                            <TableCell>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <Button variant="outlined" onClick={() => handleEditClick(row.user_id)} style={{ color: 'black', borderColor: 'black' }}>
                                                        Edit
                                                    </Button>
                                                    <Button variant="outlined" onClick={() => handleDeleteClick(row.user_id)} style={{ color: 'red', borderColor: 'red' }}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[8, 16, 24]}
                                component="div"
                                count={tableData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Container>
                </main>
            </div>

            <Dialog open={editDialogOpen} onClose={handleEditCloseDialog}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Username"
                        name="username"
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        sx={{
                            '& label.Mui-focused': {
                                color: 'black',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'black',
                            },
                        }}
                    />
                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={editedPhoneNumber}
                        onChange={(e) => setEditedPhoneNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                        sx={{
                            '& label.Mui-focused': {
                                color: 'black',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'black',
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCloseDialog} style={{ color: 'black' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleEditSave} style={{ color: 'white', backgroundColor: 'black' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleDeleteCloseDialog}>
                <DialogTitle>Delete User?</DialogTitle>
                <DialogContent>Are you sure you want to delete this user?</DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCloseDialog} autoFocus style={{ color: 'black' }}>
                        No
                    </Button>
                    <Button onClick={handleDeleteConfirm} autoFocus style={{ color: 'black' }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity="success"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default AdminUsers;
