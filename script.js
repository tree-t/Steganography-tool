
function encodeMessage() {
  const message = document.getElementById("message").value;
  const input = document.getElementById("encodeImageInput").files[0];
  if (!input || !message) return alert("Select image and enter message.");

  const reader = new FileReader();
  reader.onload = function () {
    const bytes = new Uint8Array(reader.result);
    const msgBytes = new TextEncoder().encode(message + "\0");
    if (msgBytes.length > bytes.length - 54) return alert("Image too small.");

    for (let i = 0; i < msgBytes.length; i++) {
      bytes[54 + i] = msgBytes[i];
    }

    const blob = new Blob([bytes], { type: "image/bmp" });
    const url = URL.createObjectURL(blob);
    const link = document.getElementById("downloadLink");
    link.href = url;
    link.download = "encoded.bmp";
    link.textContent = "Download Encoded Image";
    link.style.display = "inline-block";
  };
  reader.readAsArrayBuffer(input);
}

function decodeMessage() {
  const input = document.getElementById("decodeImageInput").files[0];
  if (!input) return alert("Select image.");

  const reader = new FileReader();
  reader.onload = function () {
    const bytes = new Uint8Array(reader.result);
    let chars = [];
    for (let i = 54; i < bytes.length; i++) {
      if (bytes[i] === 0) break;
      chars.push(bytes[i]);
    }
    const message = new TextDecoder().decode(new Uint8Array(chars));
    document.getElementById("decodedMessage").textContent = "Decoded: " + message;
  };
  reader.readAsArrayBuffer(input);
}
