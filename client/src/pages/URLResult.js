import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Snackbar } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ColoredCircularProgress from '../components/ColoredCircularProgress';
import RandomNumberAnimation from '../components/RandomNumberAnimation';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import { TableHead } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from "@mui/material/Alert";

function URLResult() {
    const containerStyle = {
        background: 'white',
        color: 'black',
    };

    const RateLimitMessage = ({ message }) => (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                fontSize: '1.5rem',
                fontFamily: '"Segoe UI Emoji"',
            }}
        >
            {message}
        </div>
    );

    const resultHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        marginTop: '2%',
    };

    const circularProgressStyle = {
        marginLeft: '20px',
        fontSize: '4rem',
        position: 'relative',
        padding: '0 25%',
    };

    const percentageStyle = {
        position: 'absolute',
        top: '39%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    const tableCellStyle = {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%',
        padding: '1% 0',
        borderBottom: 'none',
    };

    const tableCertStyle = {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%',
        padding: '1% 2%',
    };

    const addGridValue = {
        color: 'blue',
        marginBottom: '10px',
        fontSize: '1.8rem',
    };

    const addGridWord = {
        color: 'grey',
        fontSize: '1rem',
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Adjust the format as needed
    };

    const [rateLimitMessage, setRateLimitMessage] = useState(null);
    const [userAuthenticated, setUserAuthenticated] = useState(false);

    const location = useLocation();
    const uuid = location.pathname.split('/').pop();

    const [safeData, setSafeData] = useState(null);
    const [dangerData, setDangerData] = useState(null);
    const [scoreData, setScoreData] = useState(null);

    //Scan Details
    const [URLData, setURLData] = useState(null);
    const [ipAddData, setIpAddData] = useState(null);
    const [domainNameData, setDomainNameData] = useState(null);
    const [countryData, setCountryData] = useState(null);
    const [serverData, setServerData] = useState(null);
    const [ASNData, setASNData] = useState(null);
    const [ASNNameData, setASNNameData] = useState(null);
    const [submitterData, setSubmitterData] = useState(null);
    const [certificateData, setCertificateData] = useState(null);

    //Additional Info
    const [requestsData, setRequestsData] = useState(null);
    const [domainsData, setDomainsData] = useState(null);
    const [subdomainsData, setSubDomainsData] = useState(null);
    const [ipsData, setIpsData] = useState(null);
    const [ipv6Data, setIpv6Data] = useState(null);
    const [cookiesData, setCookiesData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const [showScanDetailsDialog, setshowScanDetailsDialog] = useState(false);
    const [showSecurityQuestionDialog, setShowSecurityQuestionDialog] = useState(false);
    const [showCertificateDialog, setshowCertificateDialog] = useState(false);
    const [showAddInformationDialog, setshowAddInformationDialog] = useState(false);
    const [showVideoDialog, setshowVideoDialog] = useState(false);
    const [securityQuestion1, setSecurityQuestion1] = useState('');
    const [securityQuestion2, setSecurityQuestion2] = useState('');
    const [securityQuestion3, setSecurityQuestion3] = useState('');
    const [securityDatabaseAnswer1, setSecurityDatabaseAnswer1] = useState('');
    const [securityDatabaseAnswer2, setSecurityDatabaseAnswer2] = useState('');
    const [securityDatabaseAnswer3, setSecurityDatabaseAnswer3] = useState('');
    const [securityAnswer1, setSecurityAnswer1] = useState('');
    const [securityAnswer2, setSecurityAnswer2] = useState('');
    const [securityAnswer3, setSecurityAnswer3] = useState('');

    useEffect(() => {
        if (uuid) {
            fetch(`http://localhost:8080/api/v1/result/${uuid}`)
                .then((response) => {
                    if (!response.ok) {
                        setShowAlert(true);
                        setAlertMessage(response.statusr);
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.status === 429) {
                        setRateLimitMessage(data.message);

                    } else if (data) {
                        if (data.verdicts.overall.malicious === false) {
                            setSafeData("The URL is safe");
                        } else {
                            setSafeData("The URL have potential malicious");
                        }

                        if (data.stats.securePercentage >= 80 && data.stats.securePercentage <= 100) {
                            setDangerData("Low")
                        } else if (data.stats.securePercentage >= 60 && data.stats.securePercentage <= 79) {
                            setDangerData("Moderate")
                        } else if (data.stats.securePercentage >= 40 && data.stats.securePercentage <= 59) {
                            setDangerData("Considerable")
                        } else if (data.stats.securePercentage >= 20 && data.stats.securePercentage <= 39) {
                            setDangerData("High")
                        } else {
                            setDangerData("Extreme")
                        }

                        setScoreData(data.stats.securePercentage);

                        setURLData(data.page.url);
                        setIpAddData(data.page.ip);
                        setDomainNameData(data.page.domain);
                        setCountryData(data.page.country);

                        setServerData(data.page.server);
                        setASNData(data.page.asn);
                        setASNNameData(data.page.asnname);
                        setSubmitterData(data.submitter.country);

                        setCertificateData(data.lists.certificates);

                        setRequestsData(data.data.requests.length);
                        setDomainsData(data.stats.domainStats.length);
                        setSubDomainsData(data.stats.regDomainStats.length);
                        setIpsData(data.stats.ipStats.length);
                        setIpv6Data(data.stats.IPv6Percentage);
                        setCookiesData(data.data.cookies.length);
                    } else {
                        setShowAlert(true);
                        setAlertMessage('API response does not contain submitter data:', data);
                        console.error('API response does not contain submitter data:', data);
                    }
                })
                .catch((error) => {
                    setShowAlert(true);
                    setAlertMessage('Error fetching submitter data:', error);
                    console.error('Error fetching submitter data:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [uuid]);

    const handleURLClick = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
        } else {
            // Fetch the security question from the database using the accessToken
            fetchSecurityQuestion(accessToken)
                .then((questions) => {
                    const { q1, q1a, q2, q2a, q3, q3a } = questions;
                    setSecurityQuestion1(q1);
                    setSecurityQuestion2(q2);
                    setSecurityQuestion3(q3);

                    setSecurityDatabaseAnswer1(q1a);
                    setSecurityDatabaseAnswer2(q2a);
                    setSecurityDatabaseAnswer3(q3a);

                    setShowSecurityQuestionDialog(true);
                })
                .catch((error) => {
                    console.error('Error fetching security question:', error);
                });
        }
    };

    const fetchSecurityQuestion = async (accessToken) => {
        try {
            const response = await fetch('http://localhost:8080/secuquestion/get-questions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                console.log("Security Question not found");

                setShowAlert(true);
                setAlertMessage("Security Question not found. Redirecting to profile page");
                setTimeout(() => {
                    navigate('/profile');
                }, 5000);
            }

            const data = await response.json();
            return data.questions;
        } catch (error) {
            setShowAlert(true);
            setAlertMessage('Error fetching security question:', error);
            throw error;
        }
    };

    const handleSecurityQuestionSubmit = () => {
        const isAnswersMatched =
            securityAnswer1.toLowerCase() === securityDatabaseAnswer1.toLowerCase() &&
            securityAnswer2.toLowerCase() === securityDatabaseAnswer2.toLowerCase() &&
            securityAnswer3.toLowerCase() === securityDatabaseAnswer3.toLowerCase();

        if (isAnswersMatched) {
            console.log('Security question answers are correct');
            setShowSuccessSnackbar(true);
            setSuccessMessage('Security question answers are correct. Redirecting to ');

            setTimeout(() => {
                window.open(URLData, '_blank');
            }, 5000);

            setSecurityAnswer1('');
            setSecurityAnswer2('');
            setSecurityAnswer3('');

            setShowSecurityQuestionDialog(false);
        } else {
            console.log('Security question answers are incorrect');
            setShowAlert(true);
            setAlertMessage('Incorrect answers, please try again');
        }
    };

    const handleScanDetailsDialogOpen = () => {
        setshowScanDetailsDialog(true);
    };

    const handleScanDetailsDialogClose = () => {
        setshowScanDetailsDialog(false);
    };

    const handleCertificateDialogOpen = () => {
        setshowCertificateDialog(true);
    };

    const handleCertificateDialogClose = () => {
        setshowCertificateDialog(false);
    };

    const handleAddInformationDialogOpen = () => {
        setshowAddInformationDialog(true);
    };

    const handleAddInformationDialogClose = () => {
        setshowAddInformationDialog(false);
    };

    const handleVideoDialogOpen = () => {
        setshowVideoDialog(true);
    };

    const handleVideoDialogClose = () => {
        setshowVideoDialog(false);
    };

    return (
        <>
            <Header />
            <Container maxWidth="xl" style={containerStyle}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="left"
                    justifyContent="center"
                    height="100%"
                    marginBottom="10%"
                >
                    {rateLimitMessage && <RateLimitMessage message={rateLimitMessage} />}
                    <div style={resultHeaderStyle}>
                        <div>
                            <Typography gutterBottom sx={{ fontSize: '1.8rem', textAlign: 'left', fontWeight: 'bold' }}>
                                {safeData}
                            </Typography>
                            <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'left', color: 'grey' }}>
                                Danger Level: {dangerData}
                                {dangerData === "Low" && (
                                    <CheckCircleIcon sx={{ color: 'green', padding: '0 0 10px 5px', verticalAlign: 'middle' }} />
                                )}
                                {dangerData === "Moderate" && (
                                    <ReportIcon sx={{ color: 'yellow', padding: '0 0 10px 5px', verticalAlign: 'middle' }} />
                                )}
                                {dangerData === "Considerable" && (
                                    <WarningIcon sx={{ color: 'orange', padding: '0 0 10px 5px', verticalAlign: 'middle' }} />
                                )}
                                {dangerData === "High" && (
                                    <DangerousIcon sx={{ color: 'red', padding: '0 0 10px 5px', verticalAlign: 'middle' }} />
                                )}
                                {dangerData === "Extreme" && (
                                    <DangerousIcon sx={{ color: 'black', padding: '0 0 10px 5px', verticalAlign: 'middle' }} />
                                )}
                            </Typography>
                        </div>
                        <div style={circularProgressStyle}>
                            <ColoredCircularProgress value={scoreData} />
                            <Typography variant="h6" style={percentageStyle}>
                                {scoreData}%
                            </Typography>
                            <Typography>URL Secure Score</Typography>
                        </div>
                    </div>
                    <Divider sx={{ padding: '10px 0' }} />
                    <Grid container spacing={3} sx={{ marginTop: '10px' }}>
                        <Grid item xs={7}>
                            <Typography gutterBottom sx={{ textAlign: 'left', fontSize: '1.3rem', fontWeight: 'bold' }} onClick={handleScanDetailsDialogOpen}>
                                Scan Details
                                <HelpOutlineIcon sx={{ color: 'grey', padding: '0 0 0 3px', verticalAlign: 'middle', fontSize: '1rem' }} />
                            </Typography>
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell style={tableCellStyle}>
                                                <div style={{ width: '100px' }}>URL:</div>
                                                <a href="#" onClick={handleURLClick} style={{ marginLeft: '5%' }}>
                                                    {URLData}
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={tableCellStyle}>
                                                <div style={{ width: '100px' }}>IP address: </div>
                                                <div style={{ marginLeft: '5%' }}>{ipAddData}</div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={tableCellStyle}>
                                                <div style={{ width: '100px' }}>Domain: </div>
                                                <div style={{ marginLeft: '5%' }}>{domainNameData}</div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={tableCellStyle}>
                                                <div style={{ width: '100px' }}>Country: </div>
                                                <div style={{ marginLeft: '5%' }}>{countryData}</div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={tableCellStyle}>
                                                <div style={{ width: '100px' }}>Server: </div>
                                                <div style={{ marginLeft: '5%' }}>{serverData}</div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={tableCellStyle}>
                                                <div style={{ width: '100px' }}>ASN: </div>
                                                <div style={{ marginLeft: '5%' }}>{ASNData}</div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={tableCellStyle}>
                                                <div style={{ width: '100px' }}>ASN Name: </div>
                                                <div style={{ marginLeft: '5%' }}>{ASNNameData}</div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={tableCellStyle}>
                                                <div style={{ width: '100px' }}>Submit From: </div>
                                                <div style={{ marginLeft: '5%' }}>{submitterData}</div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Divider sx={{ padding: '10px 0' }} />
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', fontSize: '1.3rem', fontWeight: 'bold', marginTop: '20px' }} onClick={handleCertificateDialogOpen}>
                                Certificate
                                <HelpOutlineIcon sx={{ color: 'grey', padding: '0 0 0 3px', verticalAlign: 'middle', fontSize: '1rem' }} />
                            </Typography>
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ ...tableCertStyle, background: '#f0f0f0' }}>
                                                <div style={{ width: '30%' }}>Name </div>
                                                <div style={{ width: '20%' }}>Issuer</div>
                                                <div>Validity</div>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {certificateData && certificateData.map((certificate, index) => (
                                            <TableRow key={index}>
                                                <TableCell style={tableCertStyle}>
                                                    <div style={{ width: '30%' }}>{certificate.subjectName}</div>
                                                    <div style={{ width: '20%' }}>{certificate.issuer}</div>
                                                    <div>Valid from: {formatDate(certificate.validFrom)} to {formatDate(certificate.validTo)}</div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={5}>
                            {/* Display additional information */}
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', fontSize: '1.3rem', fontWeight: 'bold' }} onClick={handleAddInformationDialogOpen}>
                                Additional Info
                                <HelpOutlineIcon sx={{ color: 'grey', padding: '0 0 0 3px', verticalAlign: 'middle', fontSize: '1rem' }} />
                            </Typography>
                            <Grid container spacing={3} sx={{ marginTop: '3%' }}>
                                <Grid item xs={4} sx={{ marginBottom: '5%' }}>
                                    <div style={addGridValue}>
                                        <RandomNumberAnimation finalValue={requestsData} />
                                    </div>
                                    <div style={addGridWord}>Requests</div>
                                </Grid>
                                <Grid item xs={4}>
                                    <div style={addGridValue}>
                                        <RandomNumberAnimation finalValue={domainsData} />
                                    </div>
                                    <div style={addGridWord}>
                                        Domains
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <div style={addGridValue}>
                                        <RandomNumberAnimation finalValue={subdomainsData} />
                                    </div>
                                    <div style={addGridWord}>
                                        Subdomains
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <div style={addGridValue}>
                                        <RandomNumberAnimation finalValue={ipsData} />
                                    </div>
                                    <div style={addGridWord}>
                                        IPs
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={addGridValue}>
                                            <RandomNumberAnimation finalValue={ipv6Data} />
                                        </div>
                                        <div style={{ marginLeft: '5px' }}>%</div>
                                    </div>
                                    <div style={addGridWord}>
                                        IPv6
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <div style={addGridValue}>
                                        <RandomNumberAnimation finalValue={cookiesData} />
                                    </div>
                                    <div style={addGridWord}>
                                        Cookies
                                    </div>
                                </Grid>
                            </Grid>
                            <Divider sx={{ padding: '30px 0' }} />
                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', fontSize: '1.3rem', fontWeight: 'bold', marginTop: '20px' }} onClick={handleVideoDialogOpen}>
                                Video
                                <HelpOutlineIcon sx={{ color: 'grey', padding: '0 0 0 3px', verticalAlign: 'middle', fontSize: '1rem' }} />
                            </Typography>
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/XBkzBrXlle0"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </Grid>
                    </Grid>
                </Box>
            </Container >
            <Footer />

            <Dialog open={showScanDetailsDialog} onClose={() => setshowScanDetailsDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    Scan Details
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleScanDetailsDialogClose}
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            right: 20,
                            top: 10,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ marginBottom: '3%' }}>URL: A URL is a reference or address used to access resources on the internet. It specifies the means to access the resource, the protocol, and the location of the resource.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>IP Address: An IP address is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>Domain: Domain is a human-readable address that represents an IP address. It is used to identify and locate resources on the internet.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>Country: Geolocation databases map IP addresses to specific countries, providing information about the likely location of a device or server.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>Server: A server is a computer program or device that provides functionality to other programs or devices, known as clients.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>ASN: An ASN is a unique identifier assigned to an autonomous system, which is a collection of IP networks and routers under the control of a single organization that presents a common routing policy to the internet.</Typography>
                    <Typography>ASN Name: The ASN name is the human-readable name associated with an Autonomous System Number. The ASN name is the human-readable name associated with an Autonomous System Number.</Typography>
                </DialogContent>
            </Dialog>

            <Dialog open={showSecurityQuestionDialog} onClose={() => setShowSecurityQuestionDialog(false)} >
                <DialogTitle>Security Question</DialogTitle>
                <DialogContent>
                    <Typography>{securityQuestion1}</Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Answer"
                        type="text"
                        fullWidth
                        value={securityAnswer1}
                        onChange={(e) => setSecurityAnswer1(e.target.value)}
                        sx={{
                            '& label.Mui-focused': {
                                color: 'black',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'black',
                            },
                        }}
                    />
                    <Typography>{securityQuestion2}</Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Answer"
                        type="text"
                        fullWidth
                        value={securityAnswer2}
                        onChange={(e) => setSecurityAnswer2(e.target.value)}
                        sx={{
                            '& label.Mui-focused': {
                                color: 'black',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'black',
                            },
                        }}
                    />
                    <Typography>{securityQuestion3}</Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Answer"
                        type="text"
                        fullWidth
                        value={securityAnswer3}
                        onChange={(e) => setSecurityAnswer3(e.target.value)}
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
                    <Button onClick={() => setShowSecurityQuestionDialog(false)} sx={{ color: 'black' }}>Cancel</Button>
                    <Button onClick={handleSecurityQuestionSubmit} sx={{ color: 'black' }}>Submit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showCertificateDialog} onClose={() => setshowCertificateDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    Certificate
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCertificateDialogClose}
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            right: 20,
                            top: 10,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ marginBottom: '5%' }}>A certificate, in the context of web security and communication, generally refers to an SSL/TLS certificate. SSL (Secure Sockets Layer) and its successor, TLS (Transport Layer Security), are cryptographic protocols that provide secure communication over a computer network, such as the internet. SSL/TLS certificates are used to establish a secure and encrypted connection between a user's web browser and a web server.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>Name: The common name (CN) or subject of the certificate. It typically represents the entity for which the certificate is issued, such as a domain or a specific server.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>Issuer: The entity (Certificate Authority or CA) that issues the certificate. The issuer is a trusted third party that vouches for the authenticity of the information in the certificate.</Typography>
                    <Typography>Validity: The period during which the certificate is considered valid. It includes the start date (Valid from) and the expiration date. Certificates need to be periodically renewed to ensure continued security.</Typography>
                </DialogContent>
            </Dialog>

            <Dialog open={showAddInformationDialog} onClose={() => setshowAddInformationDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    Additional Information
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleAddInformationDialogClose}
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            right: 20,
                            top: 10,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ marginBottom: '3%' }}>Request: The total number of HTTP requests made by the web page to load all its resources. These resources can include HTML files, stylesheets, scripts, images, and other types of files.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>Domains: The total number of unique domain names from which the web page requests resources. Each domain may represent a different server or source for specific elements on the page.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>Subdomains: The total number of unique subdomains associated with the main domain of the website. Subdomains are additional parts of the domain hierarchy that precede the main domain name.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>IPs: The total number of unique IP addresses associated with the website. Each IP address represents a specific server or network device that hosts part of the website's content.</Typography>
                    <Typography sx={{ marginBottom: '3%' }}>IPv6: The percentage of requests made using IPv6, a version of the Internet Protocol that uses longer addresses than the more common IPv4. IPv6 is designed to address the limitations of IPv4, especially in the context of the growing number of devices connected to the internet.</Typography>
                    <Typography>Cookies: The total number of HTTP cookies set by the website. Cookies are small pieces of data sent from a website and stored on the user's device. They are commonly used for session management, personalization, and tracking user behavior.</Typography>
                </DialogContent>
            </Dialog>

            <Dialog open={showVideoDialog} onClose={() => setshowVideoDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    Video
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleVideoDialogClose}
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            right: 20,
                            top: 10,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>The video will provide some knowledges and impact of phishing attack in order to prevent phishing attack.</Typography>
                </DialogContent>
            </Dialog>

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

            <Snackbar
                open={showSuccessSnackbar}
                autoHideDuration={5000}
                onClose={() => setShowSuccessSnackbar(false)}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={() => setShowSuccessSnackbar(false)}
                    severity="success"
                >
                    {successMessage}{URLData}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default URLResult;