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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'cliente',
  });

  const carregarUsuarios = async () => {
    try {
      const response = await axios.get('/api/usuarios', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setEditando(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      tipo: 'cliente',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditando(null);
  };

  const handleEdit = (usuario) => {
    setEditando(usuario._id);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      tipo: usuario.tipo,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`/api/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        carregarUsuarios();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
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
        await axios.put(`/api/usuarios/${editando}`, formData, config);
      } else {
        await axios.post('/api/usuarios', formData, config);
      }

      handleClose();
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Usuários</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Novo Usuário
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario._id}>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.tipo}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(usuario)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(usuario._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editando ? 'Editar' : 'Novo'} Usuário</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              margin="normal"
              required={!editando}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.tipo}
                label="Tipo"
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="funcionario">Funcionário</MenuItem>
                <MenuItem value="cliente">Cliente</MenuItem>
              </Select>
            </FormControl>
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