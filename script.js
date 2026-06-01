
const world = Globe()(document.getElementById("globeViz"))
  .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
  .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png");

world.controls().autoRotate      = true;
world.controls().autoRotateSpeed = 0.3;

world.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });

const EARTH_R = 100;                // globe.gl default earth radius
const SUN_R   = 35;                 // decorative — clearly bigger than earth
const MOON_R  = EARTH_R / 30;      // ≈ 3.33  (earth is 30× moon)

setTimeout(() => {

  const scene = world.scene();

  // Remove globe.gl's default white hemisphere light so our sun casts
  // convincing shadows.
  scene.children
    .filter(c => c.type === "AmbientLight" || c.type === "HemisphereLight")
    .forEach(c => scene.remove(c));

  // Soft fill so the dark side isn't pitch-black
  const ambientLight = new THREE.AmbientLight(0x111133, 2);
  scene.add(ambientLight);

  const sunGeo  = new THREE.SphereGeometry(SUN_R, 64, 64);
  const sunMat  = new THREE.MeshBasicMaterial({ color: 0xffe566 });
  const sun     = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(500, 120, -350);
  scene.add(sun);

  // Outer glow (large, very transparent)
  const glowGeo = new THREE.SphereGeometry(SUN_R * 1.7, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff9900,
    transparent: true,
    opacity: 0.10,
    side: THREE.BackSide      // render inside-out so it doesn't occlude the core
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.copy(sun.position);
  scene.add(glow);

  // Mid halo
  const haloGeo = new THREE.SphereGeometry(SUN_R * 1.3, 32, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffcc00,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.copy(sun.position);
  scene.add(halo);

  // Directional light — makes the earth's night-side believable
  const sunLight = new THREE.PointLight(0xfff4cc, 3.5, 3000);
  sunLight.position.copy(sun.position);
  scene.add(sunLight);

  const moonGeo  = new THREE.SphereGeometry(MOON_R, 32, 32);
  const moonMat  = new THREE.MeshPhongMaterial({
    color: 0xc8c8c8,
    shininess: 5
  });
  const moon = new THREE.Mesh(moonGeo, moonMat);
  scene.add(moon);

  const MOON_ORBIT_R = 185;    // units from earth centre
  let   moonAngle    = 0;

  const comets    = [];
  const NUM_COMETS = 7;

  function createComet() {
    const group = new THREE.Group();

    // ── Head (bright sphere) ──
    const headGeo = new THREE.SphereGeometry(1.4, 10, 10);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xeef8ff });
    const head    = new THREE.Mesh(headGeo, headMat);
    group.add(head);

    // ── Tail (fading line behind head) ──
    const TAIL_SEGMENTS = 35;
    const positions = new Float32Array(TAIL_SEGMENTS * 3);
    const colors    = new Float32Array(TAIL_SEGMENTS * 3);

    for (let i = 0; i < TAIL_SEGMENTS; i++) {
      positions[i * 3]     = -i * 2.2;   // extends backward along -X (local)
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      const fade = 1 - i / TAIL_SEGMENTS;
      colors[i * 3]     = 0.6 + fade * 0.4;   // R
      colors[i * 3 + 1] = 0.8 + fade * 0.2;   // G
      colors[i * 3 + 2] = 1.0;                 // B
    }

    const tailGeo = new THREE.BufferGeometry();
    tailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    tailGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    const tailMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    const tail = new THREE.Line(tailGeo, tailMat);
    group.add(tail);

    resetComet(group);
    scene.add(group);
    comets.push(group);
  }

  function resetComet(comet) {
    // Spawn on a random point of a large sphere surrounding the scene
    const theta = Math.random() * Math.PI * 2;
    const phi   = (Math.random() - 0.5) * Math.PI * 0.65;
    const r     = 750 + Math.random() * 350;

    comet.position.set(
      r * Math.cos(phi) * Math.cos(theta),
      r * Math.sin(phi),
      r * Math.cos(phi) * Math.sin(theta)
    );

    // Fly mostly through the scene, not necessarily at the earth
    const speed = 2.2 + Math.random() * 2.8;
    const dir   = new THREE.Vector3(
      (Math.random() - 0.5) * 1.8,
      (Math.random() - 0.5) * 0.6,
      (Math.random() - 0.5) * 1.8
    ).normalize().multiplyScalar(speed);

    comet.userData.velocity = dir;
    comet.userData.maxLife  = 250 + Math.random() * 180;
    comet.userData.life     = 0;

    // Give each comet a staggered start so they don't all spawn together
    comet.userData.dormant     = Math.random() * 300;

    // Orient the comet group so local -X points backward (tail direction)
    const forward = comet.position.clone().add(dir);
    comet.lookAt(forward);
  }

  for (let i = 0; i < NUM_COMETS; i++) createComet();

  function animate() {
    requestAnimationFrame(animate);

    // Moon orbit (tilted slightly)
    moonAngle += 0.007;
    moon.position.x = Math.cos(moonAngle) * MOON_ORBIT_R;
    moon.position.z = Math.sin(moonAngle) * MOON_ORBIT_R;
    moon.position.y = Math.sin(moonAngle * 0.4) * 18;   // slight vertical bob

    // Comets
    comets.forEach(comet => {

      // Dormant countdown (staggers first appearance)
      if (comet.userData.dormant > 0) {
        comet.userData.dormant--;
        return;
      }

      comet.position.add(comet.userData.velocity);
      comet.userData.life++;

      // Fade tail out near end of life
      const lifeRatio = comet.userData.life / comet.userData.maxLife;
      comet.children.forEach(child => {
        if (child.material && child.material.opacity !== undefined) {
          child.material.opacity = Math.max(0, 0.75 * (1 - lifeRatio * 1.2));
        }
      });

      if (
        comet.userData.life >= comet.userData.maxLife ||
        comet.position.length() > 1400
      ) {
        resetComet(comet);
        comet.children.forEach(child => {
          if (child.material && child.material.opacity !== undefined) {
            child.material.opacity = 0.75;
          }
        });
      }
    });
  }

  animate();

}, 1000);

