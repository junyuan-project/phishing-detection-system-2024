import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Typography, LinearProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

function Home() {
    const containerStyle = {
        background: 'white',
        color: 'white',
    };

    const textFieldStyle = {
        marginTop: '5%',
        marginBottom: '2%',
        width: '70%',
        '& input': {
            borderColor: 'black',
            '&:focus': {
                outline: 'none',
            },
        },
        '& label.Mui-focused': {
            color: 'black',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
        },
    };

    const overlayStyle = {
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
    };

    const contentStyle = {
        width: '80%',
        padding: '10px',
        textAlign: 'left',
    };

    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = () => {
        if (url.trim() === '') {
            setShowAlert(true);
            setAlertMessage("URL is empty");
            return;
        }

        setLoading(true);

        let progressValue = 0;
        const progressInterval = setInterval(() => {
            // Increase the progress smoothly
            if (progressValue < 100) {
                progressValue += 10;
            }
            setProgress(progressValue);

            if (progressValue >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => setLoading(false), 500);
            }
        }, 1000);

        fetch('http://localhost:8080/api/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urlToScan: url.trim() }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Check if the API response is successful
                if (data && data.uuid) {
                    navigate(`/result/${data.uuid}`, { state: { scanData: data } });
                } 
                else {
                    setShowAlert(true);
                    setAlertMessage(data.error);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setShowAlert(true);
                setAlertMessage(error);
                setLoading(false);
            });
    };

    return (
        <>
            <Header />
            <Container maxWidth="xl" style={containerStyle}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    marginBottom="10%"
                >
                    <img
                        src="/phisherman_2.png"
                        alt="Logo"
                        style={{ width: '30%', margin: '5% auto', display: 'block', marginBottom: '3%' }}
                    />
                    <TextField
                        label="Search Phish"
                        variant="outlined"
                        fullWidth
                        sx={textFieldStyle}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyPress={handleEnterKeyPress}
                    />
                    <Typography sx={{ color: 'grey', marginTop: '1%' }}>
                        Enter a URL into the input field and press 'Enter' to initiate scanning the URL
                    </Typography>
                    {loading && (
                        <Box style={overlayStyle}>
                            <Box style={contentStyle}>
                                <Typography sx={{ color: 'black', fontSize: '1.5rem', marginBottom: '10px' }}>
                                    {url}
                                </Typography>
                                <Typography sx={{ color: 'black', fontSize: '1.3rem', marginBottom: '10px' }}>
                                    {progress}%
                                </Typography>
                                <LinearProgress variant="determinate" value={progress} sx={{ width: '100%' }} />
                                <Typography sx={{ color: 'grey', marginTop: '10px' }}>
                                    We're browsing for this website. Once the process is completed, you will automatically be redirected to the result. <br /> Please do not have to refresh this page!
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Container>
            <Footer />
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
        </>
    );
}

export default Home;
