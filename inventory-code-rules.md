# Cabinet code rules used by the order portal

The catalogue file `inventory-codes.csv` holds the 384 supplier price-list items. The order portal builds these cabinet codes from the options picked on each card.

| Cabinet | Code | Example |
|---|---|---|
| Highline base | BHL + width | BHL600 |
| Gola base | GBCHL + width | GBCHL600 |
| Single sink base | BHL + width + S | BHL800S |
| Bin base | BHL + width + BS | BHL600BS |
| Spice pull-out base | BHL + width + SPO | BHL300SPO |
| Drawer pack | DP + width + D3 / D2I1 / D4 | DP600D3 |
| Gola drawer pack, 3 drawer (160 + 160 + 325) | GBD3 + width | GBD3600 |
| Gola drawer pack, 2 drawer (325 + 325) | GBD2 + width | GBD2600 |
| L shape corner base | BCHL + right hand width + x + left hand width | BCHL1000x1000 |
| Gola L shape | GBCHL + right hand width + x + left hand width | GBCHL1000x1000 |
| Corner base with blank | BCHL + width + RB or LB | BCHL1000RB |
| Wine rack | BWR150, BWR300, BWRX500, BWRX600 | BWR300 |
| Wall unit | WS (575), WM (720) or WT (900) + width, then depth in cm + D once the depth is 330 or more | WM600, WT40033D |

Fixed sizes: panel 18, base height 720 (870 with 150 legs), standard depth 570, void 50.
Gola: J cut-out 27 x 57 at the top front of the gables, C cut-out 27 x 73 between drawers (Gola drawer packs only), L shape top set back 60, wall unit base set back 22.
Legs: 2 for 150 wide, 4 for 200 to 600, 5 for 700 to 1200. Plinth clips: 1, 2, 3.
