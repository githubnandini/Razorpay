const app = require('express')()
const Razorpay = require ('razorpay')
const shortid = require('shortid')
const cors = require('cors')
const bodyParser = require('body-parser')


app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
    key_id: 'rzp_test_LlwUdhQMPr1y3l',
    key_secret: '3LOHfs0Th5c2C708JCM2gYSx',
  });

  app.post('/verification', (req, res) => {
      const secret = '123456789'
      console.log(res.body)

      const crypto = require('crypto')

      const shasum = crypto.createHmac('sha256', secret)
      shasum.update(JSON.stringify(req.body))
      const digest = shasum.digest('hex')
      console.log(digest, req.headers['x-razorpay-signature'])

      if (digest === req.headers['x-razorpay-signature']) {
          console.log('request is legit')
          // process it
          require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
      } else {
          // pass it
      }
      
    res.send({ status : 'ok'})

  })
app.post('/razorpay', async (req, res) => {

const payment_capture = 1
const amount = 499
const currency = 'INR'
const options = {
    amount : amount*100, 
    currency, 
    receipt : shortid.generate(), 
    payment_capture
}
try {
    const response = await razorpay.orders.create(options)
    console.log(response)
    res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount
    })
} catch (error) {
    console.log(error)
}

})
app.listen(1337, () =>{
    console.log('Listening on 1337')
})