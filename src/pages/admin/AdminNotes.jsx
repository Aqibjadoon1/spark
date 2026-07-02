import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useNotes from '../../hooks/useNotes';
import Modal from '../../components/globals/Modal';
import SearchBar from '../../components/globals/SearchBar';
import Skeleton from '../../components/globals/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';
import TextInput from '../../components/inputs/TextInput';
import TextArea from '../../components/inputs/TextArea';
import SelectInput from '../../components/inputs/SelectInput';
import Button from '../../components/buttons/Button';
import { showToast } from '../../redux/actions/uiActions';

const emptyNote = {
  title: '',
  content: '',
  category: '',
  tags: '',
};

const AdminNotes = () => {
  const dispatch = useDispatch();
  const { notes, loading, error, createNote, updateNote, deleteNote, archiveNote, pinNote, searchNotes } = useNotes();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState(emptyNote);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categories = useMemo(() => {
    const cats = new Set(notes.map((n) => n.category).filter(Boolean));
    return [...cats];
  }, [notes]);

  const handleSearch = useCallback(async (val) => {
    setSearch(val);
    if (val.trim()) {
      await searchNotes(val);
    }
  }, [searchNotes]);

  const displayed = useMemo(() => {
    if (categoryFilter) return notes.filter((n) => n.category === categoryFilter);
    return notes;
  }, [notes, categoryFilter]);

  const openCreate = () => {
    setEditingNote(null);
    setForm(emptyNote);
    setModalOpen(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setForm({
      title: note.title || '',
      content: note.content || '',
      category: note.category || '',
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : note.tags || '',
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
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        createdAt: new Date().toISOString(),
      };
      if (editingNote) {
        await updateNote(editingNote.id, payload);
        dispatch(showToast('Note updated', 'success'));
      } else {
        await createNote(payload);
        dispatch(showToast('Note created', 'success'));
      }
      setModalOpen(false);
      setEditingNote(null);
      setForm(emptyNote);
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNote(deleteTarget.id);
      dispatch(showToast('Note deleted', 'success'));
      setDeleteTarget(null);
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  const handleArchive = async (note) => {
    try {
      await archiveNote(note.id);
      dispatch(showToast(note.archived ? 'Note unarchived' : 'Note archived', 'success'));
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  const handlePin = async (note) => {
    try {
      await pinNote(note.id);
      dispatch(showToast(note.pinned ? 'Note unpinned' : 'Note pinned', 'success'));
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  if (error) {
    return <p style={{ color: 'red', fontSize: '0.875rem' }}>Error loading notes: {error}</p>;
  }

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-header">
            <h1>Manage Notes</h1>
            <p>{notes.length} total notes</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>Create Note</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={handleSearch} placeholder="Search by title or content..." />
          <SelectInput
            options={[{ value: '', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); }}
            style={{ minWidth: '140px' }}
          />
        </div>
      </div>

      {loading ? (
        <Skeleton variant="card" count={6} />
      ) : displayed.length === 0 ? (
        <EmptyState
          icon={
            <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
              <path d="M5 3h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          title={search ? 'No notes match your search' : 'No notes yet'}
          description={search ? 'Try a different search term' : 'Create your first note'}
          actionLabel={search ? undefined : 'Create Note'}
          onAction={search ? undefined : openCreate}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {displayed.map((note) => (
            <div key={note.id} className={`note-card ${note.pinned ? 'pinned' : ''} ${note.archived ? 'archived' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    {note.title || 'Untitled'}
                  </h3>
                </div>
                <span className={`badge ${note.archived ? 'badge-muted' : 'badge-success'}`}>
                  {note.archived ? 'Archived' : 'Active'}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#888', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>
                {note.content || 'No content'}
              </p>
              {note.category && (
                <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
                  {note.category}
                </span>
              )}
              {Array.isArray(note.tags) && note.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="badge badge-muted">{tag}</span>
                  ))}
                  {note.tags.length > 3 && (
                    <span style={{ fontSize: '0.625rem', color: '#888' }}>+{note.tags.length - 3}</span>
                  )}
                </div>
              )}
              <div className="task-actions" style={{ borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => handlePin(note)}>{note.pinned ? 'Unpin' : 'Pin'}</button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleArchive(note)}>{note.archived ? 'Unarchive' : 'Archive'}</button>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(note)}>Edit</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(note)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingNote(null); }} title={editingNote ? 'Edit Note' : 'Create Note'}>
        <form onSubmit={handleSubmit}>
          <TextInput label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
          <TextArea label="Content" value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} />
          <TextInput label="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
          <TextInput label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} />
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <Button type="submit" variant="primary" loading={submitting} style={{ flex: 1 }}>{editingNote ? 'Update' : 'Create'}</Button>
            <Button type="button" variant="ghost" onClick={() => { setModalOpen(false); setEditingNote(null); }} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Note" size="sm">
        <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Are you sure you want to delete <strong>{deleteTarget?.title || 'this note'}</strong>?</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} style={{ flex: 1 }}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} style={{ flex: 1 }}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminNotes;
