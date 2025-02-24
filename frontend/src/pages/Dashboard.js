import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { api } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [upcomingVisits, setUpcomingVisits] = useState([]);
  const [teamStats, setTeamStats] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent checkins
        const checkinsResponse = await api.get(`/api/users/${user.id}/checkins`);
        setRecentCheckins(checkinsResponse.data);

        // Fetch upcoming visits
        const visitsResponse = await api.get(`/api/visits/planned`);
        setUpcomingVisits(visitsResponse.data);

        // Fetch team stats for managers and above
        if (['MANAGER', 'EXECUTIVE', 'CEO'].includes(user.role)) {
          const teamStatsResponse = await api.get(`/api/visits/manager/stats`);
          setTeamStats(teamStatsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleCheckin = async () => {
    try {
      await api.post(`/api/users/${user.id}/checkin`);
      // Refresh checkins after new checkin
      const checkinsResponse = await api.get(`/api/users/${user.id}/checkins`);
      setRecentCheckins(checkinsResponse.data);
    } catch (error) {
      console.error('Error during checkin:', error);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5">
                Welcome back, {user.username}!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckin}
                sx={{ mt: 2 }}
              >
                Check In Now
              </Button>
            </Paper>
          </Grid>

          {/* Recent Checkins */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Check-ins
              </Typography>
              {recentCheckins.slice(0, 5).map((checkin) => (
                <Box key={checkin.id} sx={{ mb: 1 }}>
                  <Typography>
                    {new Date(checkin.checkinTime).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Upcoming Visits */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Visits
              </Typography>
              {upcomingVisits.slice(0, 5).map((visit) => (
                <Box key={visit.id} sx={{ mb: 1 }}>
                  <Typography>
                    {new Date(visit.plannedTime).toLocaleString()} - {visit.location.name}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Team Stats (Only for Managers and above) */}
          {teamStats && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Team Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">Total Team Members</Typography>
                    <Typography variant="h4">{teamStats.totalMembers}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">Today's Check-ins</Typography>
                    <Typography variant="h4">{teamStats.todayCheckins}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">Planned Visits</Typography>
                    <Typography variant="h4">{teamStats.plannedVisits}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
