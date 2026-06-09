import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Container,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ListItemIcon,
    TablePagination
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function SearchPhish() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [originalPhishData, setOriginalPhishData] = useState([]);
    const [phishData, setPhishData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [resetSearchField, setResetSearchField] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/get-all-data", {
                params: {
                    status: "approve",
                },
            });

            const data = response.data.data;
            setOriginalPhishData(data);
            setPhishData(data);
        } catch (error) {
            console.error("Error fetching all data:", error);
        }
    };

    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setShowAlert(true);
            setAlertMessage("Please enter a URL.");
            return;
        }

        const filteredData = originalPhishData.filter(row =>
            row.url.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setPhishData(filteredData);
        setShowNoDataMessage(filteredData.length === 0);
    };

    const resetTable = () => {
        setSearchTerm("");
        setPhishData(originalPhishData);
        setShowNoDataMessage(false);
        setResetSearchField(true);
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
            <Container component="main" maxWidth="md">
                <Grid container>
                    <Grid item sm={12}>
                        <Typography
                            variant="h3"
                            sx={{
                                color: "black",
                                marginTop: "50px",
                                marginRight: "30px",
                                textAlign: "center",
                            }}
                        >
                            Search your Phish URL
                        </Typography>
                    </Grid>

                    <Grid item sm={12} sx={{ marginTop: "10px", marginBottom: "100px" }}>
                        <Grid container alignItems="flex-end">
                            <Grid item xs={9}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    label="Search URL"
                                    value={resetSearchField ? "" : searchTerm}
                                    onChange={(event) => {
                                        setSearchTerm(event.target.value);
                                        setResetSearchField(false);
                                    }}
                                    sx={{
                                        "& label.Mui-focused": {
                                            color: "black",
                                        },
                                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "black",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1.5}>
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    fullWidth
                                    sx={{ marginBottom: '10px', height: '53px', backgroundColor: 'black', '&:hover': { backgroundColor: 'grey' } }}
                                >
                                    Search
                                </Button>
                            </Grid>
                            <Grid item xs={1.5}>
                                <Button
                                    variant="contained"
                                    onClick={resetTable}
                                    fullWidth
                                    sx={{ marginBottom: '10px', height: '53px', backgroundColor: 'grey', '&:hover': { backgroundColor: 'lightgrey' } }}
                                >
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>

                        <Snackbar
                            open={showAlert}
                            autoHideDuration={5000}
                            onClose={() => setShowAlert(false)}
                        >
                            <MuiAlert
                                elevation={6}
                                variant="filled"
                                onClose={() => setShowAlert(false)}
                                severity="error"
                            >
                                {alertMessage}
                            </MuiAlert>
                        </Snackbar>

                        <TableContainer component={Paper} sx={{ marginTop: '30px' }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: 'black' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white' }}>URL</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Upload Date</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Result</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {phishData.length === 0 && showNoDataMessage ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">No data found</TableCell>
                                        </TableRow>
                                    ) : (
                                        phishData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                            <TableRow key={row.id} sx={index % 2 === 0 ? { background: '#f5f5f5' } : {}}>
                                                <TableCell>{row.url}</TableCell>
                                                <TableCell>{row.createdAt}</TableCell>
                                                <TableCell><a href={`http://localhost:3000/resultURL/${row.url_id}`}>{row.url_id} </a></TableCell>
                                                <TableCell>
                                                    {row.status === 'Approve' && (
                                                        <ListItemIcon>
                                                            <CheckCircleIcon sx={{ color: 'green' }} />
                                                        </ListItemIcon>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={phishData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default SearchPhish;
