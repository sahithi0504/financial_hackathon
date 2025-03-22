import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { FaFileInvoice, FaChartLine, FaFileAlt } from 'react-icons/fa';
import './UploadData.css';

export default function UploadData() {
  const [uploads, setUploads] = useState({
    invoices: { lastUploaded: null, preview: null, fileName: null },
    stock: { lastUploaded: null, preview: null, fileName: null },
    profitLoss: { lastUploaded: null, preview: null, fileName: null },
  });

  const [previewType, setPreviewType] = useState(null);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      alert("Only CSV files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const csvText = reader.result;
      const parsed = Papa.parse(csvText, { header: true });
      const now = new Date().toLocaleString();
      setUploads((prev) => ({
        ...prev,
        [type]: {
          lastUploaded: now,
          preview: parsed.data.slice(0, 5),
          fileName: file.name,
        },
      }));
    };
    reader.readAsText(file);
  };

  const renderPreviewTable = (type) => {
    const data = uploads[type].preview;
    if (!data || !data.length) return null;

    const headers = Object.keys(data[0]);

    return (
      <div className="preview-table">
        <h4>Preview</h4>
        <table>
          <thead>
            <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {headers.map((h) => (
                  <td key={h}>{row[h]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const UploadCard = ({ type, label, icon }) => (
    <motion.div
      className="upload-section"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="upload-label">
        <span className="upload-icon">{icon}</span> {label}
      </h3>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => handleFileUpload(e, type)}
      />
      {uploads[type].fileName && (
        <p className="file-name">Selected file: {uploads[type].fileName}</p>
      )}
      {uploads[type].lastUploaded && (
        <p className="timestamp">Last uploaded: {uploads[type].lastUploaded}</p>
      )}
      {uploads[type].preview && (
        <button onClick={() => setPreviewType(previewType === type ? null : type)}>
          {previewType === type ? "Hide Preview" : "Show Preview"}
        </button>
      )}
      {previewType === type && renderPreviewTable(type)}
    </motion.div>
  );

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Financial Data</h2>

      <UploadCard type="invoices" label="Upload Invoices" icon={<FaFileInvoice />} />
      <UploadCard type="stock" label="Upload Stock Data" icon={<FaChartLine />} />
      <UploadCard type="profitLoss" label="Upload Profit & Loss" icon={<FaFileAlt />} />
    </div>
  );
}