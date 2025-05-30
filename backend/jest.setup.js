jest.setTimeout(30000); // aumenta o timeout para 30 segundos

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret'; 