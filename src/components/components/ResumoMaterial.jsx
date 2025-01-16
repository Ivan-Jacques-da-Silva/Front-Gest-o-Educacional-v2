// components/ResumoMaterial.js
import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const ResumoMaterial = ({ turmaId, chamadaId }) => {
  const [resumo, setResumo] = useState("");
  const [link, setLink] = useState("");
  const [linkYoutube, setLinkYoutube] = useState("");
  const [material, setMaterial] = useState(null);

  const handleSaveResumo = () => {
    if (!turmaId || !chamadaId) {
      toast.error("Selecione uma turma e chamada antes de salvar o resumo.");
      return;
    }

    const formData = new FormData();
    formData.append("turmaId", turmaId);
    formData.append("resumo", resumo);
    formData.append("link", link);
    formData.append("linkYoutube", linkYoutube);
    if (material) {
      formData.append("arquivo", material);
    }

    axios
      .post(`${API_BASE_URL}/resumos`, {
        turmaId,
        chamadaId,
        resumo,
      })
      .then(() => {
        toast.success("Resumo salvo com sucesso.");
        setResumo("");
      })
      .catch((error) => {
        console.error("Erro ao salvar resumo:", error);
        toast.error("Erro ao salvar resumo. Tente novamente mais tarde.");
      });
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <h4>Adicionar Resumo e Material</h4>
        <Form>
          <Form.Group controlId="formResumo">
            <Form.Label>Resumo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Insira o resumo da aula"
            />
          </Form.Group>

          <Form.Group controlId="formLink" className="mt-3">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Insira um link opcional"
            />
          </Form.Group>

          <Form.Group controlId="formLinkYoutube" className="mt-3">
            <Form.Label>Link do YouTube</Form.Label>
            <Form.Control
              type="text"
              value={linkYoutube}
              onChange={(e) => setLinkYoutube(e.target.value)}
              placeholder="Insira o link do YouTube"
            />
          </Form.Group>

          <Form.Group controlId="formMaterial" className="mt-3">
            <Form.Label>Material</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setMaterial(e.target.files[0])}
            />
          </Form.Group>

          <Button variant="primary" className="mt-3" onClick={handleSaveResumo}>
            Salvar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ResumoMaterial;
