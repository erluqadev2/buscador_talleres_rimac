module.exports = {
    preset: 'ts-jest',
    collectCoverageFrom: [
        'src/**/*.ts'
    ],
    testMatch: [
        '**/*.steps.ts'
    ]
};