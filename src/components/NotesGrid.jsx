import React from 'react';

export function NotesGrid({ notes }) {
  if (!notes.length) {
    return (
      <div className="empty-state">
        <h3>No notes match your search yet</h3>
        <p>Try another subject, grade, or medium. New uploads are added regularly.</p>
      </div>
    );
  }

  // Group notes by grade so Browse Notes is categorised
  const groupedByGrade = notes.reduce((groups, note) => {
    const key = note.grade || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
    return groups;
  }, {});

  const sortedGrades = Object.keys(groupedByGrade).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="notes-grade-groups">
      {sortedGrades.map((gradeKey) => (
        <section key={gradeKey} className="grade-group">
          <header className="grade-group-header">
            <h3>Grade {gradeKey}</h3>
            <span className="grade-count">{groupedByGrade[gradeKey].length} notes</span>
          </header>

          <div className="notes-grid">
            {groupedByGrade[gradeKey].map((note) => (
              <article key={note.id} className="note-card">
                <div className="note-chip-row">
                  <span className="chip chip-subject">{note.subject}</span>
                  <span className="chip chip-medium">{note.medium}</span>
                </div>
                <h4 className="note-title">{note.title}</h4>
                <p className="note-meta">{note.curriculum}</p>
                <p className="note-location">{note.region}</p>
                <div className="note-actions">
                  <button
                    type="button"
                    className="note-view-btn"
                    onClick={() => note.url && window.open(note.url, '_blank', 'noopener')}
                    disabled={!note.url}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="note-download-btn"
                    onClick={() => note.url && window.open(note.url, '_blank', 'noopener')}
                    disabled={!note.url}
                  >
                    Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}


