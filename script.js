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

  let h = null;

  if (!isNaN(H) && !isNaN(D) && H > 0 && D > 0) {
    // Use object height and distance
    h = (H * L) / D;
  } else if (!isNaN(A) && A > 0) {
    // Use angular size in degrees
    const radians = A * Math.PI / 180;
    h = L * Math.tan(radians);
  } else {
    result.innerHTML = "Please enter object height and distance, or angular size.";
    return;
  }

  const hMM = h * 1000;
  result.innerHTML = `Projected Image Size: ${hMM.toFixed(1)} mm`;

  drawDiagram(D, H || 1, L, h); // fallback height if only angle is given
}
