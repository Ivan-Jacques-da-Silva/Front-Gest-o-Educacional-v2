// components/Turmas.js
import React from "react";
import { Form } from "react-bootstrap";

const Turmas = ({ turmas, onSelectTurma }) => {
  return (
    <Form.Control as="select" onChange={(e) => onSelectTurma(e.target.value)}>
      <option value="" disabled>
        {turmas.length > 0 ? "Selecione..." : "Nenhuma turma disponível"}
      </option>
      {turmas.map((turma) => (
        <option key={turma.cp_tr_id} value={turma.cp_tr_id}>
          {turma.cp_tr_nome}
        </option>
      ))}
    </Form.Control>

  );
};

export default Turmas;
