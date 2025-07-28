require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pawgestor';

const { MercadoPagoConfig, Preference } = require('mercadopago');

const clientSchema = new mongoose.Schema({
    name: String,
    email: String,
    isPay: Boolean,
    namePetshop: String,
    createdAt: { type: Date, default: Date.now }
});



const SaleByCheckout = async ( ) => {
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });
    
    const preference = new Preference(client);
    
    const body = {
        items: [
            {
            id: '1234',
            title: 'Pré-venda do PawGestor',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: 175.00,
            },
        ]
    };


    return await preference.create({body}).then((response)=>{console.log(response); return response.init_point;});

    
};

app.post('/api/sale', async (req, res) => {
    const { name, email, namePetshop } = req.body;

    try {
        const client = new mongoose.model('Client', clientSchema);
        const newClient = new client({
            name,
            email,
            isPay: false,
            namePetshop
        });

        await newClient.save();
        const link =  await SaleByCheckout( );
        console.log(link)

        res.status(201).send(link);    
    } catch (error) {
        console.error('Erro ao criar venda:', error);
        res.status(500).send('Erro ao criar venda');
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Conectado ao MongoDB'))
        .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
});