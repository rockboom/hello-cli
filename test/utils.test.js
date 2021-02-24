const {changeExtension,addExtension} = require('../lib/utils');

test('change table.scss into table.css', () => {
    expect(changeExtension("table.scss", 'css')).toBe('table.css');
})

test('add an .js extension to Hello.vue',()=>{
    expect(addExtension('Hello.vue','js')).toBe('Hello.vue.js');
})
