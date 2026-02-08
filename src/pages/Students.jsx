import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { getStudents, createStudent } from '../api/students.js';
import { getGroups } from '../api/groups.js';
import { getSubjects } from '../api/subjects.js';
import { getAttendance, createAttendance } from '../api/attendance.js';

const initialStudentForm = {
  first_name: '',
  last_name: '',
  gender: '',
  birth_date: '',
  group_id: '',
};

const initialAttendanceForm = {
  student_id: '',
  subject_id: '',
  visit_day: '',
  visited: true,
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [attendanceForm, setAttendanceForm] = useState(initialAttendanceForm);

  const [submitting, setSubmitting] = useState({ student: false, attendance: false });
  const [formErrors, setFormErrors] = useState({ student: '', attendance: '' });

  async function load() {
    setError('');
    setLoading(true);
    try {
      const [studentsRes, groupsRes, subjectsRes, attendanceRes] = await Promise.all([
        getStudents(),
        getGroups(),
        getSubjects(),
        getAttendance(),
      ]);
      setStudents(Array.isArray(studentsRes) ? studentsRes : studentsRes?.students ?? []);
      setGroups(Array.isArray(groupsRes) ? groupsRes : groupsRes?.groups ?? []);
      setSubjects(Array.isArray(subjectsRes) ? subjectsRes : subjectsRes?.subjects ?? []);
      setAttendance(Array.isArray(attendanceRes) ? attendanceRes : attendanceRes?.attendance ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Student handlers
  function handleStudentChange(e) {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, student: '' }));
  }

  async function handleStudentSubmit(e) {
    e.preventDefault();
    setFormErrors((prev) => ({ ...prev, student: '' }));
    const groupId = studentForm.group_id ? Number(studentForm.group_id) : 0;
    if (!studentForm.first_name?.trim() || !studentForm.last_name?.trim()) {
      setFormErrors((prev) => ({ ...prev, student: 'First name and last name are required' }));
      return;
    }
    setSubmitting((prev) => ({ ...prev, student: true }));
    try {
      const payload = {
        first_name: studentForm.first_name.trim(),
        last_name: studentForm.last_name.trim(),
        group_id: groupId,
      };
      if (studentForm.gender.trim()) payload.gender = studentForm.gender.trim();
      if (studentForm.birth_date && studentForm.birth_date.trim()) {
        payload.birth_date = studentForm.birth_date.trim();
      }
      await createStudent(payload);
      setStudentForm(initialStudentForm);
      await load();
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, student: err.message || 'Failed to add student' }));
    } finally {
      setSubmitting((prev) => ({ ...prev, student: false }));
    }
  }

  // Attendance handlers
  function handleAttendanceChange(e) {
    const { name, value, type, checked } = e.target;
    setAttendanceForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, attendance: '' }));
  }

  async function handleAttendanceSubmit(e) {
    e.preventDefault();
    setFormErrors((prev) => ({ ...prev, attendance: '' }));
    if (!attendanceForm.student_id) {
      setFormErrors((prev) => ({ ...prev, attendance: 'Student is required' }));
      return;
    }
    if (!attendanceForm.subject_id) {
      setFormErrors((prev) => ({ ...prev, attendance: 'Subject is required' }));
      return;
    }
    if (!attendanceForm.visit_day?.trim()) {
      setFormErrors((prev) => ({ ...prev, attendance: 'Visit day is required' }));
      return;
    }
    setSubmitting((prev) => ({ ...prev, attendance: true }));
    try {
      await createAttendance({
        student_id: Number(attendanceForm.student_id),
        subject_id: Number(attendanceForm.subject_id),
        visit_day: attendanceForm.visit_day.trim(),
        visited: attendanceForm.visited,
      });
      setAttendanceForm(initialAttendanceForm);
      await load();
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        attendance: err.message || 'Failed to add attendance record',
      }));
    } finally {
      setSubmitting((prev) => ({ ...prev, attendance: false }));
    }
  }

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : '—';
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : '—';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-slate-500 dark:text-slate-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Students & Attendance
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage students and track attendance
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {/* Students Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Students</h2>

          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Add student
              </h3>
            </div>
            <form onSubmit={handleStudentSubmit} className="p-6 space-y-4">
              {formErrors.student && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-3 py-2"
                >
                  {formErrors.student}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    First name *
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={studentForm.first_name}
                    onChange={handleStudentChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Last name *
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={studentForm.last_name}
                    onChange={handleStudentChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Gender
                  </label>
                  <input
                    id="gender"
                    name="gender"
                    type="text"
                    value={studentForm.gender}
                    onChange={handleStudentChange}
                    placeholder="e.g. Male, Female"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="birth_date"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Birth date
                  </label>
                  <input
                    id="birth_date"
                    name="birth_date"
                    type="date"
                    value={studentForm.birth_date}
                    onChange={handleStudentChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="group_id"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Group
                </label>
                <select
                  id="group_id"
                  name="group_id"
                  value={studentForm.group_id}
                  onChange={handleStudentChange}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">— Select group —</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting.student}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 transition"
              >
                {submitting.student ? 'Adding...' : 'Add student'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Student list
              </h3>
            </div>
            {students.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No students yet. Add one above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Group
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {students.map((s) => (
                      <tr
                        key={s.id}
                        className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {s.first_name} {s.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {s.group_name ?? '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {s.email ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Attendance</h2>

          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Add attendance record
              </h3>
            </div>
            <form onSubmit={handleAttendanceSubmit} className="p-6 space-y-4">
              {formErrors.attendance && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-3 py-2"
                >
                  {formErrors.attendance}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="student_id"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Student *
                  </label>
                  <select
                    id="student_id"
                    name="student_id"
                    required
                    value={attendanceForm.student_id}
                    onChange={handleAttendanceChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">— Select student —</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.first_name} {s.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="subject_id"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject_id"
                    name="subject_id"
                    required
                    value={attendanceForm.subject_id}
                    onChange={handleAttendanceChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">— Select subject —</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="visit_day"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Visit day *
                  </label>
                  <input
                    id="visit_day"
                    name="visit_day"
                    type="date"
                    required
                    value={attendanceForm.visit_day}
                    onChange={handleAttendanceChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    id="visited"
                    name="visited"
                    type="checkbox"
                    checked={attendanceForm.visited}
                    onChange={handleAttendanceChange}
                    className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="visited"
                    className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Attended
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={submitting.attendance}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 transition"
                >
                  {submitting.attendance ? 'Adding...' : 'Add record'}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Attendance records
              </h3>
            </div>
            {attendance.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No attendance records yet. Add one above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {attendance.map((a) => (
                      <tr
                        key={a.id}
                        className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">
                          {getStudentName(a.student_id)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {getSubjectName(a.subject_id)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {a.visit_day}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              a.visited
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            }`}
                          >
                            {a.visited ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
