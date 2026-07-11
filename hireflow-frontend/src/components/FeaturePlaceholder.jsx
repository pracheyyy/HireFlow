export default function FeaturePlaceholder({ icon: Icon, title, description, previewLabel }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 13,
            background: "linear-gradient(135deg, #eaf1fd, #dbe7fb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--brand-600)",
            marginBottom: 16,
          }}
        >
          <Icon size={22} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{title}</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 480, lineHeight: 1.6 }}>{description}</p>
      </div>

      <div
        style={{
          border: "1.5px dashed var(--border-strong)",
          borderRadius: 18,
          padding: "56px 24px",
          textAlign: "center",
          background: "var(--surface)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--brand-700)",
            background: "#eaf1fd",
            border: "1px solid #dbe7fb",
            borderRadius: 999,
            padding: "6px 14px",
            marginBottom: 16,
          }}
        >
          In development
        </div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 360, margin: "0 auto" }}>{previewLabel}</p>
      </div>
    </div>
  );
}
