import Layout from "./layout";

export default function Shared404() {
  return (
    <Layout>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1
          style={{
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: "4rem",
          }}
        >
          404
        </h1>
        <p>Ooops, seems like this page does not exists.</p>
      </div>
    </Layout>
  );
}
