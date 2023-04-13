const TelegramApi = require('node-telegram-bot-api')

const token2 = "6103367514:AAGACQxUKdyFEB6SeRaxStyrhnGHbZnpFNs"
const token = "6269436326:AAGQAzw3UhVZbmExVSjIxPpXYqglCnje8Cc"
const bot = new TelegramApi(token,{polling: true})




const chats = {}
let test = []
const ban_list = []
let fruits = ["Яблоко", "Апельсин"];

fruits.push("Груша")

let start_vopros = 0;
let  get_otvet = 0;
let kolvo_vopros = 0;


const gameOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "Нажми 1",callback_data: '1'} ,{text: "Нажми 2",callback_data: '2'},{text: "Нажми 3 ",callback_data: 3}],
            [{text: "Нажми 4 ",callback_data: '4'},{text: "Нажми 5",callback_data: '5'},{text: "Нажми 6 ",callback_data: '6'}],
            [{text: "Нажми 7 ",callback_data: '5'},{text: "Нажми 8",callback_data: '8'},{text: "Нажми 9 ",callback_data: '9'}],
            [{text: "Нажми 0",callback_data: '/again'}]
        ]
    })
}
const againOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "Играть еще раз?",callback_data: '0',id_vopros: kolvo_vopros }]
        ]
        
    })
}
const otvet = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "Ответить?",callback_data: 'Da'},{text: "Удалить",callback_data: 'delete'}],
            [{text: "Bann",callback_data: 'giveban'}]
        ]
        
    })
}
const clear_massiv = () => {
    start_vopros = 0;
    get_otvet = 0;
    kolvo_vopros--
    start_vopros = 0;
    get_otvet = 0;



}

const startGame = async(chatId) => {
    await bot.sendMessage(chatId, 'Угадай число)');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Я уже загадал ${randomNumber}`,gameOption);
}

const getChat = async(chatId,text,firstName,IdVopros) => {
    await bot.sendMessage(chatId, `Сообщение "${text}" отправлено\nВопрос в очереди: ${kolvo_vopros}`);
    const randomNumber = Math.floor(Math.random() * 10)
    test.push({ IdV: IdVopros,ID: chatId, Text: text ,Name:firstName})
    console.log(test)
    if (kolvo_vopros === 1 ){
        await bot.sendMessage(896935856, `Вопрос: ${ test[0].Text} \nОт: ${test[0].Name}\nНомер вопроса:${test[0].IdV}`,otvet);
    }
    start_vopros = 0;
    get_otvet = 1;

}

const start = () => {
    bot.setMyCommands( [
        {command: '/start' , description: "Старт",},
        {command: '/vopros' , description: "Задать вопрос"}
    
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
            if (text === '/start') {
                //await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
                return bot.sendMessage(chatId, `Привет\n/vopros - задать вопрос\nЛимит вопросов: 1 `);
            }
            if(text === "/gslog"){
                let id_log  = Array.from(test,({ID}) => ID)
                return console.log(id_log)
            }
            if (text === '/vopros' ) {
                if (get_otvet != 25 ){                
                start_vopros = 1;
                return bot.sendMessage(chatId, `Введите вопрос`);
                }/*else{
                    return bot.sendMessage(chatId, `Достигнут лимит вопросов, попробуйте позже`);
                }*/
            }
            if (start_vopros  === 1){
                kolvo_vopros++
                return getChat(chatId,text,msg.from.first_name,kolvo_vopros);

            }
            if(start_vopros  === "3" & chatId === 896935856){
                clear_massiv()
                bot.sendMessage(896935856, `Вопрос: пришел`);
                bot.sendMessage(test[0].ID, `Вам ответили!\nОтвет: ${text}`);
                
                
                test.splice(0,1);
                console.log("F                 ",test);
                 if (kolvo_vopros != 0 ){
                    bot.sendMessage(896935856, `Вопрос: ${ test[0].Text} \nОт: ${test[0].Name}\n Номер вопроса: ${test[0].IdV} `,otvet);
               }
           
            }
            if (text === '/info') {
                return bot.sendMessage(chatId, `Ты такой ${msg.from.first_name} ${msg.from.last_name}`);
            }
            if (text === '/game2342432341') {
               return startGame(chatId);
            }
            //return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');
            
    
    
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === "0"){
            return startGame(chatId)
        }
        if(data === "Da" ){
            start_vopros = "3";
            return bot.sendMessage(chatId,"Введите ответ пользователю ")
        }else if(data === "delete"){
            start_vopros = 0;
            get_otvet = 0;
            bot.sendMessage(chatId,`Вы удалили вопрос: ${ test[0].Text} \nОт: ${test[0].Name}`)
            bot.sendMessage(test[0].ID, `Ваш вопрос был удален!`);
            test.splice(0,1);
            console.log("При удалении\n             ",test);
             if (kolvo_vopros != 0 ){
                bot.sendMessage(896935856, `Вопрос: ${ test[0].Text} \nОт: ${test[0].Name}`,otvet);
           }
            return  kolvo_vopros--
        }else if(data === "giveban"){
            clear_massiv()

            test.splice(0,1);
            bot.sendMessage(chatId,`Пользователю ${test[0].Name} заблокирован доступ`);
            bot.sendMessage(test[0].ID, `Вы были заблокированы!`);
            return test = [];

        }   
        if(data === chats[chatId]){
            return bot.sendMessage(chatId,"Поздровляю , ты угадал!")
        }else{
            return bot.sendMessage(chatId,`Ты не угадал, правильный ответ:${chats[chatId]}`,againOption)
        }
        
    })
}
start()