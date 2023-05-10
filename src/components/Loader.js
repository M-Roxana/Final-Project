import React, { useState } from "react";
import BarLoader from "react-spinners/BarLoader";
function Loader() {
  const [loading, setLoading] = useState(true);

  return (
    <div
      style={{ display: "grid", justifyContent: "center", marginTop: "200px" }}
    >
      <div className="sweet-loading">
        <BarLoader color="#000" loading={loading} size={80} />
      </div>
    </div>
  );
}

export default Loader;
