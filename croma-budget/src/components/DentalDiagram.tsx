import "./../styles/BudgetForm.css";
import React, { useState, useRef } from "react";

interface Note {
  x: number;
  y: number;
  text: string;
  color: string;
}

const DentalDiagram: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const img = imageRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setEditingNote({ x, y, text: "", color: "black" });
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingNote) {
      const newText = event.target.value.slice(0, 3); // Limitar a 3 caracteres
      const color = getColorForText(newText);
      setEditingNote({ ...editingNote, text: newText, color });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && editingNote && editingNote.text.trim() !== "") {
      setNotes([...notes, editingNote]);
      setEditingNote(null); // Esconde a caixa de texto
    }
  };

  const handleBlur = () => {
    if (editingNote && editingNote.text.trim() !== "") {
      setNotes([...notes, editingNote]);
    }
    setEditingNote(null); // Esconde a caixa de texto
  };

  const getColorForText = (text: string) => {
    switch (text.toUpperCase()) {
      case 'X': return 'red';
      case 'E': return 'blue';
      case 'R': return 'purple';
      case 'T': return 'green';
      case 'I': return 'orange';
      case 'C': return 'darkgrey';
      case 'N': return 'magenta';
      case 'P': return 'teal';
      case 'A': return 'brown';
      default: return 'black';
    }
  };

  const handleDragStart = (index: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setDraggingIndex(index);
  };

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (draggingIndex !== null && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const newX = "touches" in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
      const newY = "touches" in event ? event.touches[0].clientY - rect.top : event.clientY - rect.top;

      setNotes((prevNotes) =>
        prevNotes.map((note, i) =>
          i === draggingIndex ? { ...note, x: newX, y: newY } : note
        )
      );
    }
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const handleDoubleClick = (index: number) => {
    setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
  };

  // Estilo das letras na legenda
  const letterStyles = {
    X: { color: 'red' },
    E: { color: 'blue' },
    R: { color: 'purple' },
    T: { color: 'green' },
    I: { color: 'orange' },
    C: { color: 'darkgrey' },
    N: { color: 'magenta' },
    P: { color: 'teal' },
    A: { color: 'brown' }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        className="dental-diagram-container"
        style={{ position: "relative", display: "inline-block" }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <img
          ref={imageRef}
          src="/dental-diagram.png"
          alt="Odontograma"
          style={{ width: "100%", maxWidth: "600px", display: "block" }}
          onClick={handleImageClick}
        />

        {notes.map((note, index) => (
          <div
            key={index}
            className="note"
            style={{
              position: "absolute",
              left: note.x,
              top: note.y,
              color: note.color,
              fontSize: "22px",
              fontWeight: "bold",
              cursor: "grab",
            }}
            onMouseDown={(event) => handleDragStart(index, event)}
            onTouchStart={(event) => handleDragStart(index, event)}
            onDoubleClick={() => handleDoubleClick(index)}
          >
            {note.text}
          </div>
        ))}

        {editingNote && (
          <input
            type="text"
            className="visible-input"
            style={{
              position: "absolute",
              left: editingNote.x,
              top: editingNote.y,
              width: "40px",
              height: "35px",
              border: "1px solid black",
              fontSize: "32px",
              fontWeight: "bold",
              color: editingNote.color,
              textAlign: "center",
            }}
            maxLength={3}
            value={editingNote.text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
          />
        )}
      </div>

      {/* Legenda abaixo do gráfico */}
      <div
        style={{
          marginTop: "10px",
          fontSize: "14px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={letterStyles.X}>X = Exodontia</span>
        <span style={letterStyles.E}>E = Endo/Canal</span>
        <span style={letterStyles.R}>R = Restauração</span>
        <span style={letterStyles.T}>T = Tratamento descrito abaixo</span>
      </div>
      <div
        style={{
          marginTop: "10px",
          fontSize: "14px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={letterStyles.I}>I = Implante</span>
        <span style={letterStyles.C}>C = Coroa</span>
        <span style={letterStyles.N}>N = Núcleo</span>
        <span style={letterStyles.P}>P = Provisório</span>
        <span style={letterStyles.A}>A = Aumento de coroa</span>
      </div>
    </div>
  );
};

export default DentalDiagram;