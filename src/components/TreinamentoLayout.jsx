import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Button,
  Container,
  Form,
  Modal,
  Image,
} from "react-bootstrap";
import { MdPlayCircle } from "react-icons/md";
import { FaFilePdf, FaDownload, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "./config";
// import "./treinamento.css";

const Treinamento = () => {
  const [materiais, setMateriais] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    linkYoutube: "",
    arquivoPdf1: null,
    arquivoPdf2: null,
    arquivoPdf3: null,
    miniatura: null,
    data: "",
    categorias: "",
  });

  const [filteredMateriais, setFilteredMateriais] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [userType, setUserType] = useState(null);

  const getUserType = () => {
    const userType = localStorage.getItem("userType");
    return userType ? parseInt(userType, 10) : null;
  };

  useEffect(() => {
    const userType = getUserType();
    setUserType(userType);
  }, []);

  useEffect(() => {
    fetchMateriais();
  }, []);


  const fetchMateriais = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/materiais`);
      setMateriais(response.data);
      setFilteredMateriais(response.data);
      console.log("Verificação: ", materiais);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    }
  };

  const handleViewPDF = (url) => {
    setPdfUrl(url);
    setShowPDF(true);
  };

  const handleOpenVideo = (url) => {
    const videoUrlNormalizado = normalizarUrlYoutube(url);
    setVideoUrl(videoUrlNormalizado);
    setShowVideo(true);
  };

  const handleClose = () => {
    setShowPDF(false);
    setShowVideo(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("titulo", formData.titulo);
    formDataObj.append("descricao", formData.descricao);
    formDataObj.append("linkYoutube", formData.linkYoutube);
    formDataObj.append("arquivoPdf1", formData.arquivoPdf1);
    formDataObj.append("arquivoPdf2", formData.arquivoPdf2);
    formDataObj.append("arquivoPdf3", formData.arquivoPdf3);
    formDataObj.append("miniatura", formData.miniatura);
    formDataObj.append("data", formData.data);
    formDataObj.append("categorias", formData.categorias);
    formDataObj.append("permitirDownload", formData.permitirDownload);


    try {
      await axios.post(`${API_BASE_URL}/materiais`, formDataObj);
      fetchMateriais();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/materiais/${id}`);
      fetchMateriais();
    } catch (error) {
      console.error("Erro ao excluir material:", error);
    }
  };

  const handleDownload = async (pdfUrls) => {
    setIsDownloading(true);
    let successCount = 0;

    try {
      for (let pdfUrl of pdfUrls) {
        if (pdfUrl) {
          const relativePath = pdfUrl.replace(API_BASE_URL, '');
          window.open(`${API_BASE_URL}/proxy-download?url=${encodeURIComponent(relativePath)}`, '_blank');
          successCount++;
        }
      }
      if (successCount > 0) {
        toast.success(`${successCount} arquivo(s) baixado(s) com sucesso!`);
      } else {
        toast.error("Nenhum arquivo foi baixado.");
      }
    } catch (error) {
      console.error("Erro ao baixar arquivos:", error);
      toast.error("Erro ao baixar os arquivos.");
    } finally {
      setIsDownloading(false);
    }
  };

  const normalizarUrlYoutube = (url) => {
    let videoId = '';
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    }
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };



  const handleCategoryChange = (event) => {
    const category = event.target.name;
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) {
      // If date is invalid, try parsing it manually
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
    return date.toLocaleDateString("pt-BR");
  };

  // const removeAccents = (str) => {
  //   return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // };

  const applyFilter = () => {
    let filtered = materiais;

    // Filtro de Categorias
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((material) => {
        const materialCategories = material.cp_mat_extra_categories
          ? material.cp_mat_extra_categories.split(",").map((cat) => cat.trim())
          : [];
        return selectedCategories.some((category) =>
          materialCategories.includes(category)
        );
      });
    }

    // Filtro de Nome
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (material) =>
          material.cp_mat_titulo &&
          material.cp_mat_titulo.toLowerCase().includes(lowerCaseTerm)
      );
    }

    // Filtro de Data
    if (filterDate) {
      filtered = filtered.filter((material) => {
        const materialDate = material.cp_mat_extra_date.split("T")[0];
        return materialDate === filterDate;
      });
    }

    setFilteredMateriais(filtered);
  };

  return (
    <Container fluid>
      <ToastContainer />
      <Row>
        <Col xs={3} className="bg-light border-end p-3">
          <h5
            style={{ fontWeight: "bold" }}
            className="mt-3 d-flex justify-content-center "
          >
            Filtrar
          </h5>
          <Form>
            <Card className="mb-3">
              <Card.Header>
                <h6>Categorias</h6>
              </Card.Header>
              <Card.Body>
                <div className="category-list">
                  <Form.Group className="mb-3">
                    {Array.from(
                      new Set(
                        materiais.flatMap((material) =>
                          material.cp_mat_extra_categories &&
                            typeof material.cp_mat_extra_categories === "string"
                            ? material.cp_mat_extra_categories
                              .split(",")
                              .map((cat) => cat.trim())
                            : []
                        )
                      )
                    ).map((category, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={category}
                        name={category}
                        onChange={handleCategoryChange}
                        checked={selectedCategories.includes(category)}
                      />
                    ))}
                  </Form.Group>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Header>
                <h6>Pesquisar por Nome</h6>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Header>
                <h6>Filtrar por Data</h6>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <Button
              style={{ margin: "10px" }}
              variant="primary"
              onClick={applyFilter}
              className="mt-3"
            >
              Aplicar Filtro
            </Button>
            <Button
              style={{ margin: "10px" }}
              variant="secondary"
              onClick={() => {
                setSearchTerm("");
                setFilterDate("");
                setSelectedCategories([]);
                setFilteredMateriais(materiais);
              }}
              className="mt-3"
            >
              Limpar Filtros
            </Button>
          </Form>
        </Col>

        <Col xs={9}>
          <Card className="my-3">
            {userType === 1 && (
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <Form.Group controlId="formMiniatura">
                        <Form.Label>Miniatura</Form.Label>
                        <Form.Control
                          type="file"
                          name="miniatura"
                          onChange={handleFileChange}
                        />
                        {formData.miniatura && (
                          <Image
                            src={URL.createObjectURL(formData.miniatura)}
                            rounded
                            className="mt-3"
                            style={{
                              width: "100%",
                              height: "auto",
                              aspectRatio: "16/9",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="formTitulo">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                          type="text"
                          name="titulo"
                          value={formData.titulo}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formDescricao" className="mt-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="descricao"
                          rows={3}
                          value={formData.descricao}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formDate" className="mt-3">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="date"
                          name="data"
                          value={formData.data}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formLinkYoutube" className="mt-3">
                        <Form.Label>URL do YouTube</Form.Label>
                        <Form.Control
                          type="text"
                          name="linkYoutube"
                          value={formData.linkYoutube}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="formPdf1">
                        <Form.Label>Anexar PDF 1</Form.Label>
                        <Form.Control
                          type="file"
                          name="arquivoPdf1"
                          onChange={handleFileChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPdf2" className="mt-3">
                        <Form.Label>Anexar PDF 2</Form.Label>
                        <Form.Control
                          type="file"
                          name="arquivoPdf2"
                          onChange={handleFileChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPdf3" className="mt-3">
                        <Form.Label>Anexar PDF 3</Form.Label>
                        <Form.Control
                          type="file"
                          name="arquivoPdf3"
                          onChange={handleFileChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formCategories" className="mt-3">
                        <Form.Label>Categorias</Form.Label>
                        <Form.Control
                          type="text"
                          name="categorias"
                          placeholder="Digite as categorias separadas por vírgula"
                          value={formData.categorias}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPermitirDownload" className="mt-3">
                        <Form.Label>Permitir Download</Form.Label>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          label="Permitir"
                          checked={formData.permitirDownload || false}
                          onChange={(e) =>
                            setFormData({ ...formData, permitirDownload: e.target.checked ? 1 : 0 })
                          }
                        />
                      </Form.Group>

                    </Col>
                  </Row>
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3 float-end"
                  >
                    Cadastrar Material
                  </Button>
                </Form>
              </Card.Body>
            )}
          </Card>

          <Col>
            {filteredMateriais.map((material, index) => (
              <Card className="my-3" key={index}>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      {material.cp_mat_miniatura && (
                        <div
                          className="image-container"
                          onClick={() =>
                            handleOpenVideo(material.cp_mat_linkYoutube)
                          }
                        >
                          <Image
                            src={material.cp_mat_miniatura}
                            rounded
                            style={{
                              width: "100%",
                              height: "auto",
                              cursor: "pointer",
                              aspectRatio: "16/9",
                              objectFit: "cover",
                            }}
                          />
                          <MdPlayCircle className="play-icon" />
                        </div>
                      )}
                    </Col>
                    <Col md={4}>
                      <h5>{material.cp_mat_titulo}</h5>
                      <p>{material.cp_mat_descricao}</p>
                      <p>{formatDateString(material.cp_mat_extra_date)}</p>
                    </Col>
                    <Col md={4}>
                      <h6 style={{ fontWeight: "bold" }}>Categorias</h6>
                      <p>
                        {material.cp_mat_extra_categories &&
                          material.cp_mat_extra_categories
                            .split(",")
                            .map((cat, index) => (
                              <span
                                key={index}
                                className="badge bg-secondary me-1"
                              >
                                {cat.trim()}
                              </span>
                            ))}
                      </p>
                      <p>
                        {material.cp_mat_arquivoPdf && (
                          <Button
                            variant="link"
                            onClick={() =>
                              handleViewPDF(material.cp_mat_arquivoPdf)
                            }
                          >
                            <FaFilePdf /> PDF 1
                          </Button>
                        )}
                      </p>
                      <p>
                        {material.cp_mat_extra_pdf2 && (
                          <Button
                            variant="link"
                            onClick={() =>
                              handleViewPDF(material.cp_mat_extra_pdf2)
                            }
                          >
                            <FaFilePdf /> PDF 2
                          </Button>
                        )}
                      </p>
                      <p>
                        {material.cp_mat_extra_pdf3 && (
                          <Button
                            variant="link"
                            onClick={() =>
                              handleViewPDF(material.cp_mat_extra_pdf3)
                            }
                          >
                            <FaFilePdf /> PDF 3
                          </Button>
                        )}
                      </p>
                      {(userType === 1 || userType === 2) && (
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(material.cp_mat_id)}
                          className="mt-2"
                        >
                          <FaTrash />
                        </Button>
                      )}
                      {material.cp_mat_permitirDownload === 1 && (
                        <Button
                          variant="success"
                          className="custom-download-button mt-2 ms-2"
                          onClick={() =>
                            handleDownload([material.cp_mat_arquivoPdf, material.cp_mat_extra_pdf2, material.cp_mat_extra_pdf3])
                          }
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            <FaDownload />
                          )}
                        </Button>
                      )}



                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Col>
      </Row>
      <Modal
        style={{ zIndex: "1050" }}
        show={showPDF}
        onHide={handleClose}
        centered
        fullscreen
        dialogClassName="modal-90w"
        className="custom-modal-size"
      >
        <Modal.Header closeButton>
          <Modal.Title>Visualizar PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true&zoom=100`}
            width="100%"
            className="custom-modal-iframe"
            style={{ border: "none" }}
            title="PDF Viewer"
          />
        </Modal.Body>
      </Modal>

      <Modal
        className="modal-video-conteudo"
        show={showVideo}
        style={{ zIndex: "1050" }}
        onHide={handleClose}
        centered
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Visualizar Vídeo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center d-flex w-100 justify-content-center">
          {videoUrl ? (
            <iframe
              width="100%"
              height="80vh"
              className="custom-modal-video"
              src={videoUrl}
              frameBorder="0"
              allowFullScreen
              title="YouTube Video"
            />
          ) : (
            <p>URL do vídeo inválida</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Treinamento;
