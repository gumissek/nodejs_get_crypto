// zrobic apke ktora pobiera ze strony kurs kryto jaki chcemy
// pierw wpisuje nazwe krypto jesli jej nie zna , klika ok i po tym uzupelnia mu inputa wyzej z symbolem https://www.npmjs.com/package/crypto-symbol
// jesli zna symbol klika ok i dostaje kurs etc https://api.blockchain.com/v3/?javascript#gettickerbysymbol
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import {cryptoSymbol} from 'crypto-symbol';

const app = express();
const port = 5001;
const {get} = cryptoSymbol({});
const cryptoDict = get().NSPair;
const cryptoURL ='https://api.coingecko.com/api/v3/coins/';
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));



app.get('/',(req,res)=>{

    res.render('index.ejs',{content:{text:'Type your crypto first.'}})
});

// app.post('/getName', async (req,res)=>{
//     let input = String(req.body.inPUT).trim();
//     input = input.slice(0,1).toUpperCase() + input.slice(1);

//     if (cryptoDict[`${input}`]!=undefined) {
//         res.render('index.ejs',{content:{text:cryptoDict[`${input}`]}});
//     } else {
//         res.render('index.ejs',{content:{text:'Check spelling'}});
//     }
// });

app.post('/getDetails',async (req,res)=>{
    let input = String(req.body.inPUT).trim().toLowerCase();
    let currency = String(req.body.currency);
    try {
        let response  = await axios.get(`${cryptoURL}${input}`);
        let result = response.data;
        let cryptoDetails ={
            currency:currency.toUpperCase(),
            symbol:String(result.symbol).toUpperCase(),
            name:result.name,
            image:result.image.large,
            genesis_date:result.genesis_date,
            description : result.description.en,
            market_data:{
                current_price :result.market_data.current_price[`${currency}`],
                ath :result.market_data.ath[`${currency}`],
                atl :result.market_data.atl[`${currency}`],
                high_24h :result.market_data.high_24h[`${currency}`],
                low_24h :result.market_data.low_24h[`${currency}`],
                price_change_24h_in_currency :result.market_data.price_change_24h_in_currency[`${currency}`],
                price_change_percentage_24h_in_currency :result.market_data.price_change_percentage_24h_in_currency[`${currency}`],
                info_date:String(result.last_updated).replace('Z','').split('T')[0]+' '+ String(result.last_updated).replace('Z','').split('T')[1].slice(0,5),

            }
        };

        res.render('index.ejs',{content:{
            cryptoDetails:cryptoDetails,
        }})

    } catch (error) {
        res.render('index.ejs',{content:{text:`There is no crypto with provided name: ${input}. Check spelling.`}})
    }

});

app.listen(port,()=>{
    console.log(`App is working on: http://localhost:${port}`)
});