const express = require('express')
const url = require('url')
const app = express()
const port = 4000

app.use(express.json())

const apis = []

// handling the save process
app.post('/', (req, res) => {
    const { builder, urlString } = req.body
    if (builder && builder === '1') {
        const { params } = req.body
        apis.push({
            endpoint: urlString,
            params
        })
    } else {
        const urlTmp = url.parse(urlString, true)
        const rawQuery = urlTmp.search
        const [, queryStr] = rawQuery.split('?')
        const params = []
        const rawParams = queryStr.split('&')
        rawParams.forEach((param) => {
            const [txt] = param.split('=')
            params.push(txt)
        })
        const endpoint = urlTmp.protocol + '//' + urlTmp.host + urlTmp.pathname
        apis.push({
            endpoint,
            params,
        })
    }
    res.json({ success: 1 })
})

app.get('/', (req, res) => {
    res.json(apis)
})

app.get('/:api', (req, res) => {
    const { api } = req.params
    const result  = apis[api]
    if (result) {
        res.status(200).json(result)
    } else {
        res.status(404).json({})
    }
})

app.listen(port, () => {
    console.log(`server listening: ${port}`)
})