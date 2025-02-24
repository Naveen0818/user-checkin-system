import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { api } from '../services/api';

const Team = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [team, setTeam] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  useEffect(() => {
    fetchTeamData();
  }, [user]);

  const fetchTeamData = async () => {
    try {
      const [teamResponse, checkinsResponse] = await Promise.all([
        api.get(`/api/manager/users?managerId=${user.id}`),
        api.get(`/api/manager/team?managerId=${user.id}`),
      ]);
      setTeam(teamResponse.data);
      setCheckins(checkinsResponse.data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleAddUser = async () => {
    try {
      await api.post(`/api/manager/users?managerId=${user.id}`, newUser);
      setOpenDialog(false);
      setNewUser({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
      });
      fetchTeamData();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Team Management</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
            >
              Add Team Member
            </Button>
          </Box>

          <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Team Members" />
            <Tab label="Recent Check-ins" />
          </Tabs>

          {tab === 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {team
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.firstName} {member.lastName}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.username}</TableCell>
                      <TableCell>{member.role}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}

          {tab === 1 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
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
                        {checkin.user.firstName} {checkin.user.lastName}
                      </TableCell>
                      <TableCell>
                        {new Date(checkin.checkinTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{checkin.location?.name || 'N/A'}</TableCell>
                      <TableCell>{checkin.status || 'Completed'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tab === 0 ? team.length : checkins.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Team Member</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Username"
              fullWidth
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              margin="dense"
              label="First Name"
              fullWidth
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Last Name"
              fullWidth
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAddUser} variant="contained" color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default Team;
