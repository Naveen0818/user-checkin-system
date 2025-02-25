import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import apiClient from '../utils/apiClient';

const Dashboard = () => {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [checkInsData, visitsData] = await Promise.all([
          apiClient.getUserCheckIns(user.id),
          apiClient.getUserVisits(user.id)
        ]);
        
        setCheckIns(checkInsData.data);
        setVisits(visitsData.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleCheckIn = async () => {
    try {
      const response = await apiClient.createCheckIn({
        userId: user.id,
        locationId: user.locationId,
        status: 'CHECKED_IN'
      });
      
      setCheckIns(prevCheckIns => [response.data, ...prevCheckIns]);
    } catch (err) {
      setError('Failed to check in');
      console.error('Check-in error:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.firstName}!
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckIn}
          sx={{ mb: 4 }}
        >
          Check In
        </Button>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {/* Recent Check-ins */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Check-ins
                </Typography>
                {checkIns.length > 0 ? (
                  checkIns.slice(0, 5).map((checkIn) => (
                    <Box key={checkIn.id} sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        {new Date(checkIn.timestamp).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Status: {checkIn.status}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography>No recent check-ins</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Visits */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Visits
                </Typography>
                {visits.length > 0 ? (
                  visits.slice(0, 5).map((visit) => (
                    <Box key={visit.id} sx={{ mb: 2 }}>
                      <Typography variant="body1">
                        {new Date(visit.scheduledTime).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Status: {visit.status}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography>No upcoming visits</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
