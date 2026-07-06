/*
    fonts storage
    https://fontstorage.com/category/

    convert fonts to fontface
    https://transfonter.org/

    * Family support    (cần xuất ra 2 phiên bản, có và không, hỗ trợ cho cả 2 dạng "ff:Montserrat ExtraBold" hoặc "ff:Montserrat và fw:bold")
    * Add local rule
    * TFF
*/

# check font
https://fonts.google.com/

# download font

var fonts = [];
console.log(`https://fonts.googleapis.com/css2?${fonts.map(m=>{return `family=${m}`;}).join('&')}`)
