
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

  // Diffraction check
  const lambda = 5.5e-7; // 550 nm (green light)
  const d_optimal = 1.9 * Math.sqrt(lambda * L);
  let diffractionWarning = "";

  if (!isNaN(d_input) && d_input > 0) {
    const d = d_input / 1000;
    if (d < 0.5 * d_optimal) {
      diffractionWarning = "<br/><span style='color:red;'>⚠️ Diffraction likely affects image sharpness (pinhole too small).</span>";
    } else if (d > 2 * d_optimal) {
      diffractionWarning = "<br/><span style='color:orange;'>⚠️ Image may be blurred from geometric effects (pinhole too large).</span>";
    } else {
      diffractionWarning = "<br/><span style='color:green;'>✅ Pinhole size is near optimal for sharpness.</span>";
    }
  }

  result.innerHTML += diffractionWarning;
  drawDiagram(L, h);
}

function drawDiagram(L, h) {
  const canvas = document.getElementById("diagram");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = 1000;
  const centerX = 50;
  const screenX = centerX + L * scale;
  const imageHeight = h * scale;

  ctx.beginPath();
  ctx.moveTo(centerX, canvas.height / 2 - imageHeight / 2);
  ctx.lineTo(screenX, canvas.height / 2);
  ctx.lineTo(centerX, canvas.height / 2 + imageHeight / 2);
  ctx.strokeStyle = "#007acc";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(screenX, canvas.height / 2 - imageHeight / 2);
  ctx.lineTo(screenX, canvas.height / 2 + imageHeight / 2);
  ctx.strokeStyle = "#999";
  ctx.setLineDash([5, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";
  ctx.fillText("Screen", screenX + 5, canvas.height / 2);
}
