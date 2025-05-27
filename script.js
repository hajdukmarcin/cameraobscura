function calculateSize() {
  const D = parseFloat(document.getElementById('distanceObject').value); // object distance
  const H = parseFloat(document.getElementById('objectHeight').value);   // object height
  const thetaDeg = parseFloat(document.getElementById('angularSize').value); // angular size
  const L = parseFloat(document.getElementById('pinholeDistance').value);   // pinhole to screen
  const d_mm = parseFloat(document.getElementById('pinholeDiameter').value); // pinhole diameter in mm

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (isNaN(L) || isNaN(d_mm)) {
    resultDiv.innerHTML = 'Wprowadź wartości dla odległości od ekranu i średnicy apertury.';
    return;
  }

  const d = d_mm / 1000; // convert mm to meters
  const lambda = 550e-9; // green light wavelength

  let imageHeight = 0;
  let angularUsed = false;

  if (!isNaN(H) && !isNaN(D)) {
    imageHeight = (H * L) / D;
  } else if (!isNaN(thetaDeg)) {
    const thetaRad = (thetaDeg * Math.PI) / 180;
    imageHeight = 2 * L * Math.tan(thetaRad / 2);
    angularUsed = true;
  } else {
    resultDiv.innerHTML = 'Wprowadź wysokość obiektu i odległość, lub kąt widzenia.';
    return;
  }

  const diffractionAngle = 1.22 * (lambda / d);
  const diffractionSpot = L * diffractionAngle;

  resultDiv.innerHTML = `
    <strong>Wyniki:</strong><br />
    Wysokość obrazu: <strong>${(imageHeight * 100).toFixed(2)} cm</strong><br />
    Ograniczenie rozdzielczości przez dyfrakcję: <strong>${(diffractionSpot * 1000).toFixed(2)} mm</strong><br />
    (Najmniejszy rozróżnialny szczegół na ekranie)
  `;

  drawDiagram(D, H, thetaDeg, L, imageHeight, angularUsed);
}

function drawDiagram(D, H, thetaDeg, L, imageHeight, angularUsed) {
  const canvas = document.getElementById('diagram');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height - 40;
  const scale = 100;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - L * scale);
  ctx.strokeStyle = '#000';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.fillText('Pinhole', cx + 6, cy);

  const screenY = cy - L * scale;
  const imageHalf = (imageHeight * scale) / 2;
  ctx.beginPath();
  ctx.moveTo(cx - imageHalf, screenY);
  ctx.lineTo(cx + imageHalf, screenY);
  ctx.strokeStyle = 'blue';
  ctx.stroke();
  ctx.fillText('Obraz', cx + imageHalf + 6, screenY + 4);

  // Rays
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - imageHalf, screenY);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + imageHalf, screenY);
  ctx.strokeStyle = 'gray';
  ctx.setLineDash([5, 3]);
  ctx.stroke();
  ctx.setLineDash([]);
}
