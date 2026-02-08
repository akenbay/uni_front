import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { getFaculties, createFaculty } from '../api/faculties.js';
import { getGroups, createGroup } from '../api/groups.js';
import { getSubjects, createSubject } from '../api/subjects.js';

const initialFacultyForm = { name: '' };
const initialGroupForm = { name: '', faculty_id: '' };
const initialSubjectForm = { name: '' };

export default function Structure() {
  const [faculties, setFaculties] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [facultyForm, setFacultyForm] = useState(initialFacultyForm);
  const [groupForm, setGroupForm] = useState(initialGroupForm);
  const [subjectForm, setSubjectForm] = useState(initialSubjectForm);

  const [submitting, setSubmitting] = useState({ faculty: false, group: false, subject: false });
  const [formErrors, setFormErrors] = useState({ faculty: '', group: '', subject: '' });

  async function load() {
    setError('');
    setLoading(true);
    try {
      const [facultiesRes, groupsRes, subjectsRes] = await Promise.all([
        getFaculties(),
        getGroups(),
        getSubjects(),
      ]);
      setFaculties(Array.isArray(facultiesRes) ? facultiesRes : facultiesRes?.faculties ?? []);
      setGroups(Array.isArray(groupsRes) ? groupsRes : groupsRes?.groups ?? []);
      setSubjects(Array.isArray(subjectsRes) ? subjectsRes : subjectsRes?.subjects ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Faculty handlers
  function handleFacultyChange(e) {
    const { name, value } = e.target;
    setFacultyForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, faculty: '' }));
  }

  async function handleFacultySubmit(e) {
    e.preventDefault();
    setFormErrors((prev) => ({ ...prev, faculty: '' }));
    if (!facultyForm.name?.trim()) {
      setFormErrors((prev) => ({ ...prev, faculty: 'Faculty name is required' }));
      return;
    }
    setSubmitting((prev) => ({ ...prev, faculty: true }));
    try {
      await createFaculty({ name: facultyForm.name.trim() });
      setFacultyForm(initialFacultyForm);
      await load();
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, faculty: err.message || 'Failed to add faculty' }));
    } finally {
      setSubmitting((prev) => ({ ...prev, faculty: false }));
    }
  }

  // Group handlers
  function handleGroupChange(e) {
    const { name, value } = e.target;
    setGroupForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, group: '' }));
  }

  async function handleGroupSubmit(e) {
    e.preventDefault();
    setFormErrors((prev) => ({ ...prev, group: '' }));
    if (!groupForm.name?.trim()) {
      setFormErrors((prev) => ({ ...prev, group: 'Group name is required' }));
      return;
    }
    if (!groupForm.faculty_id) {
      setFormErrors((prev) => ({ ...prev, group: 'Faculty is required' }));
      return;
    }
    setSubmitting((prev) => ({ ...prev, group: true }));
    try {
      await createGroup({
        name: groupForm.name.trim(),
        faculty_id: Number(groupForm.faculty_id),
      });
      setGroupForm(initialGroupForm);
      await load();
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, group: err.message || 'Failed to add group' }));
    } finally {
      setSubmitting((prev) => ({ ...prev, group: false }));
    }
  }

  // Subject handlers
  function handleSubjectChange(e) {
    const { name, value } = e.target;
    setSubjectForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, subject: '' }));
  }

  async function handleSubjectSubmit(e) {
    e.preventDefault();
    setFormErrors((prev) => ({ ...prev, subject: '' }));
    if (!subjectForm.name?.trim()) {
      setFormErrors((prev) => ({ ...prev, subject: 'Subject name is required' }));
      return;
    }
    setSubmitting((prev) => ({ ...prev, subject: true }));
    try {
      await createSubject({ name: subjectForm.name.trim() });
      setSubjectForm(initialSubjectForm);
      await load();
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, subject: err.message || 'Failed to add subject' }));
    } finally {
      setSubmitting((prev) => ({ ...prev, subject: false }));
    }
  }

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
              Academic Structure
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage faculties, groups, and subjects
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {/* Faculties Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Faculties</h2>
          
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Add faculty
              </h3>
            </div>
            <form onSubmit={handleFacultySubmit} className="p-6 space-y-4">
              {formErrors.faculty && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-3 py-2"
                >
                  {formErrors.faculty}
                </div>
              )}
              <div className="flex gap-3">
                <input
                  name="name"
                  type="text"
                  required
                  value={facultyForm.name}
                  onChange={handleFacultyChange}
                  placeholder="Faculty name (e.g. Computer Science)"
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={submitting.faculty}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-6 transition whitespace-nowrap"
                >
                  {submitting.faculty ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Faculty list
              </h3>
            </div>
            {faculties.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No faculties yet. Add one above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {faculties.map((f) => (
                      <tr
                        key={f.id}
                        className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {f.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">
                          {f.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Groups Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Groups</h2>
          
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Add group
              </h3>
            </div>
            <form onSubmit={handleGroupSubmit} className="p-6 space-y-4">
              {formErrors.group && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-3 py-2"
                >
                  {formErrors.group}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-3">
                <input
                  name="name"
                  type="text"
                  required
                  value={groupForm.name}
                  onChange={handleGroupChange}
                  placeholder="Group name (e.g. CS-101)"
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  name="faculty_id"
                  required
                  value={groupForm.faculty_id}
                  onChange={handleGroupChange}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">— Select faculty —</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={submitting.group}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-6 transition whitespace-nowrap"
                >
                  {submitting.group ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Group list
              </h3>
            </div>
            {groups.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No groups yet. Add one above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Faculty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {groups.map((g) => (
                      <tr
                        key={g.id}
                        className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {g.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">
                          {g.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {g.faculty_name ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Subjects Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Subjects</h2>
          
          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Add subject
              </h3>
            </div>
            <form onSubmit={handleSubjectSubmit} className="p-6 space-y-4">
              {formErrors.subject && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-3 py-2"
                >
                  {formErrors.subject}
                </div>
              )}
              <div className="flex gap-3">
                <input
                  name="name"
                  type="text"
                  required
                  value={subjectForm.name}
                  onChange={handleSubjectChange}
                  placeholder="Subject name (e.g. Data Structures)"
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={submitting.subject}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-6 transition whitespace-nowrap"
                >
                  {submitting.subject ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Subject list
              </h3>
            </div>
            {subjects.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No subjects yet. Add one above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {subjects.map((s) => (
                      <tr
                        key={s.id}
                        className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {s.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">
                          {s.name}
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
