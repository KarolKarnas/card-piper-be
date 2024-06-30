import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { SignupDto } from '../src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let database: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(3333);

    database = app.get(DatabaseService);
    await database.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Auth', () => {
    const dto: SignupDto = {
      email: 'karol@user.com',
      password: '123',
    };
    const adminDto: SignupDto = {
      email: 'admin@admin.com',
      password: 'admin',
    };

    const signIn = async (dto) => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: dto.email,
          password: dto.password,
        });

      return response.body.access_token;
    };

    describe('Signup', () => {
      it('should throw an 400 Bad Request error if email is empty', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            password: dto.password,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(response.body.message[0]).toContain('email should not be empty');
        expect(response.body.message[1]).toContain('email must be an email');
      });
      it('should throw an 400 Bad Request error if password is empty', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: dto.email,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(response.body.message[0]).toContain(
          'password should not be empty',
        );
        expect(response.body.message[1]).toContain('password must be a string');
      });
      it('should throw an 400 Bad Request error if body not provided', () => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .expect(400)
          .expect('Content-Type', /application\/json/);
      });
      it('should signup with correct credentials and receive access token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: dto.email,
            password: dto.password,
          })
          .expect(201)
          .expect('Content-Type', /application\/json/);

        expect(response.body).toHaveProperty('access_token');
        expect(typeof response.body.access_token).toBe('string');
      });
    });
    describe('Signin', () => {
      it('should throw an 400 Bad Request error if email is empty', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            password: dto.password,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(response.body.message[0]).toContain('email should not be empty');
        expect(response.body.message[1]).toContain('email must be an email');
      });
      it('should throw an 400 Bad Request error if password is empty', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: dto.email,
          })
          .expect(400)
          .expect('Content-Type', /application\/json/);

        expect(response.body.message[0]).toContain(
          'password should not be empty',
        );
        expect(response.body.message[1]).toContain('password must be a string');
      });
      it('should throw an 400 Bad Request error if body not provided', () => {
        request(app.getHttpServer())
          .post('/auth/signin')
          .expect(400)
          .expect('Content-Type', /application\/json/);
      });
      it('should signup with correct credentials and receive access token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: dto.email,
            password: dto.password,
          })
          .expect(200)
          .expect('Content-Type', /application\/json/);

        expect(response.body).toHaveProperty('access_token');
        expect(typeof response.body.access_token).toBe('string');
      });
    });

    describe('as Admin', () => {
      it('should be able', async () => {
        const token = await signIn(adminDto);

        const response = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        expect(response.body.length).toBe(2);
      });
    });

    describe('as User', () => {
      it('should throw an 401 Error', async () => {
        const token = await signIn(dto);

        await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect(401)
          .expect('Content-Type', /application\/json/);
      });
    });
  });

  // describe('User', () => {
  //   describe('Get me', () => {});
  //   describe('Edit me', () => {});
  // });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
// import { DatabaseService } from '../src/database/database.service';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;
//   let database: DatabaseService;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();

//     await app.init();
//     database = app.get(DatabaseService);
//     await database.cleanDb();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });
