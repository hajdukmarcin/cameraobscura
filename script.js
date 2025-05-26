function calculateSize() {
  const D = parseFloat(document.getElementById("distanceObject").value);
  const H = parseFloat(document.getElementById("objectHeight").value);
  const L = parseFloat(document.getElementById("pinholeDistance").value);

  const result = document.getElementById("result");

  if (isNaN(D) || isNaN(H) || isNaN(L) || D <= 0 || H <= 0 || L <= 0) {
    result.innerHTML = "Please enter valid positive numbers.";
    return;
  }

  const h = (H * L / D).toFixed(3);
  result.innerHTML = `Projected Image Size: ${h} meters`;

  drawDiagram(D, H, L, h);
}

function drawDiagram(D, H, L, h) {
  const canvas = document.getElementById("diagram");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = 100;

  // Draw object (left side)
  ctx.fillStyle = "white";
  ctx.fillRect(50, canvas.height / 2 - H * scale / 2, 5, H * scale);

  // Draw image (right side, upside down)
  ctx.fillStyle = "lime";
  ctx.fillRect(300, canvas.height / 2 + h * scale / 2, 5, -h * scale);

  // Draw pinhole (center)
  ctx.beginPath();
  ctx.arc(175, canvas.height / 2, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  // Connect lines
  ctx.strokeStyle = "yellow";
  ctx.beginPath();
  ctx.moveTo(50, canvas.height / 2 - H * scale / 2);
  ctx.lineTo(175, canvas.height / 2);
  ctx.lineTo(300, canvas.height / 2 + h * scale / 2);
  ctx.stroke();
}
