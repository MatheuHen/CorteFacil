import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../config/axios';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'cliente',
    telefone: ''
  });
  const [errors, setErrors] = useState({});

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/usuarios');
      if (!response.data.erro) {
        setUsuarios(response.data.usuarios || []);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showSnackbar('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleClickOpen = () => {
    setOpen(true);
    setEditando(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      tipo: 'cliente',
      telefone: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    setEditando(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!editando && !formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (!editando && formData.senha.length < 6) {
      newErrors.senha = 'A senha deve ter no mínimo 6 caracteres';
    }
    
    if (formData.telefone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido. Use o formato (99) 99999-9999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (usuario) => {
    setEditando(usuario._id);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      tipo: usuario.tipo,
      telefone: usuario.telefone || ''
    });
    setErrors({});
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        setLoading(true);
        await api.delete(`/api/usuarios/${id}`);
        showSnackbar('Usuário excluído com sucesso', 'success');
        carregarUsuarios();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showSnackbar('Erro ao excluir usuário', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (editando) {
        await api.put(`/api/usuarios/${editando}`, formData);
        showSnackbar('Usuário atualizado com sucesso');
      } else {
        await api.post('/api/usuarios', formData);
        showSnackbar('Usuário criado com sucesso');
      }

      handleClose();
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      showSnackbar(
        error.response?.data?.mensagem || 'Erro ao salvar usuário',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      setFormData({ ...formData, telefone: value });
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
          disabled={loading}
        >
          Novo Usuário
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario._id}>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.tipo}</TableCell>
                <TableCell>{usuario.telefone}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(usuario)} disabled={loading}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(usuario._id)} disabled={loading}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {usuarios.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum usuário cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editando ? 'Editar' : 'Novo'} Usuário</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              margin="normal"
              error={!!errors.nome}
              helperText={errors.nome}
              disabled={loading}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              required
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              margin="normal"
              error={!!errors.senha}
              helperText={errors.senha}
              disabled={loading}
              required={!editando}
            />
            <TextField
              fullWidth
              label="Telefone"
              value={formData.telefone}
              onChange={handlePhoneChange}
              margin="normal"
              error={!!errors.telefone}
              helperText={errors.telefone || 'Formato: (99) 99999-9999'}
              disabled={loading}
              inputProps={{ maxLength: 15 }}
            />
            <FormControl fullWidth margin="normal" disabled={loading}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.tipo}
                label="Tipo"
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="barbeiro">Barbeiro</MenuItem>
                <MenuItem value="cliente">Cliente</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}