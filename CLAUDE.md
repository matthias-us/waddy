# CLAUDE.md - AI Assistant Documentation

This document provides comprehensive guidance for AI assistants working on the Waddy codebase.

## Project Overview

**Waddy** is a 3D interactive web-based marble physics simulator featuring procedurally generated terrain using Perlin/Simplex noise. It's a Progressive Web App (PWA) built with vanilla JavaScript and Three.js, designed to run on both desktop and mobile devices.

### Key Features
- **3D Physics Simulation**: Realistic marble rolling physics with gravity, friction, and terrain slope calculations
- **Procedural Terrain**: Dynamically undulating terrain generated with Simplex noise
- **Cross-Platform**: Desktop (mouse-controlled) and mobile (device orientation/tilt controls)
- **PWA-Ready**: Installable as a standalone app with offline support
- **Zero Build Tools**: Pure vanilla JavaScript, runs directly in browsers

---

## Repository Structure

```
/home/user/waddy/
├── .git/                    # Git repository metadata
├── README.md                # Brief project description
├── CLAUDE.md                # This file - AI assistant documentation
├── manifest.json            # PWA configuration
├── index.html              # Main 3D game (PRIMARY FILE - 260 lines)
├── styles.css              # Minimal styling (18 lines)
└── scripts/
    ├── game.js            # Alternative 2D Canvas game (NOT CURRENTLY USED - 166 lines)
    └── perlin.js          # Perlin noise implementation (19 lines)
```

### File Purposes

#### **index.html** (PRIMARY GAME FILE)
The main entry point and complete 3D game implementation. Contains:
- Three.js scene setup (scene, camera, WebGL renderer with shadow mapping)
- Simplex noise-based terrain generation (100×100 vertex grid)
- Marble physics simulation (gravity, friction, slope calculations)
- Device-specific controls (mouse drag for desktop, tilt for mobile)
- Real-time terrain undulation using 3D Perlin noise
- Lighting system (ambient + directional with PCF soft shadows)
- Responsive design with window resize handling

**Physics Implementation Details:**
- Gravity: 9.8 m/s²
- Friction damping: 0.98 factor per frame
- Terrain slope via finite differences (h=0.1)
- Boundary constraints: ±49 units (marble kept on terrain)
- Marble height: terrain height + 5.0 units (index.html:229)

