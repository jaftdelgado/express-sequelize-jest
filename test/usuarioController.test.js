const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios');
const Usuario = require('../models/usuario');

jest.mock('../models/usuario');

const app = express();
app.use(bodyParser.json());
app.post('/usuarios', crearUsuario);
app.get('/usuarios', obtenerUsuarios);
app.put('/usuarios/:id', actualizarUsuario);
app.delete('/usuarios/:id', eliminarUsuario);

describe('Controlador de Usuario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /usuarios', () => {
    it('debe crear un usuario correctamente', async () => {
      Usuario.findOne.mockResolvedValue(null);
      Usuario.create.mockResolvedValue({ id: 1, nombre: 'Juan', email: 'juan@mail.com', password: '123' });

      const res = await request(app)
        .post('/usuarios')
        .send({ nombre: 'Juan', email: 'juan@mail.com', password: '123' });

      expect(res.statusCode).toBe(201);
      expect(res.body.email).toBe('juan@mail.com');
    });

    it('debe devolver error si faltan campos', async () => {
      const res = await request(app)
        .post('/usuarios')
        .send({ nombre: 'Juan' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Todos los campos son obligatorios');
    });

    it('debe devolver error si el correo ya existe', async () => {
      Usuario.findOne.mockResolvedValue({ id: 1, email: 'juan@mail.com' });

      const res = await request(app)
        .post('/usuarios')
        .send({ nombre: 'Juan', email: 'juan@mail.com', password: '123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('El correo ya está registrado');
    });
  });

  describe('GET /usuarios', () => {
    it('debe obtener todos los usuarios', async () => {
      Usuario.findAll.mockResolvedValue([
        { id: 1, nombre: 'Juan' },
        { id: 2, nombre: 'Ana' }
      ]);

      const res = await request(app).get('/usuarios');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('PUT /usuarios/:id', () => {
    it('debe actualizar un usuario existente', async () => {
      const mockUsuario = { update: jest.fn(), id: 1, nombre: 'Juan' };
      Usuario.findByPk.mockResolvedValue(mockUsuario);

      const res = await request(app)
        .put('/usuarios/1')
        .send({ nombre: 'Carlos' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Usuario actualizado correctamente');
      expect(mockUsuario.update).toHaveBeenCalledWith({ nombre: 'Carlos', email: undefined, password: undefined });
    });

    it('debe devolver error si el usuario no existe', async () => {
      Usuario.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put('/usuarios/1')
        .send({ nombre: 'Carlos' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Usuario no encontrado');
    });

    it('debe devolver error si no se envía ningún campo', async () => {
      const mockUsuario = { update: jest.fn(), id: 1 };
      Usuario.findByPk.mockResolvedValue(mockUsuario);

      const res = await request(app)
        .put('/usuarios/1')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Debe proporcionar al menos un campo para actualizar');
    });
  });

  describe('DELETE /usuarios/:id', () => {
    it('debe eliminar un usuario existente', async () => {
      const mockUsuario = { destroy: jest.fn(), id: 1 };
      Usuario.findByPk.mockResolvedValue(mockUsuario);

      const res = await request(app).delete('/usuarios/1');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Usuario eliminado correctamente');
    });

    it('debe devolver error si el usuario no existe', async () => {
      Usuario.findByPk.mockResolvedValue(null);

      const res = await request(app).delete('/usuarios/1');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Usuario no encontrado');
    });
  });
});
