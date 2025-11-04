const request = require('supertest');
const app = require('../app');
const Usuario = require('../models/usuario');

jest.mock('../models/usuario');

describe('Rutas de /api/usuarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/usuarios - crea un usuario correctamente', async () => {
    Usuario.findOne.mockResolvedValue(null);
    Usuario.create.mockResolvedValue({ id: 1, nombre: 'Juan', email: 'juan@mail.com', password: '123' });

    const res = await request(app)
      .post('/api/usuarios')
      .send({ nombre: 'Juan', email: 'juan@mail.com', password: '123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('juan@mail.com');
  });

  it('GET /api/usuarios - obtiene todos los usuarios', async () => {
    Usuario.findAll.mockResolvedValue([{ id: 1, nombre: 'Juan' }]);
    const res = await request(app).get('/api/usuarios');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('PUT /api/usuarios/:id - actualiza un usuario existente', async () => {
    const mockUsuario = { update: jest.fn(), id: 1 };
    Usuario.findByPk.mockResolvedValue(mockUsuario);

    const res = await request(app)
      .put('/api/usuarios/1')
      .send({ nombre: 'Carlos' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Usuario actualizado correctamente');
  });

  it('DELETE /api/usuarios/:id - elimina un usuario existente', async () => {
    const mockUsuario = { destroy: jest.fn(), id: 1 };
    Usuario.findByPk.mockResolvedValue(mockUsuario);

    const res = await request(app).delete('/api/usuarios/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Usuario eliminado correctamente');
  });
});
