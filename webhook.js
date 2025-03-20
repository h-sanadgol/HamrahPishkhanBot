require('dotenv').config()
const http = require('http')
const crypto = require('crypto')
const { exec } = require('child_process')

const SECRET = process.env.GITHUB_SECRET

const verifySignature = (req, body) => {
    const signature = `sha256=${crypto.createHmac('sha256', SECRET).update(body).digest('hex')}`
    return req.headers['x-hub-signature-256'] === signature
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/github-webhook') {
        let body = ''
        req.on('data', chunk => { body += chunk.toString() })
        req.on('end', () => {
            if (!verifySignature(req, body)) {
                res.writeHead(403)
                return res.end('Invalid signature')
            }
            exec('cd ~/telegram-bot && git pull origin main && npm install && pm2 restart my-bot', (err, stdout, stderr) => {
                if (err) console.error(stderr)
                else console.log(stdout)
            })
            res.writeHead(200)
            res.end('✅ Deploy started')
        })
    } else {
        res.writeHead(404)
        res.end()
    }
})

server.listen(3000, () => console.log('🚀 Webhook listener running on port 3000'))
