const token = localStorage.getItem("token");
const TopBarContainer = document.querySelector(".top-bar-container");
const ModalContainer = document.querySelector(".modal-container");
var worksList = [];
var categoriesList = [];

const generateFirstModal = () => {
  console.log("generateModale");
  console.log(worksList);

  const firstModal = document.createElement("div");
  firstModal.className = "modal";
  const firstModalContent = document.createElement("div");
  firstModalContent.className = "modal-content";
  const firstModalTitle = document.createElement("h3");
  firstModalTitle.innerHTML = "Galerie photo";
  firstModalTitle.className = "first-modal-title";
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "X";
  closeButton.className = "closeModal";
  closeButton.addEventListener("click", onCloseModal);
  const headerModal = document.createElement("div");
  headerModal.className = "headerModal";
  const figureContent = document.createElement("div");
  figureContent.className = "figureContent";
  const modalUnderline = document.createElement("div");
  modalUnderline.className = "modal-underline";
  const addButton = document.createElement("button");
  addButton.innerHTML = "Ajouter une photo";
  addButton.className = "add-button";
  addButton.addEventListener("click", generateSecondModal);
  firstModal.addEventListener("click", onCloseModal);
  firstModalContent.addEventListener("click", stopPropagation);
  headerModal.appendChild(firstModalTitle);
  headerModal.appendChild(closeButton);
  firstModalContent.appendChild(headerModal);
  firstModalContent.appendChild(figureContent);
  firstModalContent.appendChild(modalUnderline);
  firstModalContent.appendChild(addButton);
  firstModal.appendChild(firstModalContent);

  for (let i = 0; i < worksList.length; i++) {
    const work = worksList[i];
    const figure = document.createElement("figure");
    figure.className = "gallery-image-container";
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    const deleteButtonContainer = document.createElement("div");
    deleteButtonContainer.className = "delete-button-container";
    const Button = document.createElement("div");
    Button.className = "delete-button";
    const icon = document.createElement("i");
    icon.className = "fa-regular fa-trash-can";
    Button.appendChild(icon);
    Button.addEventListener("click", () => deleteWork(work.id));
    deleteButtonContainer.appendChild(Button);
    figure.appendChild(deleteButtonContainer);
    figure.appendChild(img);
    figureContent.appendChild(figure);
  }

  ModalContainer.appendChild(firstModal);
};

const deleteWork = (id) => {
  fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).then(async (response) => {
    if (response.ok) {
      await getWorks(0);
      await generateFirstModal();
    } else {
      console.log("erreur");
    }
  });
};

const onCloseModal = () => {
  //Pour supprimer ce qu'il y avait avant
  var child = ModalContainer.lastElementChild;
  while (child) {
    ModalContainer.removeChild(child);
    child = ModalContainer.lastElementChild;
  }
};

const generateSecondModal = () => {
  const secondModal = document.querySelector(".modal");
  const secondModalContent = document.querySelector(".modal-content");
  const secondModalTitle = document.createElement("h3");
  var child = secondModalContent.lastElementChild;
  while (child) {
    secondModalContent.removeChild(child);
    child = secondModalContent.lastElementChild;
  }
  secondModalTitle.innerHTML = "Ajout photo";
  secondModalTitle.className = "first-modal-title";
  const arrowLeftContainer = document.createElement("div");
  arrowLeftContainer.className = "arrow-left-container";
  const arrowLeft = document.createElement("div");
  arrowLeft.className = "arrow-left";
  const iconAwrrow = document.createElement("i");
  iconAwrrow.className = "fa-solid fa-arrow-left";
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "X";
  closeButton.className = "closeModal";
  closeButton.addEventListener("click", onCloseModal);
  const headerModal = document.createElement("div");
  headerModal.className = "headerModal";
  arrowLeftContainer.appendChild(arrowLeft);
  arrowLeft.appendChild(iconAwrrow);
  headerModal.appendChild(arrowLeft);
  headerModal.appendChild(secondModalTitle);
  headerModal.appendChild(closeButton);

  const form = document.createElement("form");
  form.className = "form example";
  const labelImage = document.createElement("label");
  labelImage.className = "labelImageContainer";
  labelImage.htmlFor = "image";
  const labelImageContent = document.createElement("div");
  labelImageContent.className = "labelImageContent";
  const imageLogo = document.createElement("i");
  imageLogo.className = "fa-light fa-image imageLogo";
  labelImageContent.appendChild(imageLogo);
  const fakeAddButton = document.createElement("div");
  fakeAddButton.innerHTML = "+ Ajouter photo";
  fakeAddButton.className = "fakeAddButton";
  labelImageContent.appendChild(fakeAddButton);
  const sizeText = document.createElement("p");
  sizeText.innerHTML = "jpg, png : 4mo max";
  labelImageContent.appendChild(sizeText);
  labelImage.appendChild(labelImageContent);
  const inputPhoto = document.createElement("input");
  inputPhoto.type = "file";
  inputPhoto.name = "image";
  inputPhoto.id = "image";
  inputPhoto.className = "inputPhoto displayNone";
  inputPhoto.required = true;
  const previewImg = document.createElement("img");
  previewImg.className = "displayNone";
  labelImage.appendChild(previewImg)

  inputPhoto.addEventListener("change", (evt) => {
    const [file] = inputPhoto.files;
    const size = inputPhoto.files[0].size;
    if (size > 4000000) {
      alert("image trop volumineuse");
    } else {
      if (file) {
        previewImg.className = "previewImg";
        labelImageContent.className = "displayNone";
        previewImg.src = URL.createObjectURL(file);
      }
    }
  });
  /*inputPhoto.onchange = e => {
    const [file] = inputPhoto.files
}**/
  const labelTitle = document.createElement("label");
  labelTitle.for = "title";
  labelTitle.innerHTML = "Titre";
  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.name = "title";
  inputTitle.className = "inputTitle";
  inputTitle.required = true;
  const labelCategory = document.createElement("label");
  labelCategory.for = "category";
  labelCategory.innerHTML = "Catégorie";
  labelCategory.className = "labelCategory";
  const selectCategory = document.createElement("select");
  for (let i = 0; i < categoriesList.length; i++) {
    let category = categoriesList[i];
    if (category.id > 0) {
      let option = document.createElement("option");
      option.value = category.id;
      option.innerHTML = category.name;
      selectCategory.appendChild(option);
    }
  }

  selectCategory.className = "selectCategory";

  const inputSubmit = document.createElement("button");
  inputSubmit.innerHTML = "Valider";
  inputSubmit.className = "add-button";
  inputSubmit.addEventListener("click", (e) => addWork(e));
  const modalUnderline = document.createElement("div");
  modalUnderline.className = "modal-underline";
  form.appendChild(labelImage);
  form.appendChild(inputPhoto);
  form.appendChild(labelTitle);
  form.appendChild(inputTitle);
  form.appendChild(labelCategory);
  form.appendChild(selectCategory);

  secondModalContent.appendChild(headerModal);
  secondModalContent.appendChild(form);
  secondModalContent.appendChild(modalUnderline);
  secondModalContent.appendChild(inputSubmit);
  secondModal.appendChild(secondModalContent);
  ModalContainer.appendChild(secondModal);
};

