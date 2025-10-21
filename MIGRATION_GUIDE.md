# BullionFX Database Migration Guide

## Overview
This guide walks you through adding the three new portfolio statistics columns to your Supabase `users` table: `profits`, `deposits`, and `expert_trades`.

## Prerequisites
- Access to your Supabase project dashboard
- Database connection or SQL editor access
- Current schema version (provided above)

## Migration Steps

### Step 1: Execute SQL in Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **+ New Query**
4. Copy and paste the following SQL:

```sql
-- Add portfolio stats columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS profits numeric(15, 2) NOT NULL DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS deposits numeric(15, 2) NOT NULL DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS expert_trades numeric(15, 2) NOT NULL DEFAULT 0.00;

-- Optional: Add column documentation
COMMENT ON COLUMN public.users.profits IS 'Trading profits from the platform';
COMMENT ON COLUMN public.users.deposits IS 'User deposits into the account';
COMMENT ON COLUMN public.users.expert_trades IS 'Earnings from expert trading features';
```

5. Click **Run** (or press `Ctrl+Enter`)
6. You should see: "Success. No rows returned." message

### Step 2: Verify the Migration

Run this query to verify the columns were added:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;
```

You should see three new rows:
- `profits` | numeric | NO | 0.00
- `deposits` | numeric | NO | 0.00  
- `expert_trades` | numeric | NO | 0.00

### Step 3: Verify Application Integration

The application already has the mapping configured in `AuthContext.tsx`:

**Supabase → JavaScript Mapping:**
```
profits           → profits
deposits          → deposits
expert_trades     → expertTrades
```

All three fields are:
- Loaded in `checkExistingSession()` with fallback to 0
- Loaded in `login()` function
- Loaded in `getAllUsers()` function
- Displayed in Dashboard.tsx
- Editable via AdminUserStatsEditor.tsx component

### Step 4: Test in Application

1. Start your development server: `npm run dev`
2. **Login as Admin:**
   - Email: `admin@bullionfx.com`
   - Password: `BullionFX@Secure2025`
3. **Navigate to Admin Users:**
   - Go to `/admin` → click "Users" section
   - Select any user
4. **Edit User Stats:**
   - Scroll to "Edit User Stats" section
   - Update Profits, Deposits, Expert Trades
   - Click "Save Changes"
   - Verify success toast notification
5. **Verify User Dashboard:**
   - Logout and login as that user
   - Verify the updated stats appear on the dashboard
   - Assets Balance should equal: Profits + Deposits + Expert Trades

### Data Type Reference

All three columns use `numeric(15, 2)`:
- **15 digits total**: Supports values up to 9,999,999,999,999.99
- **2 decimal places**: Precise to cents
- **NOT NULL constraint**: Defaults to 0.00 for existing records
- **Matches existing schema**: Same as `balance` and `initial_balance` columns

## File Changes Summary

### Database Level
- Added 3 new columns to `users` table
- All new columns: `numeric(15, 2) NOT NULL DEFAULT 0.00`

### Application Level (Already Implemented)
- **AuthContext.tsx**: Handles mapping from Supabase snake_case to camelCase
- **Dashboard.tsx**: Displays the three stats with calculated Assets Balance
- **AdminUserStatsEditor.tsx**: Component for editing stats (calls Supabase directly)
- **AdminUserDetail.tsx**: Integrated stats editor on user detail page

## Troubleshooting

### Issue: "Column already exists" error
**Solution:** The query uses `IF NOT EXISTS` so it's safe to run multiple times.

### Issue: Admin edit doesn't update user dashboard
**Solution:** 
1. Verify columns were created: Use verification query from Step 2
2. Check browser console for errors
3. Clear browser cache and refresh
4. Verify user is logged out/in after admin edit

### Issue: Stats show as 0 after migration
**Solution:** This is correct behavior. New columns default to 0.00. Use the admin interface to add values.

### Issue: TypeScript errors in IDE
**Solution:** The app is already configured. Just restart your dev server:
```bash
npm run dev
```

## Next Steps After Migration

1. ✅ Execute SQL migration
2. ✅ Verify columns in Supabase
3. ✅ Test admin editing functionality
4. ✅ Test user dashboard display
5. (Optional) Populate sample data for testing
6. Deploy to production when ready

## Sample Data (Optional Testing)

If you want to populate test data before deployment:

```sql
-- Update a specific user with test values
UPDATE public.users
SET 
  profits = 15000.50,
  deposits = 25000.00,
  expert_trades = 5000.25
WHERE email = 'test@example.com';

-- Or update all existing users with default values (already 0.00)
-- This was already done by the migration's DEFAULT 0.00 constraint
```

## Rollback Plan (If Needed)

To remove the columns (not recommended - data loss):

```sql
ALTER TABLE public.users
DROP COLUMN IF EXISTS profits,
DROP COLUMN IF EXISTS deposits,
DROP COLUMN IF EXISTS expert_trades;
```

---

**Migration Created:** October 20, 2025  
**Database Schema Version:** Updated users table with portfolio statistics columns  
**Application Version:** BullionFX Dashboard with Admin Stats Editor
