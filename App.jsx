import React, { useState } from "react";

function App() {
  const [vastIP, setVastIP] = useState("");
  const [ipConfirmed, setIpConfirmed] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [maskFile, setMaskFile] = useState(null);
  const [prompt, setPrompt] = useState("Open the legs slightly.");
  const [outputUrl, setOutputUrl] = useState(null);

  const handleIPSubmit = () => {
    if (vastIP.startsWith("http")) {
      setIpConfirmed(true);
    } else {
      alert("http:// から始まる形式で入力してください。例: http://123.123.123.123:7860");
    }
  };

  const handleSubmit = async () => {
    const encodeBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const init_image = await encodeBase64(imageFile);
    const mask_image = await encodeBase64(maskFile);

    const payload = {
      init_images: [init_image],
      mask: mask_image,
      prompt,
      inpainting_fill: 1,
      inpaint_full_res: true,
      denoising_strength: 0.75,
      steps: 20,
      sampler_name: "Euler a",
    };

    const res = await fetch(`${vastIP}/sdapi/v1/img2img`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const image_base64 = data.images?.[0];
    setOutputUrl(`data:image/png;base64,${image_base64}`);
  };

  if (!ipConfirmed) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>🔧 Vast.ai IPを入力してください</h2>
        <p>例: http://123.123.123.123:7860</p>
        <input
          type="text"
          value={vastIP}
          onChange={(e) => setVastIP(e.target.value)}
          style={{ width: "300px" }}
        />
        <button onClick={handleIPSubmit}>確定</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h2>Stable Diffusion Inpainting</h2>
      <p>Original Image:</p>
      <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
      <p>Mask Image:</p>
      <input type="file" onChange={(e) => setMaskFile(e.target.files[0])} />
      <p>Prompt:</p>
      <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleSubmit}>Generate</button>
      {outputUrl && (
        <div>
          <h3>Result:</h3>
          <img src={outputUrl} alt="Output" />
        </div>
      )}
    </div>
  );
}

export default App;

