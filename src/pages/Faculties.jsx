import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { getFaculties, createFaculty } from '../api/faculties.js';

const initialForm = {
  name: '',
};

export default function Faculties() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function load() {
    setError('');
    setLoading(true);
    try {
      const res = await getFaculties();
      setList(Array.isArray(res) ? res : res?.faculties ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load faculties');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!form.name?.trim()) {
      setFormError('Faculty name is required');
      return;
    }
    setSubmitting(true);
    try {
      await createFaculty({ name: form.name.trim() });
      setForm(initialForm);
      await load();
    } catch (err) {
      setFormError(err.message || 'Failed to add faculty');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Faculties
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View and add faculties
            </p>
          </div>
        </div>

        {/* Add faculty form */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Add faculty
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {formError && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-3 py-2"
              >
                {formError}
              </div>
            )}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Faculty name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 transition"
            >
              {submitting ? 'Adding...' : 'Add faculty'}
            </button>
          </form>
        </div>

        {/* Faculty list */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Faculty list
            </h2>
          </div>
          {loading ? (
            <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
              Loading...
            </div>
          ) : error ? (
            <div className="px-6 py-8 text-center text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : list.length === 0 ? (
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
                  {list.map((f) => (
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
    </Layout>
  );
}
