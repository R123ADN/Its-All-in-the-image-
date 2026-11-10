/* ITS cabinet inventory and code rules, copied from the Easy Cab Builder order portal (index.html).
   Hand this file, inventory-codes.csv and the notes below to the other Claude.

   WHAT TO BUILD: an inventory in the nesting / drilling portal that holds every cabinet this portal sells,
   with the same codes, sizes and options. The CSV is the supplier catalogue (384 items). The rules below
   build the codes for the cabinets the portal configures (base, Gola base, sink, drawer packs, L shape,
   corner, wall, wine rack, oven housing, bins, spice pull-out, Belfast, made to measure, robes).

   Notes the code does not say:
   - Panel thickness 18 (the factory MPR files say 18.2). Base height 720, leg height 150, depth 570, void 50.
   - Gola: J cut-out 27 x 57 at the top front of the gables; C cut-out 27 x 73 between drawers on Gola drawer
     packs only; the L shape top is set back 60; a Gola wall unit's base is set back 22. Gola cabinets are handleless.
   - Gola drawer packs: GBD3 = fronts 160 + 160 + 325 (C cut-out only between the second 160 and the 325);
     GBD2 = 325 + 325 (C cut-out between them). Both have the J cut-out on top.
   - Gola code prefixes (GBCHL for base and L shape) are as the owner asked, still to be confirmed. Sink, bins and wall units have no Gola code yet.
   - The catalogue codes read HL600 where the portal shows BHL600 (still to be matched).
   - Door width on an L shape = gable width - cabinet depth - 22 (door) - 4 (clearance); height = cabinet height - 5.
   - Drilling rules from the factory MPR files (a 600 base) are in the owner's memory notes, not in this file.
*/
const BASE = { w: 600, hinge: 'left', d: 570, v: 50, gola: false };
const baseCode = w => (BASE.gola ? 'GBCHL' : 'BHL') + w;                // a Gola normal base takes the GBCHL prefix
const GOLA_WALL_SB = 22;                              // Gola wall unit: the base panel is set back 22 from the front
const GOLA_C = { d: 27, h: 73 };                      // Gola C profile notch between two drawers of a drawer pack, mm
const golaRows = (hs, yb, yt) => { const g = hs.length > 1 ? (yt - yb - hs.reduce((a, b) => a + b, 0)) / (hs.length - 1) : 0; let top = yt; return hs.map(h => { const r = { ytop: top, ybot: top - h }; top -= h + g; return r; }); };   // Gola drawer pack: fronts at their real heights, the left-over height shared between the gaps
const GOLA_CUT = { d: 27, h: 57 };                  // Gola (J profile) notch in the front top corner of each side panel of a normal base, mm
const BASE_H = 720;                                   // base units are always 720 high

const legQty = w => w <= 150 ? 2 : w <= 600 ? 4 : 5;
const clipQty = w => w <= 150 ? 1 : w <= 600 ? 2 : 3;
/* Door hinging: a 400, 500 or 600 wide cabinet with a single door can also be hinged on both sides, which makes it a pair of doors. */
const bothOk = w => w === 400 || w === 500 || w === 600;
const hingeSide = (h, w) => h === 'both' && bothOk(w) ? 'both' : h === 'right' ? 'right' : 'left';

const hingeText = (h, w) => { const s = hingeSide(h, w); return s === 'both' ? 'Pair of doors, hinged both sides' : s.toUpperCase() + ' door hinge'; };

const SINK = { w: 600, hinge: 'left', d: 560, v: 50, rail: 'horizontal', liner: false, backOff: false, gola: false };
const SINK_WIDTHS = [500, 600, 700, 800, 900, 1000, 1200];
const sinkCode = w => 'BHL' + w + 'S';                // BHL + cabinet width + S, e.g. BHL800S

const DL = { w: 600, hinge: 'left', sys: 'Antaro', d: 560, v: 50, drawers: 'single' };
const DL_WIDTHS = [300, 400, 450, 500, 600, 800, 900, 1000, 1200];
const dlDouble = () => DL.w > 600;                                   // over 600 wide it always has two drawers side by side
const dlDrawer = () => ({ fronts: [1], open: [170], h: 200, cols: dlDouble() ? 2 : 1 });
const dlCode = w => 'BDL' + w;

