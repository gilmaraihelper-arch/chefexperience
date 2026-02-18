const sharp = require('sharp');

const size = 1024;
const radius = 200;

// Criar buffer RGBA
const buffer = Buffer.alloc(size * size * 4);

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const idx = (y * size + x) * 4;
    
    // Verificar se está dentro do círculo arredondado
    const dx = Math.max(Math.abs(x - size/2) - (size/2 - radius), 0);
    const dy = Math.max(Math.abs(y - size/2) - (size/2 - radius), 0);
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > radius) {
      // Transparente fora do círculo
      buffer[idx] = 0;
      buffer[idx + 1] = 0;
      buffer[idx + 2] = 0;
      buffer[idx + 3] = 0;
      continue;
    }
    
    // Gradiente âmbar para laranja
    const t = (x + y) / (size * 2);
    const r = Math.round(245 - t * 30);
    const g = Math.round(158 - t * 100);
    const b = Math.round(11);
    
    buffer[idx] = r;     // R
    buffer[idx + 1] = g; // G
    buffer[idx + 2] = b; // B
    buffer[idx + 3] = 255; // A
  }
}

// Criar imagem base
sharp(buffer, {
  raw: {
    width: size,
    height: size,
    channels: 4
  }
})
.composite([
  {
    // Chef hat SVG overlay
    input: Buffer.from(`
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(512, 512) scale(20)" fill="white">
          <path d="M-10 2 L10 2 L10 4 Q10 5 9 5 L-9 5 Q-10 5 -10 4 Z"/>
          <path d="M-10 2 Q-12 -2 -8 -4 Q-4 -6 0 -5 Q4 -6 8 -4 Q12 -2 10 2"/>
          <circle cx="-3" cy="0" r="1.5" fill="rgba(234,88,12,0.4)"/>
          <circle cx="3" cy="0" r="1.5" fill="rgba(234,88,12,0.4)"/>
        </g>
      </svg>
    `),
    top: 0,
    left: 0
  }
])
.png()
.toFile('public/chefexperience-icon-1024.png')
.then(() => {
  console.log('✅ Ícone gerado: public/chefexperience-icon-1024.png');
})
.catch(err => {
  console.error('❌ Erro:', err);
});
