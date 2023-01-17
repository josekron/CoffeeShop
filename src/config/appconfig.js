module.exports = {
    database: {
        mongoDBConfigLocal: {
            host: 'mongodb://localhost',
            database: 'coffee_db_test',
            port: 27017,
        },
        mongoDBConfigDockerCompose: {
            host: 'mongodb://mongo',
            database: 'docker-node-mongo',
            port: 27017,
        }
    },
    ingredients: [
        {
            name: 'coffee',
            description: 'coffee beans from Colombia',
            quantity: 1000,
            measure: 'g'
        },
        {
            name: 'water',
            description: 'just water',
            quantity: 10000,
            measure: 'ml'
        },
        {
            name: 'milk',
            description: 'just milk',
            quantity: 1000,
            measure: 'ml'
        }
    ],
    recipes: [
        {
            name: 'Americano',
            ingredients: [
                {
                    name: 'coffee',
                    quantity: 7
                },
                {
                    name: 'water',
                    quantity: 100
                }

            ],
            timeSec: 90
        },
        {
            name: 'Cappuccino',
            ingredients: [
                {
                    name: 'coffee',
                    quantity: 6
                },
                {
                    name: 'water',
                    quantity: 10
                },
                {
                    name: 'milk',
                    quantity: 90
                }

            ],
            timeSec: 130
        }
    ],
    baristas: [
        {
            name: 'Jose'
        },
        {
            name: 'Gil'
        }
    ]

};