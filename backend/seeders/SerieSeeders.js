const Serie = require('../models/Serie');

const series = [
    {
        nombre: 'Breaking Bad',
        sinopsis: 'Un profesor de química se convierte en fabricante de metanfetaminas tras ser diagnosticado con cáncer de pulmón.',
        genero: 'Drama',
    },
    {
        nombre: 'Stranger Things',
        sinopsis: 'Un grupo de niños se enfrenta a fenómenos sobrenaturales en su pequeña ciudad.',
        genero: 'Ciencia ficción',
    },
    {
        nombre: 'Game of Thrones',
        sinopsis: 'Familias nobles luchan por el control del Trono de Hierro en un mundo medieval lleno de dragones y magia.',
        genero: 'Fantasía',
    },
    {
        nombre: 'The Crown',
        sinopsis: 'La vida y reinado de la Reina Isabel II del Reino Unido.',
        genero: 'Biografía',
    },
    {
        nombre: 'The Mandalorian',
        sinopsis: 'Un cazarrecompensas solitario navega por la galaxia después de la caída del Imperio.',
        genero: 'Ciencia ficción',
    },
    {
        nombre: 'The Office',
        sinopsis: 'Una comedia de situación que sigue la vida cotidiana de los empleados de una oficina.',
        genero: 'Comedia',
    },
    {
        nombre: 'Friends',
        sinopsis: 'Un grupo de amigos navega por las complicaciones de la vida y el amor en Nueva York.',
        genero: 'Comedia',
    },
    {
        nombre: 'The Witcher',
        sinopsis: 'Un cazador de monstruos navega por un mundo lleno de magia y criaturas fantásticas.',
        genero: 'Fantasía',
    },
    {
        nombre: 'Narcos',
        sinopsis: 'La historia del narcotráfico en Colombia y la vida del infame Pablo Escobar.',
        genero: 'Drama',
    },
    {
        nombre: 'Black Mirror',
        sinopsis: 'Una antología que explora la relación entre la tecnología y la sociedad moderna.',
        genero: 'Ciencia ficción',
    }
];

const seedSeries = async () => {
    try {
        await Serie.deleteMany({});

        await Serie.insertMany(series);
        console.log('🌱  Series creadas exitosamente:');
        return true;
    } catch (err) {
        console.error('Error al sembrar series:', err.message);
        return false;
    }
};

module.exports = seedSeries;