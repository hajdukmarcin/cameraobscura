function calculateSize() {
  const D = parseFloat(document.getElementById("distanceObject").value);
  const H = parseFloat(document.getElementById("objectHeight").value);
  const A = parseFloat(document.getElementById("angularSize").value);
  const L = parseFloat(document.getElementById("pinholeDistance").value);

  const result = document.getElementById("result");

  if (isNaN(L) || L <= 0) {
    result.innerHTML = "Please enter a valid screen distance (L).";
    return;
  }

  let hMeters = null;

  if (!isNaN(H) && !isNaN(D) && H > 0 && D > 0) {
    hMeters = H * L / D;
  } else if (!isNaN(A) && A > 0) {
    const radians = A * Math.PI / 180;
    hMeters = L * Math.tan(radians);
  } else {
    result.innerHTML = "Please enter object height and distance, or angular size.";
    return;
  }

  const hMM = (hMeters * 1000).toFixed(1);
  result.innerHTML = `Projected Image Size: ${hMM} mm`;

  drawDiagram(D, H || null, L, hMeters);
}

function drawDiagram(D, H, L, h) {
  const canvas = document.getElementById("diagram");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = 100;

  // Object on the left
  if (H) {
    ctx.fillStyle = "white";
    ctx.fillRect(50, canvas.height / 2 - H * scale / 2, 5, H * scale);
  }

  // Image on the right (inverted)
  ctx.fillStyle = "lime";
  ctx.fillRect(300, canvas.height / 2 + h * scale / 2, 5, -h * scale);

  // Pinhole in the center
  ctx.beginPath();
  ctx.arc(175, canvas.height / 2, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  // Draw light rays
  ctx.strokeStyle = "yellow";
  ctx.beginPath();
  if (H) {
    ctx.moveTo(50, canvas.height / 2 - H * scale / 2);
    ctx.lineTo(175, canvas.height / 2);
  }
  ctx.lineTo(300, canvas.height / 2 + h * scale / 2);
  ctx.stroke();
}
