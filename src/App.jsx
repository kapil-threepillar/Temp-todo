import React, { useMemo, useState } from 'react';
import { Check, Circle, Plus, Trash2, Sun, Moon, ListTodo, Sparkles } from 'lucide-react';
import './App.css';

const initialTasks = [
  { id: 1, text: 'Review the project proposal', done: false, tag: 'WORK' },
  { id: 2, text: 'Pick up groceries for dinner', done: false, tag: 'PERSONAL' },
  { id: 3, text: 'Take a proper lunch break', done: true, tag: 'WELLBEING' },
  { id: 4, text: 'Send a note to Maya', done: false, tag: 'PERSONAL' },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('daymark-tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch { return initialTasks; }
  });
  const [draft, setDraft] = useState('');
  const [draftTag, setDraftTag] = useState('PERSONAL');
  const [filter, setFilter] = useState('All');
  const [light, setLight] = useState(false);

  const save = (next) => {
    setTasks(next);
    localStorage.setItem('daymark-tasks', JSON.stringify(next));
  };
  const addTask = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    save([{ id: Date.now(), text, done: false, tag: draftTag }, ...tasks]);
    setDraft('');
  };
  const toggleTask = (id) => save(tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  const removeTask = (id) => save(tasks.filter((task) => task.id !== id));
  const clearCompleted = () => save(tasks.filter((task) => !task.done));
  const visibleTasks = useMemo(() => tasks.filter((task) => filter === 'All' || (filter === 'Active' ? !task.done : task.done)), [tasks, filter]);
  const remaining = tasks.filter((task) => !task.done).length;
  const completed = tasks.length - remaining;
  const date = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <main className={light ? 'app light' : 'app'}>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#" aria-label="Daymark home"><span className="brand-mark"><ListTodo size={19} strokeWidth={2.1} /></span><span>daymark<span className="brand-period">.</span></span></a>
        <div className="top-right"><span className="today-label">YOUR DAILY SPACE</span><button className="theme-toggle" onClick={() => setLight(!light)} aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}>{light ? <Moon size={17} /> : <Sun size={17} />}</button></div>
      </header>

      <section className="todo-shell">
        <div className="intro">
          <div className="date-row"><span className="date-dot" />{date}</div>
          <h1>A little more<br /><span>focused.</span></h1>
          <p className="subtitle">Make room for what matters today.</p>
        </div>

        <section className="task-card" aria-label="Your tasks">
          <div className="card-heading">
            <div><div className="heading-title">Your tasks <span className="task-count">{remaining}</span></div><div className="heading-caption">One thing at a time</div></div>
            <div className="progress-wrap"><span>{tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%</span><div className="progress-track"><div className="progress-fill" style={{ width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }} /></div></div>
          </div>

          <form className="add-form" onSubmit={addTask}><span className="add-icon"><Plus size={19} /></span><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a task to your day..." aria-label="New task" /><select className="category-select" value={draftTag} onChange={(event) => setDraftTag(event.target.value)} aria-label="Task category"><option value="PERSONAL">Personal</option><option value="WORK">Work</option><option value="WELLBEING">Wellbeing</option></select><button type="submit" className="add-button" disabled={!draft.trim()}>Add task <span>↵</span></button></form>

          <div className="list-toolbar"><div className="filters" role="tablist" aria-label="Filter tasks">{['All', 'Active', 'Completed'].map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? 'filter active-filter' : 'filter'} onClick={() => setFilter(item)}>{item}{item === 'All' && <span className="filter-count">{tasks.length}</span>}</button>)}</div><span className="task-total">{remaining} LEFT</span></div>

          <ul className="task-list">{visibleTasks.map((task) => <li className={task.done ? 'task done' : 'task'} key={task.id}><button className="check-button" onClick={() => toggleTask(task.id)} aria-label={task.done ? `Mark ${task.text} active` : `Complete ${task.text}`}>{task.done ? <span className="checked"><Check size={13} strokeWidth={2.8} /></span> : <Circle size={19} strokeWidth={1.5} />}</button><span className="task-text">{task.text}</span><span className={`tag tag-${task.tag.toLowerCase()}`}>{task.tag}</span><button className="delete-button" onClick={() => removeTask(task.id)} aria-label={`Delete ${task.text}`}><Trash2 size={15} /></button></li>)}</ul>

          {visibleTasks.length === 0 && <div className="empty-state"><span className="empty-icon"><Sparkles size={18} /></span><span>{filter === 'Completed' ? 'Nothing checked off just yet.' : filter === 'Active' ? 'You’re all caught up.' : 'A fresh page. Add your first task above.'}</span></div>}

          <div className="card-footer"><span><span className="footer-spark">✳</span> Small steps still move you forward.</span>{completed > 0 && <button className="clear-button" onClick={clearCompleted}>Clear completed</button>}</div>
        </section>
        <div className="bottom-note"><span className="note-line" />YOUR PACE. YOUR DAY.<span className="note-line" /></div>
      </section>
      <footer className="page-footer">A calmer way to get things done <span>·</span> <span className="footer-brand">daymark.</span></footer>
    </main>
  );
}

export default App;
