const shopContent = document.getElementById('shopContent');
const cart = []

productos.forEach((producto)=>{
    const content = document.createElement('div'); //Por cada producto creamos un div
    content.className = 'card'; //Le asignamos una clase al div
    content.innerHTML = `
       <img src="${producto.img}">
       <h3>${producto.productName}</h3>
         <p>$${producto.price} $</p>
    `;
    shopContent.append(content); //Agregamos el div al contenedor

    const buyButton = document.createElement('button'); //Creamos un boton
    buyButton.innerText = 'Comprar'; //Le asignamos un texto al boton

    content.append(buyButton); //Agregamos el boton al div

    buyButton.addEventListener("click", () => {
      const repeat = cart.some((repeatProduct) => repeatProduct.id === producto.id);
      if(repeat){
        cart.map((prod) => {
          if(prod.id === producto.id){
            prod.quanty++;
            displayCartCounter();
          }
        })
      }else{
         cart.push({
         id: producto.id,
        productName: producto.productName,
        price: producto.price,
        quanty: producto.quanty,
        img: producto.img,
      });
        displayCartCounter();
      }
    });
});