#### **manifest.json**
PWA configuration defining:
- App name: "Perlin Terrain" / Short name: "Terra"
- Display mode: Fullscreen
- Theme: Black (#000000)
- Orientation: Portrait
- Icon sizes: 192×192, 512×512

#### **scripts/game.js**
Alternative 2D Canvas-based implementation (NOT currently integrated). Features:
- 2D ball physics with Perlin terrain gradients
- Collectible green targets (complete level by collecting all)
- Black hole hazards (reset level if touched)
- Level-based gameplay with procedural generation
- Device orientation support for mobile tilt controls

**Note for AI Assistants:** This file exists but is not referenced in index.html. It's a separate game variant. Do not confuse it with the active 3D implementation.

#### **scripts/perlin.js**
Classic Perlin noise algorithm implementation:
- 256-element permutation table
- 3D noise function: `Perlin.noise(x, y, z)`
- Lerp and gradient helper functions
- Self-initializing on load

**Note:** The main 3D game (index.html) uses CDN-hosted SimplexNoise library instead of this file.

---

## Technology Stack

| Technology | Version/Type | Purpose | Source |
|-----------|-------------|---------|---------|
| **Three.js** | r128 | 3D rendering, scene management | CDN: `cdnjs.cloudflare.com` |
| **SimplexNoise** | 2.4.0 | Procedural terrain generation | CDN: `cdnjs.cloudflare.com` |
| **Vanilla JavaScript** | ES6+ | Game logic, physics | Inline in HTML |
| **WebGL** | - | Low-level GPU rendering | Via Three.js |
| **Canvas API** | - | 2D fallback (game.js) | Browser native |
| **PWA APIs** | - | Installability, orientation | Browser native |

### External Dependencies
All dependencies loaded via CDN (no package.json or npm):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js"></script>
```

---

## Development Workflows

### Running the Project Locally

**No build step required!** Simply:
1. Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge)
2. OR use any HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (if available)
   npx http-server

   # PHP
   php -S localhost:8000
   ```
3. Navigate to `http://localhost:8000`

### Testing

**Desktop Testing:**
1. Open index.html in browser
2. Click and drag mouse to rotate camera view around terrain
3. Observe marble rolling based on terrain slope
4. Verify marble stays within boundaries (±49 units)

**Mobile Testing:**
1. Serve project over HTTPS (required for DeviceOrientation API on iOS)
2. Open on mobile device
3. Tap "Enable Tilt Controls" button
4. Grant device orientation permission
5. Tilt device to control marble movement
6. Verify light position updates with device tilt

**Physics Testing:**
- Marble should roll downhill on slopes
- Velocity should dampen over time (friction)
- Terrain should undulate smoothly
- No clipping through terrain surface

### Deployment

**Static Site Hosting:**
Deploy to any static hosting service:
- **GitHub Pages**: Push to gh-pages branch
- **Netlify/Vercel**: Connect repository and auto-deploy
- **Firebase Hosting**: `firebase deploy`
- **AWS S3**: Upload files to S3 bucket with static hosting

**PWA Installation:**
- Serve over HTTPS (required for PWA)
- Browser will prompt for "Add to Home Screen"
- App runs fullscreen when launched from home screen

### Git Workflow

**Current Branch:** `claude/add-claude-documentation-3uiL4`

**Commit Guidelines:**
- Use descriptive commit messages
- Focus on "why" not "what" (code shows the "what")
- Follow existing style: "Update index.html", "log marble height"
- Keep commits focused and atomic

**Pushing:**
```bash
git push -u origin claude/add-claude-documentation-3uiL4
```

---

## Key Conventions for AI Assistants

### Code Style & Patterns

#### JavaScript Conventions
1. **Inline Script Organization** (index.html:38-258):
   - Scene setup first (lines 39-46)
   - Terrain generation (48-69)
   - Object creation (71-95)
   - Camera setup (97-99)
   - Device detection (101-102)
   - Event handlers (104-168)
   - Physics functions (170-197)
   - Animation loop (199-250)
   - Window event listeners (252-257)

2. **Variable Naming**:
   - Use camelCase: `marbleGeometry`, `terrainHeight`, `directionalLight`
   - Descriptive names: `isMobile`, `hasPermission`, `previousMouseX`
   - Physics constants in lowercase: `gravity`, `friction`, `mass`, `dt`

3. **Three.js Patterns**:
   - Create geometry first: `new THREE.SphereGeometry()`
   - Then material: `new THREE.MeshStandardMaterial()`
   - Combine into mesh: `new THREE.Mesh(geometry, material)`
   - Add to scene: `scene.add(mesh)`

4. **Physics Calculations**:
   - Use `getTerrainHeight(x, y)` for height interpolation
   - Use `getTerrainSlope(x, y)` for slope via finite differences
   - Always apply friction: `velocity.multiplyScalar(friction)`
   - Update position after velocity: `position.add(velocity.clone().multiplyScalar(dt))`

#### Terrain System
- **Grid**: 100×100 vertices (width/height constants at lines 49-50)
- **Noise scale**: 0.05 for initial terrain (line 59)
- **Height multiplier**: 5 units (line 59)
- **Undulation**: 3D noise with time parameter (line 208)
- **Update pattern**: Modify vertices array, set `needsUpdate = true`, compute normals

#### Physics Constants
```javascript
const gravity = 9.8;      // m/s² (line 172)
const friction = 0.98;    // Damping factor (line 173)
const mass = 1;           // Arbitrary mass (line 174)
const dt = 1 / 60;        // Time step for 60 FPS (line 175)
```

**Do not change these without understanding physics implications!**

### File Modification Guidelines

#### When Editing index.html
1. **Always read the file first** before making changes
2. **Preserve inline structure** - everything is in one HTML file by design
3. **Test physics changes carefully** - small tweaks can break simulation
4. **Maintain CDN links** - don't change Three.js/SimplexNoise versions without testing
5. **Keep mobile/desktop branches** - both control schemes must work

#### When Working with Physics (Lines 170-234)
1. **Never skip computing vertex normals** after terrain updates (line 211)
2. **Maintain boundary checks** (lines 232-233) - prevents marble escape
3. **Keep marble above terrain** (line 229) - prevents clipping
4. **Preserve slope calculation method** (lines 188-197) - uses finite differences
5. **Respect frame rate timing** - physics assumes 60 FPS (dt = 1/60)

#### Mobile-Specific Code (Lines 101-140, 217-221, 236-246)
1. **Preserve permission flow** - iOS requires user gesture + permission request
2. **Handle permission denial gracefully** - update button text
3. **Maintain orientation conversion** - beta/gamma in radians (lines 135-136)
4. **Keep light sync with tilt** - creates immersive effect (lines 236-240)

### Common Tasks & Patterns

#### Adding New Visual Effects
```javascript
// Pattern: Create geometry → material → mesh → add to scene
const effectGeometry = new THREE.BoxGeometry(1, 1, 1);
const effectMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const effectMesh = new THREE.Mesh(effectGeometry, effectMaterial);
effectMesh.castShadow = true;
effectMesh.receiveShadow = true;
scene.add(effectMesh);
```

#### Modifying Terrain Appearance
1. Change material color/properties (line 64)
2. Adjust noise scale (line 59, 208) - smaller = smoother terrain
3. Modify height multiplier (line 59, 208) - affects terrain amplitude
4. Update time increment (line 212) - faster = more dynamic undulation

#### Adjusting Physics Behavior
```javascript
// Make marble roll faster: increase gravity
const gravity = 12.0;  // instead of 9.8

// Make marble slide more: decrease friction
const friction = 0.95;  // instead of 0.98

// Make marble more responsive to slopes: modify line 216
acceleration = new THREE.Vector3(slope.x * gravity * 1.5, slope.y * gravity * 1.5, 0);
```

#### Adding Mobile Tilt Sensitivity
```javascript
// Modify lines 219-220 to adjust tilt responsiveness
acceleration.x += Math.sin(gamma) * gravity * 2.0;  // 2x more sensitive
acceleration.y -= Math.sin(beta) * gravity * 2.0;
```

### Critical Implementation Details

#### Terrain Height Interpolation (Lines 177-186)
```javascript
function getTerrainHeight(x, y) {
    const gridX = Math.floor((x + 50) / 100 * (width - 1));
    const gridY = Math.floor((y + 50) / 100 * (height - 1));
    const idx = (gridY * width + gridX) * 3 + 2;
    return vertices[idx] || 0;
}
```
- Converts world coordinates (-50 to +50) to grid indices (0 to 99)
- Index calculation: `(row * width + col) * 3 + 2` (vertices are x,y,z triplets)
- **Do not modify coordinate space without updating boundaries!**

#### Animation Loop Structure (Lines 199-250)
```javascript
function animate() {
    requestAnimationFrame(animate);  // Schedule next frame
    // 1. Update terrain vertices
    // 2. Compute new normals
    // 3. Update marble physics
    // 4. Keep marble on terrain surface
    // 5. Apply boundary constraints
    // 6. Update light position
    // 7. Render scene
}
```
**Order matters!** Terrain must update before physics calculations.

### What NOT to Do

❌ **Don't add build tools** (webpack, babel, etc.) - defeats simplicity purpose
❌ **Don't replace inline JavaScript** with external .js files - keep it self-contained
❌ **Don't modify Three.js version** without extensive testing - r128 is stable
❌ **Don't remove DeviceOrientation permission flow** - iOS requires it
❌ **Don't change coordinate system** (-50 to +50) without updating all calculations
❌ **Don't skip geometry.computeVertexNormals()** after vertex updates - breaks lighting
❌ **Don't remove friction/damping** - marble becomes uncontrollable
❌ **Don't use scripts/game.js code** as reference for index.html - they're separate implementations

### Performance Considerations

1. **Vertex Count**: 100×100 = 10,000 vertices updated every frame
   - Reduce grid size (width/height at lines 49-50) if performance issues
   - Don't exceed 200×200 on mobile devices

2. **Shadow Mapping**: Enabled with PCF soft shadows (line 45)
   - Reduce `shadowMap.mapSize` (lines 87-88) if slow
   - Disable shadows entirely if needed: `renderer.shadowMap.enabled = false`

3. **Animation Loop**: Runs at monitor refresh rate (typically 60 FPS)
   - Physics assumes 60 FPS via `dt = 1/60`
   - If targeting different FPS, calculate `dt` dynamically

### PWA Configuration

When modifying `manifest.json`:
- Keep `start_url: "."` for proper PWA installation
- `display: "fullscreen"` removes browser UI - intentional for game
- Icon paths assume `icon.png` exists in root (not currently in repo)
- Theme color matches black background for seamless experience

### Security & Privacy

1. **DeviceOrientation Permission**: Required on iOS 13+ (line 111)
   - Must be triggered by user gesture (button click)
   - Handle denial gracefully (lines 119-121)

2. **CDN Dependencies**: External scripts loaded from cdnjs.cloudflare.com
   - Consider SRI (Subresource Integrity) hashes for production
   - Current implementation prioritizes simplicity over security

3. **No User Data**: Application stores nothing, tracks nothing
   - Fully client-side execution
   - No cookies, localStorage, or network requests (except CDN)

### Debugging Tips

**Common Issues:**

1. **Marble falls through terrain**:
   - Check line 229: `marble.position.z = terrainHeight + 5.0`
   - Verify `getTerrainHeight()` returns valid values
   - Ensure terrain updates before marble physics (line order)

2. **Terrain appears flat**:
   - Check noise scale (line 59, 208) - too small makes flat terrain
   - Verify SimplexNoise library loaded (check browser console)
   - Check height multiplier (should be > 0)

3. **Mobile tilt not working**:
   - Verify HTTPS (required for DeviceOrientation on iOS)
   - Check permission granted (hasPermission flag)
   - Test on actual device (desktop DevTools simulation unreliable)

4. **Performance issues**:
   - Reduce terrain grid size (lines 49-50)
   - Disable shadows (line 44: `renderer.shadowMap.enabled = false`)
   - Lower shadow map resolution (lines 87-88)

**Browser Console:**
- Check for JavaScript errors
- Verify Three.js and SimplexNoise loaded
- Monitor FPS with DevTools performance tab

### Code Comments Philosophy

Current codebase uses:
- **Section comments**: Mark major functional blocks ("Scene setup", "Physics for marble")
- **Inline comments**: Explain non-obvious calculations (line 66, 159, 229)
- **Physics documentation**: Constants labeled with units (line 172-175)

When adding code:
- Comment WHY, not WHAT (code should be self-documenting)
- Explain physics/math formulas
- Note coordinate system transformations
- Document any "magic numbers"

---

## Testing Checklist for AI Assistants

Before committing changes, verify:

- [ ] Desktop mouse controls work (drag to rotate camera)
- [ ] Mobile tilt controls work (after permission granted)
- [ ] Marble rolls realistically on terrain slopes
- [ ] Marble stays within boundaries (doesn't fly off)
- [ ] Terrain undulates smoothly over time
- [ ] No console errors in browser DevTools
- [ ] Shadows render correctly
- [ ] Window resize doesn't break layout
- [ ] PWA manifest still valid (if modified)
- [ ] Both mobile and desktop code paths functional
- [ ] Physics constants unchanged (unless intentional)
- [ ] Vertex normals computed after terrain updates

---

## Future Enhancement Ideas

If users request new features, consider:

1. **Gameplay Elements**:
   - Collectible items (like scripts/game.js targets)
   - Hazards or obstacles
   - Time trials or scoring system
   - Multiple levels with different terrain patterns

2. **Visual Improvements**:
   - Skybox or environment map
   - Particle effects (dust trail behind marble)
   - Better textures (replace solid colors)
   - Post-processing effects (bloom, SSAO)

3. **Physics Enhancements**:
   - Realistic rolling friction (angular velocity)
   - Bounce on impact
   - Multiple marbles
   - Wind forces

4. **Mobile Optimizations**:
   - Lower-poly terrain on mobile detection
   - Simplified materials
   - Performance mode toggle

5. **Configuration**:
   - Settings UI for physics parameters
   - Terrain generation presets
   - Color/theme customization

**Note:** Maintain simplicity philosophy - avoid over-engineering!

---

## Architecture Decisions

### Why Inline JavaScript?
- **Simplicity**: Single file for entire 3D game
- **Portability**: Copy index.html anywhere and it works
- **No Build Step**: Instant iteration during development
- **Learning**: Easy to understand entire codebase in one view

### Why CDN Dependencies?
- **No Package Manager**: Avoid npm/yarn complexity
- **Browser Caching**: Users may already have Three.js cached
- **Simplicity**: No bundling or dependency management

### Why Both 3D and 2D Implementations?
- **Experimentation**: Project exploring different approaches
- **Fallback Option**: 2D version could serve as WebGL fallback
- **Learning**: Comparing Canvas 2D vs WebGL techniques

### Why No TypeScript/Framework?
- **Educational**: Pure JavaScript easier to understand
- **Performance**: No framework overhead
- **Simplicity**: Vanilla code runs everywhere

---

## Additional Resources

**Three.js Documentation:**
- Official Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/
- Version r128 (used here): https://github.com/mrdoob/three.js/releases/tag/r128

**Perlin/Simplex Noise:**
- Understanding Perlin Noise: https://adrianb.io/2014/08/09/perlinnoise.html
- Simplex vs Perlin: https://en.wikipedia.org/wiki/Simplex_noise

**PWA Development:**
- MDN PWA Guide: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- Web App Manifest: https://developer.mozilla.org/en-US/docs/Web/Manifest

**DeviceOrientation API:**
- MDN Documentation: https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent
- Permission Requirements: iOS 13+ requires user gesture + permission

---

## Questions & Troubleshooting

**Q: Why is scripts/perlin.js not used in index.html?**
A: The main 3D game uses SimplexNoise library from CDN. The perlin.js file was likely created for the 2D game.js implementation or early prototyping.

**Q: Can I switch from SimplexNoise to Perlin.js?**
A: Yes, but you'd need to update noise function calls (different API). SimplexNoise is faster and has better visual quality.

**Q: Why is the marble always 5 units above terrain?**
A: Line 229 sets `marble.position.z = terrainHeight + 5.0`. This represents marble radius (1 unit) plus visual offset. Adjust if marble appears to float or clip.

**Q: How do I change terrain size?**
A: Modify `width` and `height` constants (lines 49-50), and the PlaneGeometry size (line 51). Keep grid size reasonable for performance.

**Q: Can I add npm packages?**
A: Not without adding a build system. Current architecture is intentionally build-free. Consider CDN alternatives for new libraries.

**Q: Why no git tags or releases?**
A: This appears to be an experimental/learning project. Add semantic versioning if it becomes production software.

---

## Contact & Contribution

**Repository**: matthias-us/waddy
**Current Branch**: claude/add-claude-documentation-3uiL4
**Development**: Active experimental project

When contributing:
1. Read this entire CLAUDE.md file
2. Understand the inline structure philosophy
3. Test both desktop and mobile
4. Keep commits atomic and well-described
5. Maintain zero-build-tool architecture
6. Don't over-engineer solutions

---

**Last Updated**: 2026-01-12
**Document Version**: 1.0
**Codebase Version**: Based on commit 516c9b3
