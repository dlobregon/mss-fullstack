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
        const urlTmp = url.parse(urlString, true)
        const urlObject = {
            protocol: urlTmp.protocol,
            hostname: urlTmp.hostname,
            port: urlTmp.port,
            pathname: urlTmp.pathname,
            hash: urlTmp.hash
        }
        apis.push({
            urlObject,
            params
        })
    } else {
        const urlTmp = url.parse(urlString, true)
        const qParams = urlTmp.query
        const params = Object.keys(qParams)
        const urlObject = {
            protocol: urlTmp.protocol,
            hostname: urlTmp.hostname,
            port: urlTmp.port,
            pathname: urlTmp.pathname,
            hash: urlTmp.hash
        }
        apis.push({
            urlObject,
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
    const result = apis[api]
    if (result) {
        res.status(200).json(result)
    } else {
        res.status(404).json({})
    }
})

// function to execute the value from saved endpoints
app.patch('/:api', async (req, res) => {
    const { api } = req.params
    const apiTmp = apis[api]
    if (apiTmp) {
        const userParam = req.body
        const query = apiTmp.params.reduce((result, param) => {
            result[param] = userParam[param]
            return result
        }, {})
        const urlObject = apiTmp.urlObject
        urlObject.query = query
        const myUrl = url.format(urlObject)
        let response = await fetch(myUrl)
        if (response.ok) {
            let body = await response.json()
            res.status(200).json({ body })
        } else {
            res.sendStatus(response.status)
        }
    } else {
        res.status(404).json({})
    }
})

app.listen(port, () => {
    console.log(`server listening: ${port}`)
})