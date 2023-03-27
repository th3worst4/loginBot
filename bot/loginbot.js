const {Builder, Browser, By, Key} = require("selenium-webdriver");
const {Telegraf} = require('telegraf');

function getPersonalInformation(){
    /*This function gets some of my personal information that can't be available on github.
    Such as: my ID, my password, my telegram bot ID and my personal telegram chat id.
    This function will look for these information on the upper folder from the js file
    and try to find the .dat file bellow. If you clone this repository, I recommend
    you to delete this function and add manually in the source code your informations.*/
    
    const fs = require('fs');
    var data = [];
    
    const allFileContents = fs.readFileSync("../botPersonalInformation.dat", "utf-8");
    allFileContents.split(/\r?\n/).forEach(line =>  {
        data.push(line);
    });

    return data;
}

async function iduffLoginBot(link, data){
    let driver = await new Builder().forBrowser(Browser.CHROME).build();

    await driver.get(link)

    await driver.findElement(By.name('login:id')).sendKeys(data[0])
    await driver.findElement(By.name('login:senha')).sendKeys(data[1], Key.RETURN)
    await driver.findElement(By.xpath('//*[@id="menurecursos"]/li/a')).click();
    
    await driver.findElement(By.name('username')).sendKeys(data[0]);
    await driver.findElement(By.name('password')).sendKeys(data[1], Key.RETURN);

    title = await driver.getTitle();
    while(title != 'Inscrição Online'){
        await driver.navigate().refresh();
    }
    notify(data);
};

function notify(data){
    const bot = new Telegraf(data[3]);
    bot.telegram.sendMessage(data[2],'A página foi carregada!');
}

data = getPersonalInformation();

iduffLoginBot("https://app.uff.br/iduff/login.uff", data);

