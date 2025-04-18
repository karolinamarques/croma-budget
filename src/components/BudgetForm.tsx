import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./../styles/BudgetForm.css";
import DentalDiagram from "./DentalDiagram";

interface Treatment {
  name: string;
  price: number;
  quantity: number;
}

const BudgetForm: React.FC = () => {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [treatments, setTreatments] = useState<Treatment[]>([{ name: "", price: 0, quantity: 1 }]);
  const [saved, setSaved] = useState(false);
  const orcamentos = [
    { nome: "Paciente 1", valor: "R$ 500,00" },
    { nome: "Paciente 2", valor: "R$ 700,00" },
  ];

  const handleAddTreatment = () => {
    setTreatments([...treatments, { name: "", price: 0, quantity: 1 }]);
  };

  const handleTreatmentChange = <K extends keyof Treatment>(
    index: number,
    field: K,
    value: Treatment[K]
  ) => {
    const newTreatments = [...treatments];
    newTreatments[index][field] = value;
    setTreatments(newTreatments);
  };

  const handleDeleteTreatment = (index: number) => {
    setTreatments(treatments.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return treatments.reduce((total, t) => total + t.price * t.quantity, 0).toFixed(2);
  };

  const handleSaveAndShare = async () => {
    try {
      // Salvar orçamento no localStorage
      localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
      setSaved(true);
      alert("Orçamento salvo com sucesso!");

      // Gerar PDF
      const input = document.querySelector(".budget-form") as HTMLElement;

      if (input) {
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          pdf.internal.pageSize.getWidth(),
          pdf.internal.pageSize.getHeight()
        );
        const pdfName = `Orcamento_${patientName}.pdf`;
        pdf.save(pdfName);

        // Compartilhar o arquivo gerado
        compartilhar(pdfName);  
      }
    } catch (error) {
      console.error("Erro ao salvar e compartilhar:", error);
      alert("Ocorreu um erro ao tentar salvar e compartilhar o arquivo.");
    }
  };

  const compartilhar = (pdfName: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Orçamento Odontológico",
        text: "Orçamento Odontológico salvo!",
        // A API atual não suporta arquivos, isto é uma simplificação do exemplo.
      })
      .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
      alert("Compartilhamento não suportado neste navegador.");
    }
  };

  const handleFileUpload = async () => {
    const pdf = new jsPDF();
    pdf.text("Hello world!", 10, 10);
    const pdfOutput = pdf.output('blob'); // Obtém o PDF como um Blob

    const formData = new FormData();
    formData.append('file', pdfOutput, 'documento.pdf'); // O terceiro parâmetro é o nome arquivo

    // Enviar para o servidor
    const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    console.log('File URL:', result.fileUrl);

    // Prepara o compartilhamento do link
    navigator.share({
        title: 'Compartilhamento de Arquivo',
        text: 'Veja o arquivo:',
        url: result.fileUrl,
    }).catch(console.error);
};

  return (
    <div className="budget-form">
      <div className="header-container">
        <h2>Orçamento Odontológico</h2>
        <img src="/logo-croma.png" alt="Logo" className="logo" />
      </div>

      <DentalDiagram />

      <label>Nome:</label>
      <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} />

      <label>Idade:</label>
      <input
        type="number"
        min="1"
        max="120"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />

      <h3>Tratamentos</h3>
      <table>
        <thead>
          <tr>
            <th className="small-column">Nº</th>
            <th className="large-column">Tratamento</th>
            <th className="medium-column">Valor</th>
            <th className="medium-column">Total</th>
            <th className="small-column">Deletar</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((treatment, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  min="1"
                  value={treatment.quantity}
                  onChange={(e) => handleTreatmentChange(index, "quantity", Number(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Tratamento"
                  value={treatment.name}
                  onChange={(e) => handleTreatmentChange(index, "name", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Valor"
                  value={treatment.price}
                  onChange={(e) => handleTreatmentChange(index, "price", Number(e.target.value))}
                />
              </td>
              <td>R$ {(treatment.price * treatment.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => handleDeleteTreatment(index)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleAddTreatment}>Adicionar Tratamento</button>

      <h3>Total: R$ {calculateTotal()}</h3>

      <button className="save-button" onClick={handleSaveAndShare}>
        Salvar e Compartilhar
      </button>

      {saved && <p className="success-message">Orçamento compartilhado!</p>}
    </div>
  );
};

export default BudgetForm;