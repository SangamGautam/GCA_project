import { expect } from 'chai';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import server from '../server.js';

chai.use(chaiHttp);

describe('Server API Tests', () => {
    describe('CORS Configuration', () => {
        it('should allow requests from allowed origins', (done) => {
            supertest(server)
                .get('/api')
                .set('Origin', 'http://localhost:4200')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.header).to.have.property('access-control-allow-origin', 'http://localhost:4200');
                    done();
                });
        });

        it('should reject requests from disallowed origins', (done) => {
            supertest(server)
                .get('/api')
                .set('Origin', 'http://disallowed-origin.com')
                .end((err, res) => {
                    expect(res).to.have.status(200); // The route should still work but without CORS headers
                    expect(res.header).to.not.have.property('access-control-allow-origin');
                    done();
                });
        });
    });

    describe('Route Not Found (404)', () => {
        it('should return 404 for unknown routes', (done) => {
            supertest(server)
                .get('/unknown-route')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.text).to.equal("Sorry, that route doesn't exist.");
                    done();
                });
        });
    });

    describe('GET /', () => {
        it('should return a welcome message', (done) => {
            supertest(server)
                .get('/api')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Welcome to the API Server');
                    done();
                });
        });
    });

    describe('GET /students', () => {
        it('should get all students', (done) => {
            supertest(server)
                .get('/api/students')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('students').which.is.a('array');

                    // Check structure of first student object in the array
                    if (res.body.students.length > 0) {
                        const student = res.body.students[0];
                        expect(student).to.have.property('UniId');
                        expect(student).to.have.property('Student');
                        expect(student).to.have.property('StudyLevel');
                        // Add additional checks for other expected properties
                    }
                    done();
                });
        });

        it('should get students with specific filters', (done) => {
            supertest(server)
                .get('/api/students?studyLevel=1&studyMode=1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('students').which.is.a('array');

                    // Check structure of first student object in the array
                    if (res.body.students.length > 0) {
                        const student = res.body.students[0];
                        expect(student).to.have.property('UniId');
                        expect(student).to.have.property('Student');
                        expect(student).to.have.property('StudyLevel');
                        // Add additional checks for other expected properties
                    }
                    done();
                });
        });
    });

    describe('GET /students/:id', () => {
        it('should get a single student by id', (done) => {
            const studentId = 324031; // Adjust to a valid student ID for your test
            supertest(server)
                .get(`/api/students/${studentId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('student');

                    const student = res.body.student;
                    expect(student).to.have.property('UniId');
                    expect(student).to.have.property('Student');
                    expect(student).to.have.property('StudyLevel');
                    // Add additional checks for other expected properties

                    done();
                });
        });

        it('should return 404 for an invalid student id', (done) => {
            const invalidStudentId = 9999; // Adjust to an ID that does not exist
            supertest(server)
                .get(`/api/students/${invalidStudentId}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message').eql('Student not found');
                    done();
                });
        });
    });
});
