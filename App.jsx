import React, { useState } from "react";

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [maskFile, setMaskFile] = useState(null);
  const [prompt, setPrompt] = useState("Open the legs slightly.");
  const [outputUrl, setOutputUrl] = useState(null);

  const handleSubmit = async () => {
    const encodeBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
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
      denoising_strength: 0.7,
      steps: 20,
      sampler_name: "Euler a",
    };

    const res = await fetch("http://<YOUR-VAST-IP>:7860/sdapi/v1/inpainting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const image_base64 = data.images[0];
    setOutputUrl(`data:image/png;base64,${image_base64}`);
  };

  return (
    <div className="App">
      <h2>Stable Diffusion Inpainting</h2>
      <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
      <input type="file" onChange={(e) => setMaskFile(e.target.files[0])} />
      <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleSubmit}>Generate</button>
      {outputUrl && <img src={outputUrl} alt="Output" />}
    </div>
  );
}

export default App;
