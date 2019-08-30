class Product {
  constructor(title, image, description, price) {
    this.title = title;
    this.image = image;
    this.description = description;
    this.price = price;
  }
}

class Cart {
  constructor(items) {
    this.items = items || [];
    this.cart = document.querySelector(".cart");
  }

  checkExistsProduct(title) {
    var flag = false;
    this.items.forEach(item => {
      if (item.details.title == title) {
        flag = true;
      }
    });
    return flag;
  }
  addItem(item) {
    if (this.checkExistsProduct(item.title)) {
      var cartTitles = document.querySelectorAll(".cart-item .cart-item-title");
      console.log(cartTitles);
      var i = 0;
      var flag = false;
      while (i < cartTitles.length && !flag) {
        if (cartTitles[i].innerText == item.title) {
          let cartItem = cartTitles[i].closest(".cart-item");
          let quantityValue = Number(
            cartItem.querySelector(".input-cart-item-quantity").value
          );
          flag = true;
          this.items.find(i => i.details.title == item.title).quantity =
            quantityValue + 1;
        }
        i++;
      }
    } else {
      this.items.push({
        details: item,
        quantity: 1
      });
    }
    this.render();
  }

  removeItem(itemTitle) {
    this.items = this.items.filter(i => i.details.title != itemTitle);
    let amount = document.getElementById("amount-items");
    amount.innerText = Number(amount.innerText) - 1;
    updateButtonProduct(itemTitle);
    this.render();
  }

  render() {
    this.cart.innerHTML = "";
    this.items.forEach(item => {
      let article = document.createElement("ARTICLE");
      article.classList.add("cart-item");
      let total = item.quantity * item.details.price;
      let itemHTML = `
            <img class="cart-item-image" src=${item.details.image} />
            <div class="cart-item-title">${item.details.title}</div>
            <span><strong>PRICE</strong></span>
            <div class="cart-item-price">$${item.details.price}</div>
            <span><strong>AMOUNT</strong></span>
            <div class="cart-item-quantity"><input class="input-cart-item-quantity" 
             type="number" min="1" value="${item.quantity}" required /></div>
             <span><strong>SUBTOTAL</strong></span>
            <div class="cart-item-total">$${total}</div>
            <button class="btn btn-danger btn-block"><i class="fas fa-trash-alt"></i></button>
        `;
      article.innerHTML = itemHTML;
      this.cart.append(article);
    });
    this.updateRemoveListener();
    this.updateInputsOnChange();
    this.updateTotal();
  }

  updateTotal() {
    const total = this.getTotal();
    const totalID = document.getElementById("total");
    const totalHTML = `
            <span>TOTAL</span>
            <div class="cart-total-price">$${total}</div>
        `;
    totalID.innerHTML = totalHTML;
  }
  getTotal() {
    var total = 0;
    this.items.forEach(item => {
      total += item.details.price * item.quantity;
    });
    return total;
  }

  updateItemQuantity(itemTitle, value = 1) {
    this.items.forEach(i => {
      if (itemTitle == i.details.title) {
        i.quantity = value;
      }
    });
  }

  updateInputsOnChange() {
    var inputValue = document.querySelectorAll(".input-cart-item-quantity");
    for (let input of inputValue) {
      input.addEventListener("change", e => {
        let itemCart = e.target.closest(".cart-item");
        let value = e.target.value;
        this.updateItemQuantity(
          itemCart.querySelector(".cart-item-title").innerText,
          value
        );
        this.updateTotal();
        let total = itemCart.querySelector(".cart-item-total");
        total.innerText = "$".concat(
          itemCart
            .querySelector(".cart-item-price")
            .innerText.replace(/[^0-9\.]+/g, "") * value
        );
      });
    }
  }

  updateRemoveListener() {
    const removeItemFromCart = document.querySelectorAll(
      ".cart-item .btn-danger"
    );
    for (let button of removeItemFromCart) {
      button.onclick = e => {
        var productElement = e.target.closest(".cart-item");
        this.removeItem(
          productElement.querySelector(".cart-item-title").innerText
        );
      };
    }
  }
}
const cart = new Cart();
cart.render();

const addToCartButtons = document.querySelectorAll(".product .btn-success");

for (let button of addToCartButtons) {
  button.addEventListener("click", e => {
    var productElement = button.closest(".product");
    if (button.classList.contains("btn-success")) {
      addItem(productElement);
      let amount = document.getElementById("amount-items");
      amount.innerText = Number(amount.innerText) + 1;
      changeClassButton(e.currentTarget);
    } else {
      removeItem(productElement);
    }
  });
}

function changeClassButton(button) {
  if (button.classList.contains("btn-success")) {
    button.classList.remove("btn-success");
    button.classList.add("btn-danger");
    button.children[0].innerText = "QUIT TO CART";
  } else {
    button.classList.remove("btn-danger");
    button.classList.add("btn-success");
    button.children[0].innerText = "ADD TO CART";
  }
}

function addItem(productElement) {
  cart.addItem(
    new Product(
      productElement.querySelector(".product-title").innerText,
      productElement.querySelector(".product-image").src,
      productElement.querySelector(".product-description").innerText,
      productElement
        .querySelector(".product-price")
        .innerText.replace(/[^0-9\.]+/g, "")
    )
  );
}

function updateButtonProduct(productTitle) {
  const buttons = document.querySelectorAll(".product button.btn-danger");
  buttons.forEach(button => {
    let product = button.closest(".product");
    let title = product.querySelector(".product-title").innerText;
    if (title == productTitle) changeClassButton(button);
  });
}
function removeItem(productElement) {
  cart.removeItem(productElement.querySelector(".product-title").innerText);
}
