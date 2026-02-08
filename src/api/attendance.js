import { api } from './client.js';

export function getAttendance() {
  return api.get('/attendance');
}

export function getAttendanceByID(id) {
  return api.get(`/attendance/${id}`);
}

export function getAttendanceByStudent(studentId) {
  return api.get(`/attendance/student/${studentId}`);
}

export function getAttendanceBySubject(subjectId) {
  return api.get(`/attendance/subject/${subjectId}`);
}

export function createAttendance(data) {
  return api.post('/attendance', data);
}

export function updateAttendance(id, data) {
  return api.patch(`/attendance/${id}`, data);
}

export function deleteAttendance(id) {
  return api.delete(`/attendance/${id}`);
}
