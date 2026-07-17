// Oryvia Labs — Stealth Monochrome 3D Canvas & Terminal Logic

document.addEventListener('DOMContentLoaded', () => {
  init3DScene();
  initTerminalSimulator();
  initCopyButtons();
  initNavigation();
  initScrollAnimations();
});

// ── Intersection Observer for Scroll Animations ──
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Auto-attach animation classes to main elements
  document.querySelectorAll('.stealth-panel, .section-head, .terminal-block, .benchmark-table-wrapper').forEach((el, index) => {
    el.classList.add('animate-on-scroll');
    // Stagger delays based on index (just a simple stagger effect)
    if (index % 3 === 1) el.classList.add('delay-100');
    if (index % 3 === 2) el.classList.add('delay-200');
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ── Three.js Stealth Wireframe 3D Scene (Single Signature Core Geometry) ─────
let scene, camera, renderer, heroMesh, particles;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

function init3DScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.015);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 24;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Single Signature Hero Geometry (Intricate TorusKnot Wireframe Sculpture)
  const geometry = new THREE.TorusKnotGeometry(7, 2, 140, 20);

  // Stealth Metallic Wireframe Material
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x1f1f1f,
    wireframe: true,
    roughness: 0.1,
    metalness: 0.95
  });

  heroMesh = new THREE.Mesh(geometry, material);
  heroMesh.position.set(11, 0, -2);
  scene.add(heroMesh);

  // Stealth Monochrome Particle Matrix
  const count = 800;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    pPos[i] = (Math.random() - 0.5) * 110;
    pPos[i + 1] = (Math.random() - 0.5) * 110;
    pPos[i + 2] = (Math.random() - 0.5) * 110;
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.7,
    color: 0x666666,
    transparent: true,
    opacity: 0.4
  });

  particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Stealth Lights
  const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight1.position.set(15, 20, 15);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x444444, 0.8);
  dirLight2.position.set(-15, -20, 10);
  scene.add(dirLight2);

  // Render Loop
  const animate = () => {
    requestAnimationFrame(animate);

    heroMesh.rotation.x += 0.003;
    heroMesh.rotation.y += 0.005;

    targetRotationY += (mouseX - targetRotationY) * 0.04;
    targetRotationX += (mouseY - targetRotationX) * 0.04;

    heroMesh.rotation.y += targetRotationY * 0.0004;
    heroMesh.rotation.x += targetRotationX * 0.0004;

    particles.rotation.y -= 0.0003;
    particles.rotation.x += 0.0002;

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2);
    mouseY = (e.clientY - window.innerHeight / 2);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ── Stealth Terminal Simulator ──────────────────────────────────────────────
function initTerminalSimulator() {
  const form = document.getElementById('term-form');
  const input = document.getElementById('t-input-field');
  const body = document.getElementById('term-body');

  if (!form || !input || !body) return;

  function appendLine(content, type = 'user') {
    const div = document.createElement('div');
    div.className = `t-line ${type}`;
    div.innerHTML = content;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    input.value = '';
    appendLine(`dev@oryvia:~$ ${val}`, 'user');

    setTimeout(() => {
      const lower = val.toLowerCase();
      if (lower === '/help') {
        appendLine(`
Index of commands:
  /ls [dir]      - List directory
  /pwd           - Print working directory
  /cat &lt;file&gt;    - Output file content
  /mode          - Switch AI model mode (coder, ultra, max, life)
  /ui            - Launch Terminal UI
  /exit          - Clear output
        `, 'sys');
      } else if (lower.startsWith('/ls')) {
        appendLine(`oryvia-labs/ : main.py, config.yaml, models/, app/, index.html`, 'sys');
      } else if (lower.startsWith('/pwd')) {
        appendLine(`/workspace/oryvia-labs`, 'sys');
      } else if (lower.startsWith('/mode')) {
        appendLine(`[Mtrini Engine] Active mode: Mtrini Coder Ultra 0.5 (Reasoner)`, 'sys');
      } else if (lower === '/ui') {
        appendLine(`[Mtrini TUI] Terminal UI booted successfully.`, 'sys');
      } else {
        appendLine(`Mtrini 0.5: Processing query "${val}". Local execution on silicon complete.`, 'ai');
      }
    }, 200);
  });
}

// ── Copy Commands ───────────────────────────────────────────────────────────
function initCopyButtons() {
  const btnHero = document.getElementById('btn-copy-install');
  if (btnHero) {
    btnHero.addEventListener('click', () => {
      navigator.clipboard.writeText('pip install mtrinistudio');
      btnHero.innerHTML = '<code style="color:#10b981;">✓ copied</code>';
      setTimeout(() => {
        btnHero.innerHTML = '<code>pip install mtrinistudio</code>';
      }, 2000);
    });
  }

  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.color = '#10b981';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = '';
        }, 2000);
      }
    });
  });
}

function initNavigation() {
  const links = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(s => {
      if (pageYOffset >= s.offsetTop - 150) {
        current = s.getAttribute('id');
      }
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) {
        l.classList.add('active');
      }
    });
  });
}
