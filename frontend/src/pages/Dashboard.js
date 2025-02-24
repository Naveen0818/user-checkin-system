import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import {
  getMonthlyCheckinStats,
  getPlannedVisits,
  getManagerPlannedVisits,
  getManagerCheckins,
} from '../services/api';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';

const Dashboard = () => {
  const { user } = useAuth();
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [plannedVisits, setPlannedVisits] = useState([]);
  const [managerData, setManagerData] = useState({ visits: [], checkins: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly stats for all users
        const stats = await getMonthlyCheckinStats(user.sub);
        setMonthlyStats(stats);

        // Fetch planned visits for all users
        const visits = await getPlannedVisits(user.sub);
        setPlannedVisits(visits);

        // If user is a manager, fetch additional data
        if (user.role === 'MANAGER' || user.role === 'EXECUTIVE') {
          const [managerVisits, managerCheckins] = await Promise.all([
            getManagerPlannedVisits(user.sub),
            getManagerCheckins(user.sub),
          ]);
          setManagerData({ visits: managerVisits, checkins: managerCheckins });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Monthly Check-in Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Monthly Check-in Statistics
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveBar
                data={monthlyStats}
                keys={['count']}
                indexBy="monthName"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Planned Visits */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Upcoming Planned Visits
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plannedVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      {new Date(visit.plannedTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{visit.purpose}</TableCell>
                    <TableCell>{visit.location.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Manager's View */}
        {(user.role === 'MANAGER' || user.role === 'EXECUTIVE') && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Team Overview
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Last Check-in</TableCell>
                    <TableCell>Next Planned Visit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {managerData.checkins.map((checkin) => {
                    const nextVisit = managerData.visits.find(
                      (v) => v.user.id === checkin.user.id
                    );
                    return (
                      <TableRow key={checkin.id}>
                        <TableCell>{`${checkin.user.firstName} ${checkin.user.lastName}`}</TableCell>
                        <TableCell>
                          {new Date(checkin.checkinTime).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {nextVisit
                            ? new Date(nextVisit.plannedTime).toLocaleDateString()
                            : 'No planned visits'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
