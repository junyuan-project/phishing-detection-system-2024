import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import {
    Container,
    Grid,
    Typography,
    Snackbar,
    Tab,
    Tabs,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    MenuItem,
    Divider,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Profile() {
    const { authState, setAuthState } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedUsername, setEditedUsername] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    let navigate = useNavigate();

    const [securityQuestions, setSecurityQuestions] = useState([
        "In what city were you born?",
        "What is the name of your favorite pet?",
        "What is your mother's maiden name?",
        "What high school did you attend?",
        "What was the name of your elementary school?",
        "What was the make of your first car?",
        "What was your favorite food as a child?",
        "Where did you meet your spouse?",
        "What year was your father (or mother) born?",
    ]);

    const [securityQuestion1, setSecurityQuestion1] = useState("");
    const [securityAnswer1, setSecurityAnswer1] = useState("");
    const [securityQuestion2, setSecurityQuestion2] = useState("");
    const [securityAnswer2, setSecurityAnswer2] = useState("");
    const [securityQuestion3, setSecurityQuestion3] = useState("");
    const [securityAnswer3, setSecurityAnswer3] = useState("");

    const [hasSecurityQuestions, setHasSecurityQuestions] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        const fetchData = async () => {
            if (!accessToken) {
                navigate("/login");
            } else {
                try {
                    const response = await axios.get("http://localhost:8080/auth/user", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    setUserProfile(response.data);

                    const responseSecurity = await axios.get(
                        `http://localhost:8080/secuquestion/check/${response.data.user_id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    if (responseSecurity.data.questionsExist === true) {
                        setHasSecurityQuestions(responseSecurity.data.questions);
                    }
                } catch (error) {
                    console.error("Error fetching user profile or security questions:", error);
                    setShowAlert(true);
                    setAlertMessage("Error fetching user profile or security questions");
                }
            }
        };

        fetchData();
    }, [navigate]);

    const fetchUserProfile = async (accessToken) => {
        try {
            const response = await axios.get("http://localhost:8080/auth/user", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setUserProfile(response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setShowAlert(true);
            setAlertMessage("Error fetching user profile");
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const openEditDialog = () => {
        setEditDialogOpen(true);
        setEditedUsername(userProfile.username);
        setEditedEmail(userProfile.email);
        setEditedPhoneNumber(userProfile.phoneNumber);
    };

    const closeEditDialog = () => {
        setEditDialogOpen(false);
    };

    const handleEditSave = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.put(
                "http://localhost:8080/auth/edit",
                {
                    username: editedUsername,
                    email: editedEmail,
                    phoneNum: editedPhoneNumber,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);

            fetchUserProfile(accessToken);

            closeEditDialog();

            window.location.reload();
        } catch (error) {
            console.error("Error updating user information:", error);
            setShowAlert(true);
            setAlertMessage("Error updating user information");
        }
    };

    const handleSecurityQuestionsCreate = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.post(
                "http://localhost:8080/secuquestion/create",
                {
                    q1: securityQuestion1,
                    q1a: securityAnswer1,
                    q2: securityQuestion2,
                    q2a: securityAnswer2,
                    q3: securityQuestion3,
                    q3a: securityAnswer3,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            // Assuming the server sends a success message
            console.log(response.data);

            setSecurityQuestion1("");
            setSecurityQuestion2("");
            setSecurityQuestion3("");

            setSecurityAnswer1("");
            setSecurityAnswer2("");
            setSecurityAnswer3("");

            setShowSuccess(true);
            setSuccessMessage(response.data.message);

            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error("Error submitting security question:", error);
            setShowAlert(true);
            setAlertMessage("Error submitting security question");
        }
    };

    const handleSecurityQuestionsSubmit = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.put(
                "http://localhost:8080/secuquestion/update",
                {
                    q1: securityQuestion1,
                    q1a: securityAnswer1,
                    q2: securityQuestion2,
                    q2a: securityAnswer2,
                    q3: securityQuestion3,
                    q3a: securityAnswer3,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);

            setSecurityQuestion1("");
            setSecurityQuestion2("");
            setSecurityQuestion3("");

            setSecurityAnswer1("");
            setSecurityAnswer2("");
            setSecurityAnswer3("");

            setShowSuccess(true);
            setSuccessMessage(response.data.message);

            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error("Error submitting security question:", error);
            setShowAlert(true);
            setAlertMessage("Error submitting security question");
        }
    };

    const handlePasswordChange = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.put(
                "http://localhost:8080/auth/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmNewPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");

            setShowSuccess(true);
            setSuccessMessage(response.data.message);
        } catch (error) {
            console.error("Error changing password:", error);
            setShowAlert(true);
            setAlertMessage("Error changing password");
        }
    };

    return (
        <>
            <Header />

            <Container component="main" maxWidth="md" sx={{ marginBottom: '100px' }}>
                <Typography variant="h5" sx={{ textAlign: 'left', marginTop: '30px' }}>User Profile</Typography>

                <Grid container spacing={2} sx={{ marginTop: 1 }}>
                    <Grid item xs={12} sm={4}>
                        <img
                            src="usericon.png"
                            alt="Profile"
                            style={{ width: "100%", borderRadius: "50%" }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}></Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
                        {userProfile ? (
                            <>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{userProfile.username}</Typography>
                                <Typography sx={{ color: 'blue' }}>User</Typography>
                                <Divider sx={{ padding: '20px 0' }} />

                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    sx={{
                                        color: 'white',
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: 'black',
                                        },
                                        '& .Mui-selected': {
                                            color: 'black !important',
                                        },
                                    }}
                                    centered
                                >
                                    <Tab label="About" wrapped />
                                    <Tab label="Security Question" wrapped />
                                    <Tab label="Password Management" wrapped />
                                </Tabs>

                                {/* Content for each tab */}
                                {tabValue === 0 && (
                                    <Typography variant="body1" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                                        Contact Information

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body1" sx={{ fontSize: '0.9rem', marginTop: '10px' }}>
                                                    Username:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="body1" sx={{ fontSize: '0.9rem', marginTop: '10px' }}>
                                                    {userProfile.username}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body1" sx={{ fontSize: '0.9rem', marginTop: '10px' }}>
                                                    Email:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="body1" sx={{ fontSize: '0.9rem', marginTop: '10px' }}>
                                                    {userProfile.email}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body1" sx={{ fontSize: '0.9rem', marginTop: '10px' }}>
                                                    Phone Number:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="body1" sx={{ fontSize: '0.9rem', marginTop: '10px' }}>
                                                    {userProfile.phoneNumber}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={openEditDialog}
                                            style={{
                                                marginTop: '20px',
                                                backgroundColor: 'black',
                                                width: '30%',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#333',
                                                },
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </Typography>
                                )}
                                {tabValue === 1 && (
                                    <Typography sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                                        Security Question

                                        {hasSecurityQuestions ? (
                                            <>
                                                <Typography>Change your Security Question here.</Typography>
                                                <TextField
                                                    select
                                                    label="Security Question 1"
                                                    fullWidth
                                                    value={securityQuestion1}
                                                    onChange={(e) => setSecurityQuestion1(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                >
                                                    {securityQuestions.map((question) => (
                                                        <MenuItem key={question} value={question}>
                                                            {question}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    margin="dense"
                                                    label="Answer 1"
                                                    fullWidth
                                                    value={securityAnswer1}
                                                    onChange={(e) => setSecurityAnswer1(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                />
                                                <TextField
                                                    select
                                                    label="Security Question 2"
                                                    fullWidth
                                                    value={securityQuestion2}
                                                    onChange={(e) => setSecurityQuestion2(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                >
                                                    {securityQuestions.map((question) => (
                                                        <MenuItem key={question} value={question}>
                                                            {question}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    margin="dense"
                                                    label="Answer 2"
                                                    fullWidth
                                                    value={securityAnswer2}
                                                    onChange={(e) => setSecurityAnswer2(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                />
                                                <TextField
                                                    select
                                                    label="Security Question 3"
                                                    fullWidth
                                                    value={securityQuestion3}
                                                    onChange={(e) => setSecurityQuestion3(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                >
                                                    {securityQuestions.map((question) => (
                                                        <MenuItem key={question} value={question}>
                                                            {question}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    margin="dense"
                                                    label="Answer 3"
                                                    fullWidth
                                                    value={securityAnswer3}
                                                    onChange={(e) => setSecurityAnswer3(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                />

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSecurityQuestionsSubmit}
                                                    sx={{ width: '100%', marginTop: '20px', backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}
                                                >
                                                    Submit
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Typography>Create Security Question here.</Typography>
                                                <TextField
                                                    select
                                                    label="Security Question 1"
                                                    fullWidth
                                                    value={securityQuestion1}
                                                    onChange={(e) => setSecurityQuestion1(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                >
                                                    {securityQuestions.map((question) => (
                                                        <MenuItem key={question} value={question}>
                                                            {question}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    margin="dense"
                                                    label="Answer 1"
                                                    fullWidth
                                                    value={securityAnswer1}
                                                    onChange={(e) => setSecurityAnswer1(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                />
                                                <TextField
                                                    select
                                                    label="Security Question 2"
                                                    fullWidth
                                                    value={securityQuestion2}
                                                    onChange={(e) => setSecurityQuestion2(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                >
                                                    {securityQuestions.map((question) => (
                                                        <MenuItem key={question} value={question}>
                                                            {question}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    margin="dense"
                                                    label="Answer 2"
                                                    fullWidth
                                                    value={securityAnswer2}
                                                    onChange={(e) => setSecurityAnswer2(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                />
                                                <TextField
                                                    select
                                                    label="Security Question 3"
                                                    fullWidth
                                                    value={securityQuestion3}
                                                    onChange={(e) => setSecurityQuestion3(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                >
                                                    {securityQuestions.map((question) => (
                                                        <MenuItem key={question} value={question}>
                                                            {question}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    margin="dense"
                                                    label="Answer 3"
                                                    fullWidth
                                                    value={securityAnswer3}
                                                    onChange={(e) => setSecurityAnswer3(e.target.value)}
                                                    sx={{ marginTop: '10px' }}
                                                />

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSecurityQuestionsCreate}
                                                    sx={{ width: '100%', marginTop: '20px', backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}
                                                >
                                                    Submit
                                                </Button>
                                            </>
                                        )}
                                    </Typography>
                                )}
                                {tabValue === 2 && (
                                    <Typography sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                                        Edit Password

                                        <TextField
                                            margin="dense"
                                            label="Current Password"
                                            fullWidth
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            sx={{
                                                marginTop: '10px',
                                                '& label.Mui-focused': {
                                                    color: 'black',
                                                },
                                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'black',
                                                },
                                            }}
                                        />

                                        <TextField
                                            margin="dense"
                                            label="New Password"
                                            fullWidth
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            sx={{
                                                marginTop: '10px',
                                                '& label.Mui-focused': {
                                                    color: 'black',
                                                },
                                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'black',
                                                },
                                            }}
                                        />

                                        <TextField
                                            margin="dense"
                                            label="Confirm New Password"
                                            fullWidth
                                            type="password"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            sx={{
                                                marginTop: '10px',
                                                '& label.Mui-focused': {
                                                    color: 'black',
                                                },
                                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'black',
                                                },
                                            }}
                                        />

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handlePasswordChange}
                                            sx={{ width: '100%', marginTop: '20px', backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}
                                        >
                                            Submit
                                        </Button>
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <Typography variant="subtitle1">Loading user profile...</Typography>
                        )}
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

                <Snackbar
                    open={showSuccess}
                    autoHideDuration={5000}
                    onClose={() => setShowSuccess(false)}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={() => setShowSuccess(false)}
                        severity="success"
                    >
                        {successMessage}
                    </MuiAlert>
                </Snackbar>

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onClose={closeEditDialog}>
                    <DialogTitle>Edit User Information</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Update the user information below:
                        </DialogContentText>
                        <TextField
                            margin="dense"
                            label="Email"
                            fullWidth
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            disabled
                            sx={{ marginTop: '30px' }}
                        />
                        <TextField
                            margin="dense"
                            label="Username"
                            fullWidth
                            value={editedUsername}
                            onChange={(e) => setEditedUsername(e.target.value)}
                            sx={{
                                marginTop: '20px',
                                '& label.Mui-focused': {
                                    color: 'black',
                                },
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'black',
                                },
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Phone Number"
                            fullWidth
                            value={editedPhoneNumber}
                            onChange={(e) => setEditedPhoneNumber(e.target.value)}
                            sx={{
                                marginTop: '20px',
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
                        <Button onClick={closeEditDialog} sx={{ color: 'black' }}>Cancel</Button>
                        <Button onClick={handleEditSave} color="primary" sx={{ color: 'black' }}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>

            <Footer />
        </>
    );
}

export default Profile;
