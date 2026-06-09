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
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import PeopleIcon from '@mui/icons-material/People';
import CloudIcon from '@mui/icons-material/Cloud';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';

const AdminHome = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalURLs, setTotalURLs] = useState(0);
    const [phishUrls, setPhishUrls] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    let navigate = useNavigate();

    const contentStyle = {
        flexGrow: 1,
        padding: '20px',
        marginLeft: '50px',
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken2');

        if (!accessToken) {
            navigate('login');
        } else {
            try {
                const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
                const userRole = decodedToken.role;

                if (userRole !== 'Admin') {
                    navigate('login');
                } else {
                    const fetchData = async () => {
                        try {
                            const apiKey = '6867fda0623bb3cf0308e632bb4dcd93';
                            const city = 'Kuala Lumpur';
                            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

                            const response = await axios.get(apiUrl);
                            setWeatherData(response.data);
                        } catch (error) {
                            console.error('Error fetching weather data:', error);
                        }
                    };

                    getChartData();
                    fetchData();
                    getAllUserData();
                    getAllURLData();
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                navigate('login');
            }
        }
    }, [navigate]);

    const getAllUserData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/auth/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken2')}`,
                },
            });

            setTotalUsers(response.data.length);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const getAllURLData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/get-all-data');
            const phishUrlsData = response.data.data;
            setTotalURLs(phishUrlsData.length);
            const latestPhishUrls = phishUrlsData.slice(-5);
            setPhishUrls(latestPhishUrls);

            const statusCounts = {
                Approve: 0,
                Reject: 0,
                Pending: 0,
            };

            phishUrlsData.forEach((url) => {
                statusCounts[url.status] += 1;
            });

            setChartData({
                labels: Object.keys(statusCounts),
                datasets: [
                    {
                        label: 'Phish URL',
                        data: Object.values(statusCounts),
                        backgroundColor: ['rgb(0, 255, 0)', 'rgb(255, 0, 0)', 'rgb(255, 165, 0)'],
                        hoverOffset: 4,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching URL data:', error);
        }
    };

    const getChartData = () => {
        setChartData({
            labels: ['Red', 'Blue', 'Orange'],
            datasets: [
                {
                    label: 'Phish URL',
                    data: [300, 50, 100],
                    backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 165, 0)'],
                    hoverOffset: 4,
                },
            ],
        });
    };

    return (
        <>
            <Header />
            <div style={{ backgroundColor: '#f5f5f5', height: '750px' }}>
                <main style={contentStyle}>
                    <Toolbar />

                    <Container>
                        <Typography variant="h5" gutterBottom marginTop={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
                            Hi, Welcome Back
                        </Typography>

                        <Grid container spacing={3} marginTop={1}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper style={{ height: '100%', padding: 20, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <CloudIcon fontSize="large" color="black" style={{ marginTop: '18px' }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} textAlign={'left'} marginLeft={'20px'}>
                                            {weatherData ? (
                                                <div>
                                                    <Typography fontSize={'1.4rem'} fontWeight={'bold'}>{weatherData.name}</Typography>
                                                    <Typography color={'grey'}>{weatherData.weather[0].description}</Typography>
                                                    <Typography color={'grey'}>{weatherData.main.temp}°C</Typography>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Typography variant="h6">Weather not found</Typography>
                                                </div>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper style={{ height: '100%', padding: 20, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }} >
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <PeopleIcon fontSize="large" color="black" style={{ marginTop: '20px' }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} textAlign={'left'} marginLeft={'20px'}>
                                            <Typography fontSize={'1.8rem'} fontWeight={'bold'} marginTop={'5px'}>{totalUsers}</Typography>
                                            <Typography fontSize={'1.1rem'} color={'grey'}>users</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper style={{ height: '100%', padding: 20, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <LinkIcon fontSize="large" color="black" style={{ marginTop: '20px' }} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} textAlign={'left'} marginLeft={'20px'}>
                                            <Typography fontSize={'1.8rem'} fontWeight={'bold'} marginTop={'5px'}>{totalURLs}</Typography>
                                            <Typography fontSize={'1.1rem'} color={'grey'}>URLs</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Paper style={{ padding: 20, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <Typography fontWeight={'bold'} textAlign={'left'}>Phish URL</Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>URL</TableCell>
                                                    <TableCell>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {phishUrls.map((url) => (
                                                    <TableRow key={url.id}>
                                                        <TableCell>{url.id}</TableCell>
                                                        <TableCell>{url.url}</TableCell>
                                                        <TableCell>{url.status}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Paper style={{ padding: 20, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <Typography fontWeight={'bold'} textAlign={'left'}>Phish URL</Typography>
                                    <div style={{ width: '70%', margin: 'auto' }}>
                                        <Doughnut data={chartData} />
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>
        </>
    );
};

export default AdminHome;
