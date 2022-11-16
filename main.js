class Product {
    constructor(id, name, price, state, photo){
        this.id = id,
        this.name = name,
        this.price = price,
        this.state = state,
        this.photo = photo

    }
}

let allProducts = []
const loadProducts = async() =>{
    const response = await fetch("./products.json")
    const data = await response.json()
    for (let product of data){
        let productNew = new Product(product.id, product.name, product.price, product.state, product.photo)
        allProducts.push(productNew)
    }
    localStorage.setItem("allProducts", JSON.stringify(allProducts))
}
loadProducts()

let productsSection = document.getElementById("shop-content")
//mostrar los productos en el DOM
function showCatalog(array){
    
    productsSection.innerHTML = ""
    array.forEach((product)=>{
        let addedProduct = document.createElement("div")
        addedProduct.innerHTML = `<div class="products">
            <img src ="${product.photo}" class= "products-img">
            <h3 class="product-name">${product.name}</h3>
            <p class="${product.state == "New" ? "newProduct" : "noNew"}">${product.state}</p>
            <span class="price">$ ${product.price}</span>
            <button type="button" id="addBtn${product.id}" class="btn btn-outline-dark"><i class='bx bx-cart-add'></i></button>
            </div>`
        productsSection.append(addedProduct)

        let addBtn = document.getElementById(`addBtn${product.id}`)
        addBtn.addEventListener("click", ()=>{
            addToCart(product)
            
        })
    })
}

let productsInCart = JSON.parse(localStorage.getItem("cart")) || []

//añadir los productos al carro
function addToCart(product){
    productsInCart.push(product)
    
    localStorage.setItem("cart", JSON.stringify(productsInCart))
    Swal.fire({
        title: "Your product has been added successfully!",
        icon: "success",
        confirmButtonText : "OK",
        confirmButtonColor : "chartreuse",
        timer: 3000,
        text: `${product.name} with value of $${product.price} has been added to yout cart`,
        imageUrl: `${product.photo}`,
        imageHeight: 400,
        imageWidth: 400, 
        
    })
}

let li = JSON.parse(localStorage.getItem('allProducts'))
showCatalog(li)

//cuerpo del carrito
let shoppingCart = document.getElementById("shoppingCart")
let cartContainer = document.getElementsByClassName("modal-body")
let btnBuy = document.getElementById("buyNow")
let total = document.getElementById("total-text")

shoppingCart.addEventListener("click", () =>{
    console.log(productsInCart)
    moveProductsToCart(productsInCart)
})
function moveProductsToCart(array) {
    
    cartContainer.innerHTML =  ""
    array.forEach((productInCart)=>{
        cartContainer.innerHTML = `
        <div class="productInCar">
        <div class="productCar" id="${productInCart.id}">
            <img src="${productInCart.photo}" class="cart-img">
            <div class="detail-box">
                <div class="productCar-name">${productInCart.name}</div>
                    <div class="productCar-price">$${productInCart.price}</div>
                        
                </div>
                <button type="button" class="btn btn-dark"><i class='bx bxs-trash-alt cart-remove'></i></button>

            </div>
        </div>

`
    })
    
    totalShopping(array)
}


let totalPrice = document.getElementsByClassName("total-price")
function totalShopping (array) {
    let counter = 0

    counter = array.reduce((counter, productInCart)=>{
        return counter + productInCart.price 
    }, 0) 

counter == 0 ? total.innerHTML = `<strong>There are no products in your cart yet!</strong>` : total.innerHTML = `<strong> $${counter}</strong>` 
}


//sección de comentarios


const toWriteIn = document.querySelector('#commentArea');
const commentsSection = document.querySelector('#allComments');
let comments = []

const saveChanges = () => {
    localStorage.setItem('comments', JSON.stringify(comments));
}
const deleteWritten = (id) => {
    comments = comments.filter(comment => comment.id !== id);
    addToTheDOM();
}


const cleanText = () => {
    commentsSection.innerHTML = ""
}

const eventListeners = () => {
    
    toWriteIn.addEventListener('submit', addNewComment);
    
    document.addEventListener('DOMContentLoaded', () => {
        
        comments = JSON.parse(localStorage.getItem('comments')) || []; 

        addToTheDOM();
    });
}

const addNewComment = (e) => {
    e.preventDefault();
    
    
    const comment = document.querySelector('#comment').value;
    
  
    if(comment === '') {
        showError('There´s nothing written yet');
        return; 
    }

    const commentD = {
        id: Date.now(),
        comment 
    }

    comments.push(commentD)
    
    addToTheDOM();
    toWriteIn.reset();
}


function showError () {
  Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text: 'You should type something before adding!',
})
}


const addToTheDOM = () => {
    
    cleanText();
    
    if(comments.length > 0) {
        comments.forEach(comment => {
         
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.textContent = 'X';
         
            deleteButton.onclick = () => {
                Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire(
      'Deleted!',
      'Your comment has been deleted.',
      'success'
    )
    deleteWritten(comment.id);
  }
})

    

                
            }
         
            const div = document.createElement('div');
            let username = document.getElementById("inputUsername")
            
            div.innerHTML = `
    <article class="testimony__item">
      <div class="testimony__person">
        <img src="https://i.pinimg.com/736x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg" class="testimony__img">
        <div class="testimony__text">
          <h3 class="testimony__name">${username.value}</h3>
          <p class="testimony__verification">User</p>
        </div>
      </div>
      <p class="testimony__review">${comment.comment}</p>
      <br>
      <br>
    </article>
    `
            
            div.appendChild(deleteButton);
   
            commentsSection.appendChild(div);

        });
    }
    saveChanges();
}

eventListeners();



//confirmación de registro
let username = document.getElementById("inputUsername")
let password = document.getElementById("inputPassword")
let passwordConfirmation = document.getElementById("passwordConfirm")
let signBtn = document.querySelector(".signUp")

let account = false

signBtn.addEventListener("click", () =>{
    if (username.value != "" && password.value != "" && passwordConfirmation != "") {
    account = true
}else {
    showError()
};


if (account) {
    const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

Toast.fire({
  icon: 'success',
  title: 'Signed in successfully, welcome ' + username.value
})
}else {
    showError()
};

function showError(){
    Swal.fire({
        title: "An error has ocurred while loging account",
        icon: "error",
        confirmButtonText : "OK",
        confirmButtonColor : "chartreuse",
        timer: 3000, 
    })
}
})


