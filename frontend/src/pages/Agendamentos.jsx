import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    data: '',
    horario: '',
    servico: '',
  });

  const carregarAgendamentos = async () => {
    try {
      const response = await axios.get('/api/agendamentos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAgendamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setEditando(null);
    setFormData({
      cliente: '',
      data: '',
      horario: '',
      servico: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditando(null);
  };

  const handleEdit = (agendamento) => {
    setEditando(agendamento._id);
    setFormData({
      cliente: agendamento.cliente,
      data: format(new Date(agendamento.data), 'yyyy-MM-dd'),
      horario: agendamento.horario,
      servico: agendamento.servico,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await axios.delete(`/api/agendamentos/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        carregarAgendamentos();
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      };

      if (editando) {
        await axios.put(`/api/agendamentos/${editando}`, formData, config);
      } else {
        await axios.post('/api/agendamentos', formData, config);
      }

      handleClose();
      carregarAgendamentos();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Agendamentos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Novo Agendamento
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Serviço</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendamentos.map((agendamento) => (
              <TableRow key={agendamento._id}>
                <TableCell>{agendamento.cliente}</TableCell>
                <TableCell>
                  {format(new Date(agendamento.data), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{agendamento.horario}</TableCell>
                <TableCell>{agendamento.servico}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(agendamento)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(agendamento._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editando ? 'Editar' : 'Novo'} Agendamento</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Cliente"
              value={formData.cliente}
              onChange={(e) =>
                setFormData({ ...formData, cliente: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="date"
              label="Data"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="time"
              label="Horário"
              value={formData.horario}
              onChange={(e) =>
                setFormData({ ...formData, horario: e.target.value })
              }
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Serviço"
              value={formData.servico}
              onChange={(e) =>
                setFormData({ ...formData, servico: e.target.value })
              }
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 