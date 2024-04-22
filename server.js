require('dotenv').config({ path: './config.env' });
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.APP_ENV !== 'production'
const hostname = process.env.HOSTNAME
const serverPort = process.env.SERVER_PORT

console.log("In dev mode", dev)

const app = next({ dev, hostname, serverPort })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            await handle(req, res, parsedUrl)

        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })
        .once('error', (err) => {
            console.error(err)
            process.exit(1)
        })
        .listen(serverPort, () => {
            console.log(`> Ready on http://${hostname}:${serverPort}`)
        })
})

const nodemailer = require('nodemailer');
const fs = require('fs');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

let htmlContents = {};
function ReadHtmlEmailTemplate() {
    let globalCss = fs.readFileSync('./resources/email/styles/global.css', 'utf8');

    htmlContents = {
        forgetPassword: fs.readFileSync('./resources/email/forgetPassword.html', 'utf8'),
        register: fs.readFileSync('./resources/email/register.html', 'utf8'),
    };
    for (let key in htmlContents) {
        htmlContents[key] = htmlContents[key].replace('/*{cssgoeshere}*/', globalCss);
        let placeholders = htmlContents[key].split(/(<!--{[^}]*}-->)/g);
        htmlContents[key] = placeholders.filter(chunk => !/<!--{[^}]*}-->/.test(chunk));
    }
}
ReadHtmlEmailTemplate()

const express = require('express');
const mailapp = express();
const port = 12345;

mailapp.use(express.json());
mailapp.use(express.urlencoded({ extended: false }));

mailapp.get('/read', (req, res) => {
    ReadHtmlEmailTemplate();
    return res.send({ status: 200, data: 'Email templates read' });
});
mailapp.post('/send', async (req, res) => {
    const { subject, to, type, content = []} = req.body || {};
    const key = req.headers['x-key'];

    if (key !== process.env.EMAIL_SECRET) {
        return res.send({ status: 401, data: 'Unauthorized' });
    }

    if (subject && to && type && htmlContents[type]) {

        let html = htmlContents[type].map((chunk, index) => {
            if (content[index]) {
                return chunk + content[index];
            }
            return chunk;
        }).join('');

        let mailOptions = {
            from: {
                name: `V# | do not reply`,
                address: 'no-reply@vshop.com'
            },
            to: to,
            subject: subject,
            html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return res.send({ status: 500, data: error });
            } else {
                console.log('Email sent: ' + info.response);
                return res.send({ status: 200, data: info.response });
            }
        });
    } else {
        return res.send({ status: 400, data: 'Invalid request' });
    }


});

mailapp.listen(port, () => {
    console.log(`Mail Server listening at http://localhost:${port}`);
});

