const modalContainer = document.getElementById('modal-container');
const modalOverlay = document.getElementById('modal-overlay');

const cartBtn = document.getElementById('cart-btn');
const cartCounter = document.getElementById('cart-counter');

const displayCart = () => {
    modalContainer.innerHTML = ""; // Clear previous content
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";
    //Header modal
    const modalHeader = document.createElement('div');

    const modalClose = document.createElement('div');
    modalClose.innerText = '❌';
    modalClose.className = 'modal-close';
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", ()=> {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    })

    const modalTitle = document.createElement('div');
    modalTitle.innerText = "Cart";
    modalTitle.className = 'modal-title';
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);

    //modal Body 
    if( cart.length >0) {
    
    cart.forEach((product)=> {
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalBody.innerHTML = `
        <div class="product">
            <img class="product-img" src="${product.img}" />
            <div class="product-info">
                <h4>${product.productName}</h4>
            </div>
        <div class="quantity">
            <span class="quantity-btn-decrease">-</span>
            <span class="quantity-input">${product.quanty}</span>
            <span class="quantity-btn-increase">+</span>
        </div>
        <div class="price">${product.price * product.quanty}</div>
        <div class="delete-product">❌</div>
        </div>
        `;
        modalContainer.append(modalBody);
        const decrease = modalBody.querySelector('.quantity-btn-decrease');
        decrease.addEventListener("click", ()=> {
            if (product.quanty > 1) {
                product.quanty--;
                 displayCart();
            }   
            displayCartCounter();
        }); 

        const increase = modalBody.querySelector('.quantity-btn-increase');
        increase.addEventListener("click", ()=> {
            product.quanty++;
            displayCart();
            displayCartCounter();
        });

        //delete
        const deleteProduct = modalBody.querySelector('.delete-product');
        deleteProduct.addEventListener("click", () =>{
            deleteCartProduct(product.id);
        })
    });
   
    //modal Footer
    const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0);


    const modalFooter = document.createElement('div');
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
    <div class="total-price">Total: $${total}</div>
    <button class="btn-primary" id="checkout-btn">go to checkout</button>
    <div id="wallet_container"></div>
    `;
    modalContainer.append(modalFooter);

    //mp 
    //entre comillas pasar la public key creada desde la pagina de mercado pago
    const mp = new MercadoPago("APP_USER...", {
        locale: "es-AR",
    });

    //funcion que genera un titulo con la info del carrito: 25' 50''
    const generateCrtDescription = () => {
        return cart.map(product => `${product.productName} (x${product.quanty})`).join(', ');
    }; 

    document.getElementById("checkout-btn").addEventListener("click", async()=> {
        try{
            const orderData = {
                title: generateCrtDescription(),
                quantity: 1,
                price: total,
            }; 

            const response = await fetch("http://localhost:3000/create_preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify(orderData),
            }); 

            const preference =  await response.json(); //esoera respuesta del back
            createCheckoutButton(preference.id);
        } catch(error){
            alert("error :(");
        }
    });

    const createCheckoutButton = (preferenceId) => {
        const bricksBuilder = mp.bricks();

        const renderComponent = async () => {
            if(window.checkoutButton) window.checkoutButton.unmount();

            await bricksBuilder.create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId,
                },
            });
        };
        renderComponent();  
    }

} else {
    const modalText = document.createElement('h2');
    modalText.className = "modal-body";
    modalText.innerText = "Cart is empty";
    modalContainer.append(modalText);
}
} ;

 cartBtn.addEventListener("click", displayCart);

 const deleteCartProduct = (productId) => {
    const founId = cart.findIndex((element)=> element.id == productId);
    console.log(founId);
    if (founId !== -1) {
        cart.splice(founId, 1);
        displayCart();
        displayCartCounter();
    };      
 };

 const displayCartCounter = () => {

    const cartLength = cart.reduce((acc, el) => acc + el.quanty, 0);
    if(cartLength > 0){
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLength;
    }else{
        cartCounter.style.display = "none";
    }
    
 }
