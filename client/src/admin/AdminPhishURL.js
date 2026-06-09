import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Toolbar,
    Grid,
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
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Snackbar,
    TablePagination,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import Header from './components/Header';
import { useNavigate } from 'react-router-dom';

const AdminPhishURL = () => {
    const [tableData, setTableData] = useState([]);
    const [editdialogOpen, setEditDialogOpen] = useState(false);
    const [deletedialogOpen, setDeleteDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [editedRow, setEditedRow] = useState({
        id: null,
        url_id: '',
        status: ''
    });
    const [deleteRowId, setDeleteRowId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const navigate = useNavigate();

    const contentStyle = {
        flexGrow: 1,
        padding: '20px',
        marginLeft: '50px'
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
                            const response = await axios.get('http://localhost:8080/api/get-all-data', {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            });
                            setTableData(response.data.data);
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
    }, []);

    const handleEditClick = (row) => {
        setEditDialogOpen(true);
        setEditedRow({
            id: row.id,
            url: row.url,
            url_id: row.url_id,
            status: row.status
        });
    };

    const handleDeleteClick = (rowId) => {
        setDeleteRowId(rowId);
        setDeleteDialogOpen(true);
        console.log(`Delete button clicked for row with ID ${rowId}`);
    };

    const handleCancelEditDialog = () => {
        setEditDialogOpen(false);
    };

    const handleEditCloseDialog = async () => {
        try {
            await axios.put(`http://localhost:8080/api/edit/${editedRow.id}`, {
                url_id: editedRow.url_id,
                status: editedRow.status,
            });

            const checkUrlResponse = await axios.get(`http://localhost:8080/reportedurl/getReportedURLById/${editedRow.url_id}`);
            console.log(checkUrlResponse);
            if (checkUrlResponse.status === 201) {
                console.log('Reported URL not found. Proceeding with storing URL and certificate.');

                const response = await axios.get(`http://localhost:8080/api/v1/result/${editedRow.url_id}`);
                const { data } = response;

                console.log(data.message);

                if (data.message == 'ValidationError: "uuid" must be a valid GUID') {
                    console.log('The URL is not scanned yet')
                } else {
                    await axios.post('http://localhost:8080/reportedurl/storeURL', {
                        url: data.page.url,
                        url_id: editedRow.url_id,
                        url_safe: data.verdicts.overall.malicious,
                        url_status: data.stats.securePercentage,
                        url_score: data.stats.securePercentage,
                        url_ip: data.page.ip,
                        url_domain: data.page.domain,
                        url_country: data.page.country,
                        url_server: data.page.server,
                        url_asn: data.page.asn,
                        url_asnname: data.page.asnname,
                        url_submitter: data.submitter.country,
                        url_certificate_id: editedRow.url_id,
                        url_request_length: data.data.requests.length,
                        url_domain_length: data.stats.domainStats.length,
                        url_subdomain_length: data.stats.regDomainStats.length,
                        url_ip_length: data.stats.ipStats.length,
                        url_ipv6_length: data.stats.IPv6Percentage,
                        url_cookies_length: data.data.cookies.length
                    });

                    await Promise.all(data.lists.certificates.map(async (certificate) => {
                        await axios.post('http://localhost:8080/reportedurl/storeCertificate', {
                            certificate_id: editedRow.url_id,
                            certificate_name: certificate.subjectName,
                            certificate_issuer: certificate.issuer,
                            certificate_validFrom: certificate.validFrom,
                            certificate_validTo: certificate.validTo
                        });
                    }));
                }
            } else {
                console.log('Reported URL already exists. Skipping storage.');
                // Update state or display a message indicating the URL already exists
            }

            const updatedResponse = await axios.get('http://localhost:8080/api/get-all-data');
            setSnackbarMessage('URL information updated successfully.');
            setSnackbarOpen(true);
            setTableData(updatedResponse.data.data);
            setEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating URL:', error);
            setSnackbarMessage(error.message);
            setSnackbarOpen(true);
        }
    };

    const handleDeleteCloseDialog = async (confirmed) => {
        if (confirmed) {
            try {
                console.log(deleteRowId);
                await axios.delete(`http://localhost:8080/api/delete/${deleteRowId}`);

                const response = await axios.get('http://localhost:8080/api/get-all-data');
                setSnackbarMessage('URL deleted successfully.');
                setSnackbarOpen(true);
                setTableData(response.data.data);
            } catch (error) {
                console.error('Error deleting URL:', error);
                setSnackbarMessage(error.message);
                setSnackbarOpen(true);
            }
        }
        setDeleteRowId(null);
        setDeleteDialogOpen(false);
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
                            Reported Phish URL
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '5%' }}>ID</TableCell>
                                        <TableCell style={{ width: '10%' }}>User ID</TableCell>
                                        <TableCell style={{ width: '20%' }}>URL</TableCell>
                                        <TableCell style={{ width: '25%' }}>URL ID</TableCell>
                                        <TableCell style={{ width: '15%' }}>Status</TableCell>
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
                                            <TableCell>{row.url}</TableCell>
                                            <TableCell>{row.url_id}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell>{row.createdAt}</TableCell>
                                            <TableCell>{row.updatedAt}</TableCell>
                                            <TableCell>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <Button variant="outlined" onClick={() => handleEditClick(row)} style={{ color: 'black', borderColor: 'black' }}>
                                                        Edit
                                                    </Button>
                                                    <Button variant="outlined" onClick={() => handleDeleteClick(row.id)} style={{ color: 'red', borderColor: 'red' }}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[8, 16, 24, { label: 'All', value: -1 }]}
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

            <Dialog open={editdialogOpen} onClose={handleCancelEditDialog}>
                <DialogTitle>URL</DialogTitle>
                <DialogContent>
                    <TextField
                        label="URL"
                        name="url"
                        value={editedRow.url}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                    <TextField
                        label="URL ID"
                        name="urlID"
                        value={editedRow.url_id}
                        fullWidth
                        margin="normal"
                        onChange={(e) => setEditedRow({ ...editedRow, url_id: e.target.value })}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            value={editedRow.status}
                            label="Status"
                            onChange={(e) => setEditedRow({ ...editedRow, status: e.target.value })}
                        >
                            <MenuItem value={'Approve'}>Approve</MenuItem>
                            <MenuItem value={'Reject'}>Reject</MenuItem>
                            <MenuItem value={'Pending'}>Pending</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelEditDialog} style={{ color: 'black' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleEditCloseDialog} style={{ color: 'white', backgroundColor: 'black' }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deletedialogOpen} onClose={() => handleDeleteCloseDialog(false)}>
                <DialogTitle>Delete URL?</DialogTitle>
                <DialogContent>
                    Are you sure to delete the URL?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDeleteCloseDialog(false)} autoFocus style={{ color: 'black' }}>
                        No
                    </Button>
                    <Button onClick={() => handleDeleteCloseDialog(true)} autoFocus style={{ color: 'black' }}>
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

export default AdminPhishURL;
