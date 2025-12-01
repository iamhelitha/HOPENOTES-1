import React from 'react';

export function NotesGrid({ notes }) {
  if (!notes.length) {
    return (
      <div className="empty-state">
        <h3>No notes match your search yet</h3>
        <p>Try another subject, grade, level, or medium. New uploads are added regularly.</p>
      </div>
    );
  }

  // Separate notes by level (school vs university)
  const schoolNotes = notes.filter((note) => note.level !== 'university');
  const universityNotes = notes.filter((note) => note.level === 'university');

  // Group school notes by grade
  const groupedByGrade = schoolNotes.reduce((groups, note) => {
    const key = note.grade || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
    return groups;
  }, {});

  // Group university notes by university name
  const groupedByUniversity = universityNotes.reduce((groups, note) => {
    const key = note.universityName || 'Other University';
    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
    return groups;
  }, {});

  const sortedGrades = Object.keys(groupedByGrade).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return Number(a) - Number(b);
  });

  const sortedUniversities = Object.keys(groupedByUniversity).sort();

  return (
    <div className="notes-grade-groups">
      {/* School Grades Section */}
      {schoolNotes.length > 0 && (
        <>
          {sortedGrades.map((gradeKey) => (
            <section key={`grade-${gradeKey}`} className="grade-group">
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
        </>
      )}

      {/* University Level Section */}
      {universityNotes.length > 0 && (
        <>
          {sortedUniversities.map((universityKey) => (
            <section key={`university-${universityKey}`} className="grade-group">
              <header className="grade-group-header">
                <h3>{universityKey}</h3>
                <span className="grade-count">{groupedByUniversity[universityKey].length} notes</span>
              </header>

              <div className="notes-grid">
                {groupedByUniversity[universityKey].map((note) => (
                  <article key={note.id} className="note-card">
                    <div className="note-chip-row">
                      <span className="chip chip-subject">{note.subject}</span>
                      <span className="chip chip-medium">{note.medium}</span>
                      {note.grade && <span className="chip chip-medium">Year {note.grade}</span>}
                    </div>
                    <h4 className="note-title">{note.title}</h4>
                    <p className="note-meta">{note.curriculum}</p>
                    <p className="note-location">{note.universityName}</p>
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
        </>
      )}
    </div>
  );
}


