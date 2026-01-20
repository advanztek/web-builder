import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Avatar,
    TextField,
    Divider,
    Paper,
    useTheme,
    IconButton,
    Chip,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Switch,
    FormControlLabel,
    Tabs,
    Tab,
    Badge,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
    Zoom,
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    PhotoCamera,
    Email,
    Phone,
    LocationOn,
    Business,
    Language,
    CheckCircle,
    Star,
    TrendingUp,
    AccountBalanceWallet,
    Notifications,
    Security,
    Palette,
    Settings,
    Save,
    Cancel,
    Delete,
    CloudUpload,
    Verified,
    EmojiEvents,
    Cake,
    Work,
} from '@mui/icons-material';

const ProfilePage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [avatarDialog, setAvatarDialog] = useState(false);

    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'Lagos, Nigeria',
        company: 'Tech Innovations Inc.',
        website: 'www.johndoe.com',
        bio: 'Passionate web designer and developer with 5+ years of experience creating stunning digital experiences.',
        joinDate: 'January 2024',
        totalProjects: 24,
        completedProjects: 18,
        credits: 2500,
        level: 'Pro',
    });

    const [settings, setSettings] = useState({
        emailNotifications: true,
        projectUpdates: true,
        marketingEmails: false,
        darkMode: false,
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleInputChange = (field) => (event) => {
        setProfileData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSettingToggle = (setting) => (event) => {
        setSettings(prev => ({
            ...prev,
            [setting]: event.target.checked
        }));
    };

    const handleSaveProfile = () => {
        setEditMode(false);
        setSnackbar({
            open: true,
            message: 'Profile updated successfully!',
            severity: 'success'
        });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const achievements = [
        { icon: <EmojiEvents sx={{ fontSize: 40, color: '#ffd700' }} />, title: 'First Project', desc: 'Completed your first project' },
        { icon: <Star sx={{ fontSize: 40, color: '#667eea' }} />, title: 'Rising Star', desc: 'Earned 1000+ credits' },
        { icon: <TrendingUp sx={{ fontSize: 40, color: '#4ade80' }} />, title: 'Productivity Master', desc: 'Created 20+ projects' },
        { icon: <Verified sx={{ fontSize: 40, color: '#3b82f6' }} />, title: 'Verified Pro', desc: 'Reached Pro level' },
    ];

    const activityLog = [
        { action: 'Created new project "E-commerce Site"', time: '2 hours ago', icon: <CheckCircle color="success" /> },
        { action: 'Updated profile information', time: '1 day ago', icon: <Edit color="primary" /> },
        { action: 'Purchased 500 credits', time: '3 days ago', icon: <AccountBalanceWallet color="warning" /> },
        { action: 'Completed "Landing Page" project', time: '5 days ago', icon: <CheckCircle color="success" /> },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, pb: 6 }}>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #03104bff 0%, #020220ff 100%)',
                    height: 280,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', pt: 3 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        sx={{
                            color: 'white',
                            mb: 2,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        Back to Dashboard
                    </Button>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -15, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs:12, md:4 }}>
                        <Zoom in timeout={600}>
                            <Card
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: theme.shadows[10],
                                    overflow: 'visible',
                                }}
                            >
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    {/* Avatar */}
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                            <IconButton
                                                size="small"
                                                onClick={() => setAvatarDialog(true)}
                                                sx={{
                                                    bgcolor: theme.palette.primary.main,
                                                    color: 'white',
                                                    '&:hover': { bgcolor: theme.palette.primary.dark },
                                                }}
                                            >
                                                <PhotoCamera sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        }
                                    >
                                        <Avatar
                                            sx={{
                                                width: 140,
                                                height: 140,
                                                margin: '0 auto',
                                                mb: 2,
                                                color: '#fff',
                                                border: '5px solid white',
                                                boxShadow: theme.shadows[8],
                                                background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)',
                                                fontSize: '3rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {profileData.firstName[0]}{profileData.lastName[0]}
                                        </Avatar>
                                    </Badge>

                                    {/* Name & Level */}
                                    <Typography variant="h5" fontWeight={700} gutterBottom>
                                        {profileData.firstName} {profileData.lastName}
                                    </Typography>
                                    <Chip
                                        label={`${profileData.level} Member`}
                                        icon={<Verified />}
                                        sx={{
                                            mb: 3,
                                            background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)',
                                            color: 'white',
                                            fontWeight: 600,
                                        }}
                                    />

                                    {/* Stats */}
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid size={{ xs:4 }}>
                                            <Paper elevation={0} sx={{ p: 2, background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)', borderRadius: 2 }}>
                                                <Typography variant="h6" fontWeight={700} color="primary">
                                                    {profileData.totalProjects}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Projects
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid size={{ xs:4 }}>
                                            <Paper elevation={0} sx={{ p: 2, bgcolor: '', borderRadius: 2 }}>
                                                <Typography variant="h6" fontWeight={700} color="success.main">
                                                    {profileData.completedProjects}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Completed
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid size={{ xs:4 }}>
                                            <Paper elevation={0} sx={{ p: 2, background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)', borderRadius: 2 }}>
                                                <Typography variant="h6" fontWeight={700} color="warning.main">
                                                    {profileData.credits}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Credits
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {/* Progress */}
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Level Progress
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600} color="primary">
                                                75%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={75}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: theme.palette.grey[200],
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4,
                                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                                }
                                            }}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                            125 XP to next level
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Quick Info */}
                                    <List dense>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Email color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={profileData.email}
                                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Phone color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={profileData.phone}
                                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <LocationOn color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={profileData.location}
                                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Cake color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`Joined ${profileData.joinDate}`}
                                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                                            />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Zoom>
                    </Grid>

                    <Grid size={{ xs:12, md:8 }}>
                        <Fade in timeout={800}>
                            <Card
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: theme.shadows[10],
                                }}
                            >
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        value={activeTab}
                                        onChange={handleTabChange}
                                        variant="fullWidth"
                                        sx={{
                                            '& .MuiTab-root': {
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                py: 2,
                                            }
                                        }}
                                    >
                                        <Tab icon={<Edit />} iconPosition="start" label="Edit Profile" />
                                        <Tab icon={<Settings />} iconPosition="start" label="Settings" />
                                        <Tab icon={<EmojiEvents />} iconPosition="start" label="Achievements" />
                                    </Tabs>
                                </Box>

                                <CardContent sx={{ p: 4 }}>
                                    {activeTab === 0 && (
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                                <Typography variant="h5" fontWeight={700}>
                                                    Profile Information
                                                </Typography>
                                                {!editMode ? (
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<Edit />}
                                                        onClick={() => setEditMode(true)}
                                                        sx={{
                                                            color: '#fff',
                                                            background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)',
                                                        }}
                                                    >
                                                        Edit Profile
                                                    </Button>
                                                ) : (
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Cancel />}
                                                            onClick={handleCancelEdit}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<Save />}
                                                            onClick={handleSaveProfile}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)',
                                                            }}
                                                        >
                                                            Save Changes
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>

                                            <Grid container spacing={3}>
                                                <Grid size={{ xs:12, sm:6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="First Name"
                                                        value={profileData.firstName}
                                                        onChange={handleInputChange('firstName')}
                                                        disabled={!editMode}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs:12, sm:6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Last Name"
                                                        value={profileData.lastName}
                                                        onChange={handleInputChange('lastName')}
                                                        disabled={!editMode}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs:12 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Email"
                                                        type="email"
                                                        value={profileData.email}
                                                        onChange={handleInputChange('email')}
                                                        disabled={!editMode}
                                                        InputProps={{
                                                            startAdornment: <Email color="action" sx={{ mr: 1 }} />
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs:12, sm:6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Phone"
                                                        value={profileData.phone}
                                                        onChange={handleInputChange('phone')}
                                                        disabled={!editMode}
                                                        InputProps={{
                                                            startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs:12, sm:6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Location"
                                                        value={profileData.location}
                                                        onChange={handleInputChange('location')}
                                                        disabled={!editMode}
                                                        InputProps={{
                                                            startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs:12, sm:6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Company"
                                                        value={profileData.company}
                                                        onChange={handleInputChange('company')}
                                                        disabled={!editMode}
                                                        InputProps={{
                                                            startAdornment: <Business color="action" sx={{ mr: 1 }} />
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs:12, sm:6 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Website"
                                                        value={profileData.website}
                                                        onChange={handleInputChange('website')}
                                                        disabled={!editMode}
                                                        InputProps={{
                                                            startAdornment: <Language color="action" sx={{ mr: 1 }} />
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs:12 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Bio"
                                                        value={profileData.bio}
                                                        onChange={handleInputChange('bio')}
                                                        disabled={!editMode}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Divider sx={{ my: 4 }} />

                                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                                Recent Activity
                                            </Typography>
                                            <List>
                                                {activityLog.map((activity, index) => (
                                                    <ListItem key={index} sx={{ px: 0 }}>
                                                        <ListItemIcon>{activity.icon}</ListItemIcon>
                                                        <ListItemText
                                                            primary={activity.action}
                                                            secondary={activity.time}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}

                                    {/* Tab 1: Settings */}
                                    {activeTab === 1 && (
                                        <Box>
                                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                                Account Settings
                                            </Typography>

                                            <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)', borderRadius: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Notifications color="primary" sx={{ mr: 2 }} />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        Notifications
                                                    </Typography>
                                                </Box>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={settings.emailNotifications}
                                                            onChange={handleSettingToggle('emailNotifications')}
                                                        />
                                                    }
                                                    label="Email Notifications"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={settings.projectUpdates}
                                                            onChange={handleSettingToggle('projectUpdates')}
                                                        />
                                                    }
                                                    label="Project Updates"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={settings.marketingEmails}
                                                            onChange={handleSettingToggle('marketingEmails')}
                                                        />
                                                    }
                                                    label="Marketing Emails"
                                                />
                                            </Paper>

                                            <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)', borderRadius: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Security color="primary" sx={{ mr: 2 }} />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        Security
                                                    </Typography>
                                                </Box>
                                                <Button variant="outlined" sx={{ mr: 2, mb: 2 }}>
                                                    Change Password
                                                </Button>
                                                <Button variant="outlined" sx={{ mb: 2 }}>
                                                    Enable 2FA
                                                </Button>
                                            </Paper>

                                            <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)', borderRadius: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Palette color="primary" sx={{ mr: 2 }} />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        Appearance
                                                    </Typography>
                                                </Box>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={settings.darkMode}
                                                            onChange={handleSettingToggle('darkMode')}
                                                        />
                                                    }
                                                    label="Dark Mode"
                                                />
                                            </Paper>

                                            <Alert severity="warning" sx={{ mb: 2 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    Danger Zone
                                                </Typography>
                                            </Alert>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<Delete />}
                                            >
                                                Delete Account
                                            </Button>
                                        </Box>
                                    )}

                                    {/* Tab 2: Achievements */}
                                    {activeTab === 2 && (
                                        <Box>
                                            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                                Your Achievements
                                            </Typography>

                                            <Grid container spacing={3}>
                                                {achievements.map((achievement, index) => (
                                                    <Grid size={{ xs:12, sm:6 }} key={index}>
                                                        <Zoom in timeout={600 + index * 100}>
                                                            <Paper
                                                                elevation={2}
                                                                sx={{
                                                                    p: 3,
                                                                    borderRadius: 3,
                                                                    textAlign: 'center',
                                                                    transition: 'all 0.3s ease',
                                                                    '&:hover': {
                                                                        transform: 'translateY(-8px)',
                                                                        boxShadow: theme.shadows[8],
                                                                    }
                                                                }}
                                                            >
                                                                <Box sx={{ mb: 2 }}>
                                                                    {achievement.icon}
                                                                </Box>
                                                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                                                    {achievement.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {achievement.desc}
                                                                </Typography>
                                                            </Paper>
                                                        </Zoom>
                                                    </Grid>
                                                ))}
                                            </Grid>

                                            <Box sx={{ mt: 4, p: 3, background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)', borderRadius: 3 }}>
                                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                                    Next Achievement
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Complete 5 more projects to unlock "Power User" badge
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={60}
                                                    sx={{
                                                        mt: 2,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 4,
                                                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                                        }
                                                    }}
                                                />
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                    3 of 5 projects completed
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={avatarDialog} onClose={() => setAvatarDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Profile Picture</DialogTitle>
                <DialogContent>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Button
                            variant="contained"
                            startIcon={<CloudUpload />}
                            sx={{
                                background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)',
                                px: 4,
                                py: 1.5,
                            }}
                        >
                            Choose File
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                            Supported formats: JPG, PNG (Max 5MB)
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAvatarDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => {
                        setAvatarDialog(false);
                        setSnackbar({ open: true, message: 'Profile picture updated!', severity: 'success' });
                    }}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfilePage;