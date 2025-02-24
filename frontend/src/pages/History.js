import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, TablePagination } from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { api } from '../services/api';

const History = () => {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        const response = await api.get(`/api/users/${user.id}/checkins`);
        setCheckins(response.data);
      } catch (error) {
        console.error('Error fetching checkins:', error);
      }
    };

    fetchCheckins();
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Check-in History
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkins
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((checkin) => (
                  <TableRow key={checkin.id}>
                    <TableCell>
                      {new Date(checkin.checkinTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{checkin.location?.name || 'N/A'}</TableCell>
                    <TableCell>{checkin.status || 'Completed'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={checkins.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default History;
