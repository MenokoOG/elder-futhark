# Stones Migration Plan

## Constraint

The repo currently has a working `/stones` route. Do not delete it blindly.

## Recommended migration

### Option A — safest
1. add `/bindrunes`
2. add bind-rune nav item
3. verify usage and stability
4. update `/stones` page copy to mention bindrunes
5. later decide whether to redirect

### Option B — controlled replacement
1. build bind-rune landing page component
2. swap the component rendered at `/stones`
3. preserve the route path temporarily
4. add alias `/bindrunes`
5. verify analytics/navigation and regression tests

### Option C — full rename after verification
1. ship `/bindrunes`
2. update nav
3. redirect `/stones` to `/bindrunes`
4. keep a redirect note for backward compatibility

## Default recommendation
Use Option A first.
