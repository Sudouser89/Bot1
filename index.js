var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello , I am Echo bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'echobot') {
        res.send(req.query['hub.challenge'])
        console.log('Success, Challenge loop crossed')
    }else{
    res.send('Error, wrong token')
    }
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// API End Point - added by Stefan

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'echo') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Echo: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender,"Echo: "+ text.substring(12, 188), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAACrYOwZBr6sBAGnq957KmNa90CyxT4eSxwM94U44xAvC2NKtmdOw4pt35yn4KEimQUGBZBwARlX5OGD6ht6kCZBdFS8jamVjComAkVrctCCp2yZBBnW442qZAWpqCMqo7hVvwc0Gsn8R9D5Revny46CoOeAkL2LawxxZCFK0cSQZDZD"


// function to echo back messages - added by Stefan

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v3.1/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Send an test message back as two cards.

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Hello, What can i Do?",
                    "subtitle": "Choose an option",
                    "image_url": "https://media.giphy.com/media/voirD51GFZte0/giphy.gif",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.bbc.com/news/world/asia/india",
                        "title": "Daily News"
                    }, {
                        "type": "web_url",
                        "url": "https://www.accuweather.com/en/in/mysore/204111/weather-forecast/204111",
                        "title": "Weather"
                    },{
                        "type": "web_url",
                        "url": "https://www.youtube.com/",
                        "title": "YouTube"
                    }],
                }, {
                    "title": "Chatbots FAQ",
                    "subtitle": "Ask me few Questions.",
                    "image_url": "https://media.giphy.com/media/WxJLwDBAXDsW1fqZ3v/giphy.gif",
                    "buttons":[{
                        "type": "postback",
                        "title": "What is a Chatbot?",
                        "payload": "Here's a Definition from Wikipedia: A chatbot (or chatterbot) is a computer program or an artificial intelligence which conducts a conversation via auditory or textual methods.",
                    },{
                        "type": "postback",
                        "title": "What can Chatbots do?",
                        "payload": "Chatbots can help in Content Delivery, Hotel/Restaurant/Travel Booking, Shopping, Agenda/Scheduling, Improve the customer services and Increase response rate of businesses etc.",
                    }, {
                        "type": "postback",
                        "title": "The Future?",
                        "payload": "With the help of messaging apps, bots help consumers find solutions no matter where they are or what device they use plus Chatbots are fun! One day your BFF might be a Chatbot.",
                    }],
                },  {
                    "title": "Learning More",
                    "subtitle": "Communities",
                    "image_url": "https://media.giphy.com/media/QYY3aMUAdKIik/giphy.gif",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://dialogflow.com/",
                        "title": "Google's Dialogflow"
                    }, {
                        "type": "web_url",
                        "url": "https://wit.ai/",
                        "title": "FB's wit.ai"
                    },{
                        "type": "web_url",
                        "url": "https://openai.com/",
                        "title": "Openai"
                    }],
                }],
            },
        }, 
    }
    request({
        url: 'https://graph.facebook.com/v3.1/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

