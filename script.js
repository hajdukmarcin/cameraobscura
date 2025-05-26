function calculateSize() {
  const D = parseFloat(document.getElementById("distanceObject").value);
  const H = parseFloat(document.getElementById("objectHeight").value);
  const A = parseFloat(document.getElementById("angularSize").value);
  const L = parseFloat(document.getElementById("pinholeDistance").value);
  const d_input = parseFloat(document.getElementById("pinholeDiameter").value);

  const result = document.getElementById("result");
  result.innerHTML = "";

  if (isNaN(L) || L <= 0) {
    result.innerHTML = "❗ Please enter a valid pinhole-to-screen distance (L).";
    return;
  }

  let h = null;
  let label = "";

  if (!isNaN(H) && !isNaN(D) && H > 0 && D > 0) {
    h = (H * L) / D;
    label = `Using object height H = ${H} m and distance D = ${D} m`;
  } else if (!isNaN(A) && A > 0) {
    const radians = A * Math.PI / 180;
    h = L * Math.tan(radians);
    label = `Using angular size = ${A}°`;
  } else {
    result.innerHTML = "❗ Please enter either: (1) object height and distance OR (2) angular size.";
    return;
  }

  const hMM = h * 1000;
  result.innerHTML = `📏 Projected Image Size: <strong>${hMM.toFixed(1)} mm</strong><br/><small>${label}</small>`;

  const lambda = 5.5e-7; // green light
  const d_optimal = 1.9 * Math.sqrt(lambda * L);
  let diffractionWarning = "";
  let diffractionSizeMM = null;

  if (!isNaN(d_input) && d_input > 0) {
    const d = d_input / 1000;
    const diffractionBlur = 2.44 * lambda * L / d;
    diffractionSizeMM = diffractionBlur * 1000;

    if (d < 0.5 * d_optimal) {
      diffractionWarning = `<br/><span style="color:red;">⚠️ Diffraction likely affects image sharpness.<br/>Diffraction blur ≈ ${diffractionSizeMM.toFixed(2)} mm</span>`;
    } else if (d > 2 * d_optimal) {
      diffractionWarning = `<br/><span style="color:orange;">⚠️ Image may be blurred from geometric effects.<br/>Diffraction blur ≈ ${diffractionSizeMM.toFixed(2)} mm</span>`;
    } else {
      diffractionWarning = `<br/><span style="color:green;">✅ Pinhole size near optimal.<br/>Diffraction blur ≈ ${diffractionSizeMM.toFixed(2)} mm</span>`;
    }
  }

  result.innerHTML += diffractionWarning;
  drawDiagram(L, h, diffractionSizeMM);
}

function drawDiagram(L, h, diffractionSizeMM) {
  const canvas = document.getElementById("diagram");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = 1000; // 1 m = 1000 px
  const centerX = 50;
  const screenX = centerX + L * scale;
  const imgH = h * scale;

  // Draw object (left)
  ctx.fillStyle = "black";
  ctx.fillRect(centerX - 5, canvas.height / 2 - imgH / 2, 5, imgH);
  ctx.fillText("Object", centerX - 35, canvas.height / 2);

  // Rays to screen
  ctx.beginPath();
  ctx.moveTo(centerX, canvas.height / 2 - imgH / 2);
  ctx.lineTo(screenX, canvas.height / 2);
  ctx.lineTo(centerX, canvas.height / 2 + imgH / 2);
  ctx.strokeStyle = "#007acc";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw screen
  ctx.beginPath();
  ctx.moveTo(screenX, canvas.height / 2 - imgH / 2 - 10);
  ctx.lineTo(screenX, canvas.height / 2 + imgH / 2 + 10);
  ctx.strokeStyle = "#666";
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "black";
  ctx.fillText("Screen", screenX + 10, canvas.height / 2);

  // Draw image (inverted)
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(screenX, canvas.height / 2 - imgH / 2, 5, imgH);

  // Diffraction blur circle
  if (diffractionSizeMM) {
    const blurH = (diffractionSizeMM / 1000) * scale;
    ctx.beginPath();
    ctx.ellipse(screenX + 15, canvas.height / 2, 0.5 * blurH, 0.5 * blurH, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.fillText("Diffraction blur", screenX + 25, canvas.height / 2 + 4);
  }

  // Pinhole
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(centerX, canvas.height / 2, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText("Pinhole", centerX - 15, canvas.height / 2 + 15);
}