const BIN = { w: 600, opt: 0, d: 570, v: 50 };           // pull-outs are fixed at 570 deep with a 50 void
const BIN_WIDTHS = [300, 400, 500, 600];
const BIN_OPTS = {
  300: [{ label: '1 x 25L', cols: [[25]] }],
  400: [{ label: '1 x 25L', cols: [[25]] }],
  500: [{ label: '2 x 35L', cols: [[35], [35]] }],
  600: [{ label: '2 x 45L', cols: [[45], [45]] }, { label: '2 x 25L + 2 x 15L', cols: [[25, 15], [25, 15]] }]
};
const binCode = w => 'BHL' + w + 'BS';                // BHL + width + BS, e.g. BHL600BS

const SPO = { w: 300, d: 570, v: 50 };
const SPO_WIDTHS = [150, 300];
const spoCode = w => 'BHL' + w + 'SPO';

const BEL = { w: 600, h: 455, doors: 'single', hinge: 'left', d: 560, v: 50 };
const BEL_HEIGHTS = { 600: [455, 495], 800: [495] };            // the codes on offer: 600BFS455, 600BFS495, 800BFS495
const BEL_WIDTHS = [600, 800];
const belPair = () => BEL.w > 600 || BEL.doors === 'double';
const belCode = (w, h) => w + 'BFS' + h;                         // width + BFS + height

const WINE = { opt: 0, d: 570, v: 50 };
const WINE_OPTS = [
  { code: 'BWR150', w: 150, cols: 1, x: false, label: '150 Wine Rack' },
  { code: 'BWR300', w: 300, cols: 2, x: false, label: '300 Wine Rack' },
  { code: 'BWRX500', w: 500, cols: 1, x: true, label: '500 X Wine Rack' },
  { code: 'BWRX600', w: 600, cols: 1, x: true, label: '600 X Wine Rack' }
];
const wineOpt = () => WINE_OPTS[WINE.opt] || WINE_OPTS[0];

const OVEN = { drawer: false, sys: 'Antaro', w: 600, d: 570, v: 50 };
const OVEN_DRAWER_H = 115;                                         // the shelf height below adds 150, the leg height the picture stands the unit on
const ovenCode = () => !OVEN.drawer ? '600_BUOH' : '600_BUOH' + ({ Antaro: 'A', Legrabox: 'L', Merivo: 'M' })[OVEN.sys];

const LSH = { rh: 1000, lh: 1000, d: 570, v: 50, hinge: '155', gola: false };
/* Door width for any L shape (base, wall unit or robe): the gable width, right or left hand, less the depth of the
   cabinet, less 22mm (the door thickness), less 4mm (clearance). The height is the cabinet height less 5mm, so a
   720 cabinet has a 715 door. Bifold hinges join the two doors so they fold together;
   155 hinges hang each door on its own wing. */
const L_DOOR_DEDUCT = 22 + 4;
const lshDoors = () => ({ rh: LSH.rh - LSH.d - L_DOOR_DEDUCT, lh: LSH.lh - LSH.d - L_DOOR_DEDUCT, h: BASE_H - 5 - (LSH.gola ? GOLA_CUT.h : 0) });   // a Gola door stops below the J profile cut-out
const GOLA_L_D = 60;                                  // on an L shape the top is set back 60 from the front (a normal base is 27)

const WALL = { h: 720, w: 600, hinge: 'left', d: 300, v: 50, gola: false };
const wallGolaText = () => 'Gola: base set back ' + GOLA_WALL_SB + ' mm from the front, handleless';
const WALL_HEIGHTS = [575, 720, 900];
const WALL_WIDTHS = [150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1100, 1200];
const WALL_PREFIX = { 575: 'WS', 720: 'WM', 900: 'WT' };
const WALL_SHELVES = { 575: 1, 720: 2, 900: 3 };
const WALL_LIM = { d: [300, 600], v: [0, 100] };
const wallClamp = () => { WALL.d = Math.min(WALL_LIM.d[1], Math.max(WALL_LIM.d[0], WALL.d)); WALL.v = Math.min(Math.min(WALL_LIM.v[1], WALL.d - 150), Math.max(WALL_LIM.v[0], WALL.v)); };
const wallCode = () => WALL_PREFIX[WALL.h] + WALL.w + (WALL.d >= 330 ? Math.round(WALL.d / 10) + 'D' : '');
const wallPair = () => WALL.w > 600 || hingeSide(WALL.hinge, WALL.w) === 'both', wallPost = () => WALL.w > 700;
const wallHangers = () => WALL.v >= 20;                       // a void under 20 leaves no room for wall hangers

