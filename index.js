// 익스 프레스 모듈 갖고움
const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://sol:7515sol@boilar.wgutw.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false //에러 안뜨드록
}).then(()=>console.log('MongDB Connected...'))
    .catch(err=>console.log(err))

//류트디렉토리를 오면 저 문구가 실행 되도록
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 포트 오천번으로 시작
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