const addWork = (e) => {
  console.log(token);
  e.preventDefault();
  const category = document.querySelector(".selectCategory");
  const title = document.querySelector(".inputTitle");
  const image = document.querySelector(".inputPhoto");
  const formData = new FormData();
  formData.append("image", image.files[0]);
  console.log(image.files[0]);
  formData.append("title", title.value);
  console.log(title.value);
  formData.append("category", category.value);
  console.log(category.value);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });
};

const generateTopBar = () => {
  console.log("ok");
  const TopBar = document.createElement("div");
  TopBar.className = "top-bar";
  TopBar.innerHTML = "Mode édition";
  TopBarContainer.appendChild(TopBar);
};

const generateEditButton = () => {
  const editButtonContainer = document.querySelector(".edit-button-container");
  const editButton = document.createElement("button");
  editButton.innerHTML = "modifier";
  editButton.addEventListener("click", generateFirstModal);
  editButtonContainer.appendChild(editButton);
};

if (token) {
  generateTopBar();
  generateEditButton();
  /*document.querySelectorAll('.js-modal').forEach(a => {
        addEventListener('click', ModalContainer)
    })*/
  const loginHeader = document.querySelector(".loginHeader");
  loginHeader.innerHTML = "logout";
  const disconnect = () => {
    TopBarContainer.innerHTML = "";
    localStorage.removeItem("token");
    loginHeader.innerHTML = "";
    const a = document.createElement("a");
    a.innerHTML = "login";
    a.href = "login.html";
    loginHeader.appendChild(a);
  };
  loginHeader.addEventListener("click", disconnect);
}

const getCategories = async () => {
  console.log("getCategories");
  const res = await fetch("http://localhost:5678/api/categories");
  let categories = await res.json();
  categoriesList = categories;
  categories.push({
    id: 0,
    name: "Tous",
  });
  categories.sort((a, b) => a.id - b.id);
  console.log(categories);
  const filter = document.querySelector(".filters");
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const button = document.createElement("button");
    if (i === 0) {
      button.className = "button_active";
    } else {
      button.className = "filter-button";
    }

    button.addEventListener("click", () => getWorks(category.id));
    button.innerHTML = category.name;
    filter.appendChild(button);
  }
};

getCategories();

const getWorks = async (categoryId) => {
  console.log("refresh getWorks");
  console.log(categoryId);
  let categories = categoriesList;
  categories.sort((a, b) => a.id - b.id);
  console.log(categories);
  const filter = document.querySelector(".filters");
  filter.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const button = document.createElement("button");
    if (i === categoryId) {
      button.className = "button_active";
    } else {
      button.className = "filter-button";
    }

    button.addEventListener("click", () => getWorks(category.id));
    button.innerHTML = category.name;
    filter.appendChild(button);
  }

  const res = await fetch("http://localhost:5678/api/works");
  let works = await res.json();
  worksList = works;
  const gallery = document.querySelector(".gallery");
  //Pour supprimer ce qu'il y avait avant
  var child = gallery.lastElementChild;
  while (child) {
    gallery.removeChild(child);
    child = gallery.lastElementChild;
  }

  console.log(works);

  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const createWork = () => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
      const figcaption = document.createElement("figcaption");
      figcaption.innerHTML = work.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    };
    if (categoryId !== 0) {
      if (work.categoryId === categoryId) {
        createWork();
      }
    } else {
      createWork();
    }
  }
};
getWorks(0);
