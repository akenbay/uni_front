import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: 'medium',
    });
  } catch {
    return iso;
  }
}

export default function Me() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              My profile
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your account details
            </p>
          </div>
          <dl className="divide-y divide-slate-200 dark:divide-slate-700">
            <div className="px-6 py-4 flex flex-wrap gap-2 sm:gap-4">
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0">
                ID
              </dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">
                {user.id}
              </dd>
            </div>
            <div className="px-6 py-4 flex flex-wrap gap-2 sm:gap-4">
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0">
                Email
              </dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">
                {user.email}
              </dd>
            </div>
            <div className="px-6 py-4 flex flex-wrap gap-2 sm:gap-4">
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0">
                Active
              </dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">
                {user.is_active ? 'Yes' : 'No'}
              </dd>
            </div>
            <div className="px-6 py-4 flex flex-wrap gap-2 sm:gap-4">
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0">
                Created
              </dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">
                {formatDate(user.created_at)}
              </dd>
            </div>
            {Array.isArray(user.roles) && user.roles.length > 0 && (
              <div className="px-6 py-4 flex flex-wrap gap-2 sm:gap-4">
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0">
                  Roles
                </dt>
                <dd className="text-sm text-slate-900 dark:text-slate-100">
                  {user.roles.join(', ')}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </Layout>
  );
}
