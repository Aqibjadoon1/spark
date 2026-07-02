import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useTasks from '../../hooks/useTasks';
import useUsers from '../../hooks/useUsers';
import Modal from '../../components/globals/Modal';
import SearchBar from '../../components/globals/SearchBar';
import Pagination from '../../components/globals/Pagination';
import Skeleton from '../../components/globals/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';
import TextInput from '../../components/inputs/TextInput';
import SelectInput from '../../components/inputs/SelectInput';
import TextArea from '../../components/inputs/TextArea';
import DateInput from '../../components/inputs/DateInput';
import Button from '../../components/buttons/Button';
import { showToast } from '../../redux/actions/uiActions';

const PAGE_SIZE = 10;

const statusOptions = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const sortOptions = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

const emptyTask = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: '',
  assignedTo: '',
  dueDate: '',
};

const AdminTasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error, createTask, updateTask, deleteTask, filterByStatus, filterByPriority, searchTasks, sortTasks } = useTasks();
  const { users } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyTask);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (statusFilter) filterByStatus(statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    if (priorityFilter) filterByPriority(priorityFilter);
  }, [priorityFilter]);

  useEffect(() => {
    if (sortBy) sortTasks(sortBy);
  }, [sortBy]);

  const handleSearch = useCallback(async (val) => {
    setSearch(val);
    setCurrentPage(1);
    if (val.trim()) {
      await searchTasks(val);
    }
  }, [searchTasks]);

  const displayed = useMemo(() => {
    let list = [...tasks];
    if (!statusFilter && !priorityFilter && !search.trim() && !sortBy) return tasks;
    return list;
  }, [tasks, statusFilter, priorityFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(displayed.length / PAGE_SIZE));
  const paginated = displayed.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const userOptions = useMemo(
    () => users.map((u) => ({ value: u.uid, label: u.displayName || u.email || 'Unknown' })),
    [users],
  );

  const openCreate = () => {
    setEditingTask(null);
    setForm(emptyTask);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      category: task.category || '',
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate
        ? typeof task.dueDate === 'string'
          ? task.dueDate.slice(0, 10)
          : new Date(task.dueDate.seconds * 1000).toISOString().slice(0, 10)
        : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      dispatch(showToast('Title is required', 'error'));
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, createdAt: new Date().toISOString() };
      if (editingTask) {
        await updateTask(editingTask.id, payload);
        dispatch(showToast('Task updated', 'success'));
      } else {
        await createTask(payload);
        dispatch(showToast('Task created', 'success'));
      }
      setModalOpen(false);
      setEditingTask(null);
      setForm(emptyTask);
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(deleteTarget.id);
      dispatch(showToast('Task deleted', 'success'));
      setDeleteTarget(null);
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  const getAssignedName = (uid) => {
    const u = users.find((x) => x.uid === uid);
    return u?.displayName || u?.email || 'Unassigned';
  };

  if (error) {
    return <p style={{ color: 'red', fontSize: '0.875rem' }}>Error loading tasks: {error}</p>;
  }

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-header">
            <h1>Manage Tasks</h1>
            <p>{tasks.length} total tasks</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>Create Task</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={handleSearch} placeholder="Search by title..." />
          <SelectInput
            options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            style={{ minWidth: '140px' }}
          />
          <SelectInput
            options={[{ value: '', label: 'All Priorities' }, ...priorityOptions]}
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
            style={{ minWidth: '140px' }}
          />
          <SelectInput
            options={[{ value: '', label: 'No Sort' }, ...sortOptions]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ minWidth: '140px' }}
          />
        </div>
      </div>

      {loading ? (
        <Skeleton variant="card" count={5} />
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={
            <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          title="No tasks found"
          description={search ? 'Try a different search' : 'Create your first task'}
          actionLabel={search ? undefined : 'Create Task'}
          onAction={search ? undefined : openCreate}
        />
      ) : (
        <>
          <div className="panel-card" style={{ padding: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((task) => (
                  <tr key={task.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500', maxWidth: '200px' }}>{task.title}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${task.status === 'done' ? 'badge-done' : task.status === 'in-progress' ? 'badge-progress' : 'badge-todo'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${task.priority === 'high' ? 'badge-high' : task.priority === 'medium' ? 'badge-medium' : 'badge-low'}`}>
                        {task.priority || 'medium'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#888' }}>{getAssignedName(task.assignedTo)}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#888' }}>
                      {task.dueDate
                        ? typeof task.dueDate === 'string'
                          ? new Date(task.dueDate).toLocaleDateString()
                          : new Date(task.dueDate.seconds * 1000).toLocaleDateString()
                        : '-'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
                        <button className="btn btn-icon btn-sm" onClick={() => openEdit(task)} title="Edit">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M13.3333 2.5L17.5 6.66667M2.5 17.5L7.5 16.6667L16.6667 7.5L12.5 3.33333L3.33333 12.5L2.5 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button className="btn btn-icon btn-sm" onClick={() => setDeleteTarget(task)} title="Delete">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M4 5H16M7.5 5V3.5C7.5 3.22386 7.72386 3 8 3H12C12.2761 3 12.5 3.22386 12.5 3.5V5M15 7L14.5 16.5H5.5L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div style={{ marginTop: '1rem' }}>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null); }} title={editingTask ? 'Edit Task' : 'Create Task'}>
        <form onSubmit={handleSubmit}>
          <TextInput label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
          <TextArea label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <SelectInput label="Status" options={statusOptions} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} />
            <SelectInput label="Priority" options={priorityOptions} value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))} />
          </div>
          <SelectInput label="Assigned To" options={userOptions} value={form.assignedTo} onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))} placeholder="Assign to..." />
          <TextInput label="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
          <DateInput label="Due Date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <Button type="submit" variant="primary" loading={submitting} style={{ flex: 1 }}>{editingTask ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="ghost" onClick={() => { setModalOpen(false); setEditingTask(null); }} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Task" size="sm">
        <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Are you sure you want to delete <strong>{deleteTarget?.title}</strong>?</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} style={{ flex: 1 }}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} style={{ flex: 1 }}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTasks;
