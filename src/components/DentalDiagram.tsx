import { color } from "html2canvas/dist/types/css/types/color";
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
      setEditingNote({ ...editingNote, text: newText });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && editingNote && editingNote.text.trim() !== "") {
      const color = getColorForText(editingNote.text);
      setNotes([...notes, { ...editingNote, color }]);
      setEditingNote(null); // Esconde a caixa de texto
    }
  };

  const handleBlur = () => {
    if (editingNote && editingNote.text.trim() !== "") {
      const color = getColorForText(editingNote.text);
      setNotes([...notes, { ...editingNote, color }]);
    }
    setEditingNote(null); // Esconde a caixa de texto
  };

  const getColorForText = (text: string) => {
    switch (text.toUpperCase()) {
      case 'X':
        return 'red';
      case 'C':
        return 'blue';
      case 'R':
        return 'purple';
      case 'T':
        return 'green';
      default:
        return 'black';
    }
  };

  const handleDragStart = (index: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setDraggingIndex(index);
  };

  const handleNoteRemove = (index: number) => {
    setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
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

  const letterStyles = {
    X: { color: 'red' },
    C: { color: 'blue' },
    R: { color: 'purple' },
    I: { color: 'grey'},
    T: { color: 'green' },
    rest: { color: 'black' }
  };

  return (
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
          onDoubleClick={() => handleNoteRemove(index)}
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
            color: getColorForText(editingNote.text),
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
        <span style={letterStyles.C}>C = Canal</span>
        <span style={letterStyles.R}>R = Restauração</span>
        <span style={letterStyles.I}>I = Implante</span>
        <span style={letterStyles.T}>T = Tratamento descrito abaixo</span>
      </div>

    </div>
  );
};

export default DentalDiagram;