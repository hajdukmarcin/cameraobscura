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

  // Ograniczenie dyfrakcyjne
  const diffractionAngle = 1.22 * (lambda / d);
  const diffractionSpot = L * diffractionAngle;

  // Ograniczenie geometryczne (rozmiar apertury)
  let geometricalSpot = NaN;
  if (!angularUsed && !isNaN(D) && D !== 0) {
    geometricalSpot = d * (L / D);  // metry
  }

  resultDiv.innerHTML = `
    <strong>Wyniki:</strong><br />
    Wielkość obrazu (S): <strong>${(imageHeight * 100).toFixed(2)} cm</strong><br />
    Ograniczenie rozdzielczości przez dyfrakcję: <strong>${(diffractionSpot * 1000).toFixed(2)} mm</strong><br />
    ${!isNaN(geometricalSpot) ? `Ograniczenie geometryczne (rozmycie apertury): <strong>${(geometricalSpot * 1000).toFixed(2)} mm</strong><br />` : ''}
  `;

  drawDiagram(D, H, thetaDeg, L, imageHeight, angularUsed, diffractionSpot, geometricalSpot);
}

function drawDiagram(D, H, thetaDeg, L, imageHeight, angularUsed, diffractionSpot, geometricalSpot) {
  const canvas = document.getElementById('diagram');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height - 40;
  const scale = 100;

  // Linia apertury (pinhole)
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

  // Ekran (obraz)
  const screenY = cy - L * scale;
  const imageHalf = (imageHeight * scale) / 2;
  ctx.beginPath();
  ctx.moveTo(cx - imageHalf, screenY);
  ctx.lineTo(cx + imageHalf, screenY);
  ctx.strokeStyle = 'blue';
  ctx.stroke();
  ctx.fillText('Obraz', cx + imageHalf + 6, screenY + 4);

  // Promienie od pinhole do obrazu
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - imageHalf, screenY);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + imageHalf, screenY);
  ctx.strokeStyle = 'gray';
  ctx.setLineDash([5, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Pokazanie ograniczeń rozdzielczości na ekranie
  // Skala na mm (1 px ~ 1 mm na ekranie)
  const diffractionPx = diffractionSpot * 1000; // w mm
  const geomPx = geometricalSpot * 1000; // w mm

  // Linie ograniczenia dyfrakcyjnego
  ctx.beginPath();
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.moveTo(cx + imageHalf + 20, screenY - diffractionPx / 2);
  ctx.lineTo(cx + imageHalf + 20, screenY + diffractionPx / 2);
  ctx.stroke();
  ctx.fillStyle = 'red';
  ctx.fillText('Dyfrakcja', cx + imageHalf + 25, screenY);

  // Linie ograniczenia geometrycznego, jeśli dostępne
  if (!isNaN(geomPx)) {
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.moveTo(cx + imageHalf + 40, screenY - geomPx / 2);
    ctx.lineTo(cx + imageHalf + 40, screenY + geomPx / 2);
    ctx.stroke();
    ctx.fillStyle = 'green';
    ctx.fillText('Geometryczne', cx + imageHalf + 45, screenY);
  }

  // Reset lineWidth and fillStyle
  ctx.lineWidth = 1;
  ctx.fillStyle = 'black';
}
