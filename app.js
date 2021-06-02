require('dotenv').config();

const { getRequest } = require('./lib/request');
const sendLineNotify = require('./lib/sendLineNotify');
const getToken = require('./lib/getToken');

const targetUrls = (process.env.TARGET_URL).split(';');
const lineTokens = (process.env.LINE_NOTIFY_TOKEN).split(';');
let nowTimestamp = Math.floor(Date.now() / 1000);
let stopIntervalId;
let countFail = 0;

(() => {
    stopIntervalId = setInterval(async () => {
        console.log(`${new Date()}: '我還活著'`);
        const targetData = [];

        try {
            for (const targetUrl of targetUrls) {
                const timestamp = nowTimestamp;
                const [csrf_token, cookie] = await getToken();
                const resp = await getRequest({
                    url: targetUrl,
                    headers: {
                        'X-CSRF-TOKEN': csrf_token,
                        'Cookie': cookie,
                    },
                    json: true,
                });

                if (resp.statusCode !== 200) throw `Token 可能過期了，目前 StatusCode: ${resp.statusCode}`;
                const { data } = resp.body.data;
                Array.from(data).forEach((post) => {
                    if (post.updatetime > timestamp) {
                        targetData.push(`https://rent.591.com.tw/rent-detail-${post.id}.html`);
                    }
                });
            }

            // Update current timestamp
            nowTimestamp = Math.floor(Date.now() / 1000);

            for(const token of lineTokens) {
                // Each message display 5 webinfo at most 
                for(let index = 0; index * 5 < targetData.length; index++) {
                    sendLineNotify(`\n${targetData.slice(index * 5, index * 5 + 5).join("\n")}`, token);
                }
            }
        } catch (error) {
            if (countFail > 10) {
                for(const token of lineTokens) {
                    sendLineNotify(`\n好像出事了! 但是我嘗試重新拿 Token 第 ${countFail} 次了所以暫時先把程式關閉，有空可以檢查一下。\n `, token);
                }
                clearInterval(stopIntervalId);
            }
            console.error(`Fetch the 591 rent fail: ${error}`);
            countFail += 1;
        }
    }, process.env.REQUEST_FREQUENCY);
})();