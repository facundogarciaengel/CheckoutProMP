import express from 'express';
import cors from 'cors';

//SDK de Mercado Pago
import {MercadoPagoConfig, Preference} from "mercadopago"; 

//Agrega credenciales
const client = new MercadoPagoConfig({
    accessToken: "APP_USR...", // Reemplaza con tu Access Token
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Soy el server :)");
});

app.post('/create_preference', async (req, res) => {
    try{
       const body = {
        items: [
            {
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.price),
                currency_id: "ARS",
            }, 
        ], 
        back_urls: { //Reemplaza con tus URLs de retorno
            success: "https://github.com/facundogarciaengel",
            failure:"https://github.com/facundogarciaengel",
            pending:"https://github.com/facundogarciaengel",
       },
       auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({body});
    res.json({
        id: result.id,
    });
} catch(error){
    console.log(error);
    res.status(500).json({
        message: "Error al crear la preferencia :(",
    });
}
});

app.listen(port, ()=> {
    console.log(`Servidor escuchando en el puerto ${port}`);
})