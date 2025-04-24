const User = require('../models/User');
const Serie = require('../models/Serie');

const seedSerieRegistrations = async () => {
    try {
        console.log('Iniciando registro de series a usuarios...');
        
        // Get some users
        const users = await User.find({}).limit(2);
        if (users.length === 0) {
            console.log('⚠️ No se encontraron usuarios para registrar series');
            return;
        }
        
        // Get some public series
        const series = await Serie.find({ isPublic: true }).limit(5);
        if (series.length === 0) {
            console.log('⚠️ No se encontraron series públicas para registrar');
            return;
        }
        
        // Distribute series among users
        const registrations = [
            // User 1 gets series 0, 1, and 2
            { user: users[0]._id, series: [series[0]._id, series[1]._id, series[2]._id] },
            
            // User 2 gets series 2, 3, and 4
            { user: users[1]._id, series: [series[2]._id, series[3]._id, series[4]._id] },
        ];
        
        // Register series to users
        for (const reg of registrations) {
            const user = await User.findById(reg.user);
            
            // Initialize registeredSeries array if not exists
            if (!user.registeredSeries) {
                user.registeredSeries = [];
            }
            
            // Add series to user's registeredSeries (avoiding duplicates)
            for (const serieId of reg.series) {
                if (!user.registeredSeries.includes(serieId)) {
                    user.registeredSeries.push(serieId);
                }
            }
            
            await user.save();
            console.log(`🌱 Usuario ${user.username} ahora tiene ${user.registeredSeries.length} series registradas`);
        }
        
        console.log('🌱 Registro de series a usuarios completado exitosamente');
    } catch (error) {
        console.error('Error al registrar series a usuarios:', error);
    }
};

module.exports = seedSerieRegistrations; 