async function searchLocation() {

  const input =
    document.getElementById("searchInput");

  const location =
    input.value.trim();

  if (!location) return;

  try {

    // Search location using OpenStreetMap
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
    );

    const data = await response.json();

    // If location found
    if (data.length > 0) {

      const lat = parseFloat(data[0].lat);

      const lng = parseFloat(data[0].lon);

      
      const locationName =
        data[0].display_name.split(",")[0];

      world.htmlElementsData([
      {
        lat: lat,
        lng: lng
      }
    ])
    .htmlElement(() => {

      const el = document.createElement("div");

     const img = document.createElement("img");

      img.src = "map_logo.png"; // your marker image

      img.style.width = "45px";
      img.style.height = "45px";
       img.style.pointerEvents ="none";

      return img;

      el.style.fontSize = "35px";

      return el;

    });

      // Stop auto rotation
      world.controls().autoRotate = false;

      // Zoom to location
      world.pointOfView(
        {
          lat,
          lng,
          altitude: 1.3
        },
        2500
      );

      // Open weather page after zoom animation
      setTimeout(() => {

        window.location.href =
          `weather.html?lat=${lat}&lng=${lng}&city=${encodeURIComponent(locationName)}`;

      }, 3000);

    }

    // If location NOT found
    else {

      alert("Location not found");

    }

  }

  catch (error) {

    console.log(error);

    alert("Network error");

  }

}

// ── Skeleton state ──
function showWeatherSkeleton(location) {
  const card = document.getElementById("weatherCard");
  card.style.display = "block";
  card.innerHTML = `
    <button class="close-btn" onclick="closeWeatherCard()">✕</button>
    <div class="weather-location">${location}</div>

    <div class="weather-body">
      <div class="skeleton-icon skeleton-pulse"></div>
      <div class="weather-info">
        <div class="skeleton-temp skeleton-pulse"></div>
        <div class="skeleton-desc skeleton-pulse"></div>
      </div>
    </div>

    <div class="weather-details">
      <div class="weather-detail-item">
        <div class="skeleton-label skeleton-pulse"></div>
        <div class="skeleton-value skeleton-pulse"></div>
      </div>
      <div class="weather-detail-item">
        <div class="skeleton-label skeleton-pulse"></div>
        <div class="skeleton-value skeleton-pulse"></div>
      </div>
      <div class="weather-detail-item">
        <div class="skeleton-label skeleton-pulse"></div>
        <div class="skeleton-value skeleton-pulse"></div>
      </div>
    </div>
  `;
}

// ── Placeholder (no API key yet) ──
function updateWeatherCard(locationName, lat, lng) {
  const card = document.getElementById("weatherCard");
  card.innerHTML = `
    <button class="close-btn" onclick="closeWeatherCard()">✕</button>
    <div class="weather-location">${locationName}</div>

    <div class="weather-body">
      <div class="weather-icon">🌍</div>
      <div class="weather-info">
        <div class="weather-temp">--°C</div>
        <div class="weather-desc">Connect a weather API to see live data</div>
      </div>
    </div>

    <div class="weather-details">
      <div class="weather-detail-item">
        <span class="detail-label">Humidity</span>
        <span class="detail-value">--%</span>
      </div>
      <div class="weather-detail-item">
        <span class="detail-label">Wind</span>
        <span class="detail-value">-- km/h</span>
      </div>
      <div class="weather-detail-item">
        <span class="detail-label">Feels like</span>
        <span class="detail-value">--°C</span>
      </div>
    </div>
  `;
}

// ── Error state ──
function showErrorCard(message) {
  const card = document.getElementById("weatherCard");
  card.innerHTML = `
    <button class="close-btn" onclick="closeWeatherCard()">✕</button>
    <div class="weather-location" style="color:rgba(255,120,120,0.8);">Error</div>
    <div style="font-size:13px; color:rgba(255,255,255,0.6); padding-top:4px;">${message}</div>
  `;
}

function closeWeatherCard() {
  document.getElementById("weatherCard").style.display = "none";
  world.controls().autoRotate = true;
}

// Enter key support
document.getElementById("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") searchLocation();
});