function generate() {
  const esophagus = document.getElementById("esophagus").value;
  const stomach = document.getElementById("stomach").value;
  const impression = document.getElementById("impression").value;

  const files = document.getElementById("images").files;

  let imagesHTML = "";

  for (let file of files) {
    const url = URL.createObjectURL(file);
    imagesHTML += `<img src="${url}" />`;
  }

  const html = `
    <h3>UPPER GI ENDOSCOPY REPORT</h3>

    <p><b>Esophagus:</b> ${esophagus}</p>
    <p><b>Stomach:</b> ${stomach}</p>
    <p><b>Impression:</b> ${impression}</p>

    <div class="image-container">
      ${imagesHTML}
    </div>
  `;

  document.getElementById("preview").innerHTML = html;
}