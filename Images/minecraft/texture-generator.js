function createTexture(name, drawFunction) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    
    drawFunction(ctx);
    
    // Download de texture
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Gras texture
createTexture('grass', (ctx) => {
    ctx.fillStyle = '#567D46'; // Donker gras
    ctx.fillRect(0, 0, 16, 16);
    
    // Voeg wat gras details toe
    ctx.fillStyle = '#85C247'; // Licht gras
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * 16;
        const y = Math.random() * 16;
        ctx.fillRect(x, y, 2, 2);
    }
});

// Dirt texture
createTexture('dirt', (ctx) => {
    ctx.fillStyle = '#8B4513'; // Basis aarde kleur
    ctx.fillRect(0, 0, 16, 16);
    
    // Voeg wat donkere vlekken toe
    ctx.fillStyle = '#654321';
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 16;
        const y = Math.random() * 16;
        ctx.fillRect(x, y, 3, 3);
    }
});

// Steen texture
createTexture('stone', (ctx) => {
    ctx.fillStyle = '#808080'; // Basis steen kleur
    ctx.fillRect(0, 0, 16, 16);
    
    // Voeg wat textuur toe
    ctx.fillStyle = '#707070';
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * 16;
        const y = Math.random() * 16;
        ctx.fillRect(x, y, 4, 4);
    }
});

// Hout texture
createTexture('wood', (ctx) => {
    ctx.fillStyle = '#8B4513'; // Basis hout kleur
    ctx.fillRect(0, 0, 16, 16);
    
    // Voeg houtnerven toe
    ctx.fillStyle = '#654321';
    for (let y = 0; y < 16; y += 4) {
        ctx.fillRect(0, y, 16, 2);
    }
});