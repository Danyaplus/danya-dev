
  const ADMIN_LOGIN = "danyaplus";
  const ADMIN_PASSWORD = "DanyaDev2026!";
  let selectedIcon = "🤖";
  let uploadedImage = "";
  let previewLang = "ru";

  function loginAdmin(){
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();

    if(login === ADMIN_LOGIN && password === ADMIN_PASSWORD){
      document.getElementById("loginError").classList.add("hidden");
      document.getElementById("password").value = "";
      document.getElementById("loginPanel").classList.add("hidden");
      document.getElementById("adminPanel").classList.remove("hidden");
      generateAll();
    }else{
      document.getElementById("loginError").classList.remove("hidden");
    }
  }

  function setPreset(icon, element){
    selectedIcon = icon;
    uploadedImage = "";
    document.getElementById("imageUpload").value = "";
    document.querySelectorAll(".preset").forEach(p => {p.classList.remove("active");p.setAttribute("aria-pressed","false");});
    element.classList.add("active");
    element.setAttribute("aria-pressed","true");
    updatePreview();
  }

  function loadImage(event){
    const file = event.target.files[0];
    if(!file) return;
    if(!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type)){alert("Выберите PNG, JPEG, WebP, GIF или AVIF.");event.target.value="";return;}
    if(file.size>2*1024*1024){alert("Максимальный размер — 2 МБ.");event.target.value="";return;}

    const reader = new FileReader();
    reader.onload = function(e){
      uploadedImage = e.target.result;
      updatePreview();
    }
    reader.readAsDataURL(file);
  }

  function esc(text){
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function setPreviewLang(lang){
    previewLang = lang;
    document.querySelectorAll(".preview-lang").forEach(button => {
      button.classList.toggle("active", button.dataset.previewLang === lang);
    });
    updatePreview();
  }

  function updatePreview(){
    const placeholders = {
      ru: { category: "Категория", title: "Заголовок статьи", description: "Короткое описание статьи.", button: "Читать больше" },
      ua: { category: "Категорія", title: "Заголовок статті", description: "Короткий опис статті.", button: "Читати більше" },
      en: { category: "Category", title: "Article title", description: "Short article description.", button: "Read more" }
    };

    const category = document.getElementById(previewLang + "Category").value || placeholders[previewLang].category;
    const title = document.getElementById(previewLang + "Title").value || placeholders[previewLang].title;
    const description = document.getElementById(previewLang + "Description").value || placeholders[previewLang].description;
    const link = safeLink(document.getElementById("link").value);

    document.getElementById("previewCategory").textContent = category;
    document.getElementById("previewTitle").textContent = title;
    document.getElementById("previewDescription").textContent = description;
    document.getElementById("previewLink").href = link;
    document.getElementById("previewLink").textContent = placeholders[previewLang].button;

    const image = document.getElementById("previewImage");
    if(uploadedImage){
      image.textContent = "";
      image.style.backgroundImage = `url(${uploadedImage})`;
    }else{
      image.textContent = selectedIcon;
      image.style.backgroundImage = "";
    }
  }

  function makeCard(category, title, description, link, buttonText){
    let imageBlock = "";

    if(uploadedImage){
      imageBlock = `<div class="article-image" style="background-image:url('${uploadedImage}');background-size:cover;background-position:center;"></div>`;
    }else{
      imageBlock = `<div class="article-image">${selectedIcon}</div>`;
    }

    return `<article class="article">
  ${imageBlock}
  <small>${esc(category)}</small>
  <h3>${esc(title)}</h3>
  <p>${esc(description)}</p>
  <a class="read-more" href="${esc(link)}" target="_blank" rel="noopener noreferrer">${buttonText}</a>
</article>`;
  }

  function generateAll(){
    updatePreview();

    const link = safeLink(document.getElementById("link").value);

    const ru = makeCard(
      document.getElementById("ruCategory").value,
      document.getElementById("ruTitle").value,
      document.getElementById("ruDescription").value,
      link,
      "Читать больше"
    );

    const ua = makeCard(
      document.getElementById("uaCategory").value,
      document.getElementById("uaTitle").value,
      document.getElementById("uaDescription").value,
      link,
      "Читати більше"
    );

    const en = makeCard(
      document.getElementById("enCategory").value,
      document.getElementById("enTitle").value,
      document.getElementById("enDescription").value,
      link,
      "Read more"
    );

    document.getElementById("ruCode").value = ru;
    document.getElementById("uaCode").value = ua;
    document.getElementById("enCode").value = en;
  }

  async function copyOne(id){
    generateAll();
    if(!await copyText(document.getElementById(id).value))return;
    showCopied();
  }

  async function copyAll(){
    generateAll();

    const all = `=== index.html / RU ===

${document.getElementById("ruCode").value}

=== frontend/locales/ua/index.html / UA ===

${document.getElementById("uaCode").value}

=== frontend/locales/en/index.html / EN ===

${document.getElementById("enCode").value}`;

    if(!await copyText(all))return;
    showCopied();
  }

  function showCopied(){
    document.getElementById("copyStatus").classList.remove("hidden");
    setTimeout(() => document.getElementById("copyStatus").classList.add("hidden"), 1800);
  }

  function resetForm(){
    document.getElementById("link").value = "";

    document.getElementById("ruCategory").value = "";
    document.getElementById("ruTitle").value = "";
    document.getElementById("ruDescription").value = "";

    document.getElementById("uaCategory").value = "";
    document.getElementById("uaTitle").value = "";
    document.getElementById("uaDescription").value = "";

    document.getElementById("enCategory").value = "";
    document.getElementById("enTitle").value = "";
    document.getElementById("enDescription").value = "";

    uploadedImage = "";
    selectedIcon = "🤖";
    document.querySelectorAll(".preset").forEach((p,i)=>{p.classList.toggle("active",i===0);p.setAttribute("aria-pressed",String(i===0));});
    document.getElementById("imageUpload").value = "";
    updatePreview();
    generateAll();
  }

  updatePreview();

function safeLink(value){try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:'#';}catch{return '#';}}
function logoutAdmin(){document.getElementById('adminPanel').classList.add('hidden');document.getElementById('loginPanel').classList.remove('hidden');document.getElementById('login').focus();}
async function copyText(text){try{await navigator.clipboard.writeText(text);return true;}catch{const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();let ok=false;try{ok=document.execCommand('copy');}catch{}area.remove();if(!ok)alert('Не удалось скопировать автоматически. Выделите код вручную.');return ok;}}
document.getElementById('loginPanel').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();loginAdmin();}});