const CORNER = { w: 1000, side: 'right', door: 500, d: 570, v: 50, carousel: false };
const CORNER_WIDTHS = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500];
const CORNER_T = 18.2;                                            // the internal blank panel
const CORNER_MIN_DOOR = 300;                                      // the door can't be narrower than this
const cornerDoorMax = () => Math.floor(CORNER.w - CORNER_T - 50);   // leaves at least a 50mm blank
const cornerDoor = () => Math.min(Math.max(CORNER.door, CORNER_MIN_DOOR), cornerDoorMax());
const cornerBlank = () => Math.round((CORNER.w - cornerDoor() - CORNER_T) * 10) / 10;   // blank = cabinet width - door size - 18.2
const cornerCode = () => 'BCHL' + CORNER.w + (CORNER.side === 'right' ? 'RB' : 'LB');

const MTM = { w: 600, h: 720, d: 570, shelves: 1, top: 'rail', back: 'fixed', v: 50, backH: 400 };
const MTM_CODE = 'MTM Base';
const MTM_LIM = { w: [150, 1200], h: [300, 900], d: [200, 800], shelves: [0, 8], v: [0, 100], backH: [50, 864] };
const mtmBackH = () => Math.min(MTM.backH, MTM.h - 36);              // the custom back can't be taller than the space between the top and bottom panels

const ROBE = { w: 600, hinge: 'left', d: 600, v: 50 };
const ROBE_H = 2150;
const BEDROOM_OPTS = [{ id: 'robes', name: 'Single Hanging Robe', desc: 'Hanging rail and top shelf. Pick the width from 300 to 1200.', icon: 'cube' }];
const robeWidths = () => DB.items.filter(i => i.active !== false && /^(SR|DR)\d+B$/.test(i.code) && i.w >= 300 && i.w <= 1200).sort((a, b) => a.w - b.w);

const DP_TYPES = [
  { id: 'd3', name: '3 Drawer Base Unit', code: 'D3', fronts: [0.26, 0.37, 0.37], open: [170, 0, 0] },
  { id: 'p2i1', name: '2 Pan Drawer + 1 Internal Drawer Unit', code: 'D2I1', fronts: [0.5, 0.5], internal: true, internalPull: 160 },
  { id: 'd4', name: '4 Drawer Base Unit', code: 'D4', fronts: [0.17, 0.17, 0.33, 0.33], open: [170, 120, 70, 0] },
  /* Gola drawer packs: their own range. Front heights are fixed; the J profile cut-out is on top and a C profile cut-out sits only
     in the gap(s) named by cGaps (gap 0 is below the first front). */
  { id: 'gd3', name: 'Gola 3 Drawer Base Unit (2 x 160 + 325)', code: 'GBD3', gola: true, hs: [160, 160, 325], cGaps: [1], fronts: [160, 160, 325], open: [170, 0, 0], plain: true },
  { id: 'gd2', name: 'Gola 2 Drawer Base Unit (2 x 325)', code: 'GBD2', gola: true, hs: [325, 325], cGaps: [0], fronts: [325, 325], open: [170, 0], plain: true }
];
const DP_SYSTEMS = ['Antaro', 'Legrabox', 'Merivo'];
const DP_WIDTHS = Array.from({ length: 19 }, (_, i) => 300 + i * 50);          // 300 to 1200 in 50s
const DPK = {}; DP_TYPES.forEach(t => DPK[t.id] = { w: 600, sys: 'Antaro', d: 570, v: 50 });
const dpGolaText = t => 'Gola: J profile cut-out ' + GOLA_CUT.d + ' x ' + GOLA_CUT.h + ' mm at the top, and ' + t.cGaps.length + ' x C profile cut-out ' + GOLA_C.d + ' x ' + GOLA_C.h + ' mm ' + (t.hs.length === 3 ? 'between the 160 and the 325 drawer (none between the two 160s)' : 'between the two 325 drawers') + '. Fronts: ' + t.hs.join(' + ') + ' mm';
const dpType = id => DP_TYPES.find(t => t.id === id);
const dpCode = (t, w) => t.gola ? t.code + w : 'DP' + w + t.code;           // Gola packs: GBD3 / GBD2 + width, e.g. GBD3600

