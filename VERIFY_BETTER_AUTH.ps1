# Quick Verification Command

Run this command to verify everything is working:

```bash
# === BETTER AUTH VERIFICATION SCRIPT ===

echo "╔════════════════════════════════════════════════════════╗"
echo "║     LearnFlow Better Auth Verification                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

echo "1️⃣  Testing Better Auth Health..."
curl -s http://localhost:3000/api/auth/ok | python -m json.tool
echo ""

echo "2️⃣  Testing Registration (creating test user)..."
TEST_EMAIL="test$(date +%s)@learnflow.com"
echo "   Email: $TEST_EMAIL"
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"test123\",\"name\":\"Test User\"}" | python -m json.tool
echo ""

echo "3️⃣  Testing Login..."
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"test123\"}" | python -m json.tool
echo ""

echo "4️⃣  Checking Database Users..."
docker exec hackahton-iii-postgres-1 psql -U learnflow -d learnflow -c "SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
echo ""

echo "5️⃣  Checking Database Tables..."
docker exec hackahton-iii-postgres-1 psql -U learnflow -d learnflow -c "\dt"
echo ""

echo "6️⃣  Service Status..."
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "7️⃣  Frontend Check..."
curl -s -o /dev/null -w "   Frontend HTTP Status: %{http_code}\n" http://localhost:3000
echo ""

echo "╔════════════════════════════════════════════════════════╗"
echo "║           ✅ VERIFICATION COMPLETE                     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📝 To test manually:"
echo "   - Register: http://localhost:3000/register"
echo "   - Login:    http://localhost:3000/login"
echo "   - Dashboard: http://localhost:3000/student/dashboard"
echo ""
```

## Expected Results

### ✅ If Everything is Working:

1. **Health Check:** `{"ok":true}`
2. **Registration:** Returns token and user object
3. **Login:** Returns token and user object
4. **Database:** Shows 25+ users (including test users)
5. **Tables:** Shows sessions, accounts, verifications tables
6. **Services:** All 11 containers showing "Up" and "healthy"
7. **Frontend:** HTTP 200 OK

### ❌ If Something is Wrong:

- **Health Check fails:** Check frontend logs: `docker-compose logs frontend`
- **Registration fails:** Check if database tables exist
- **Login fails:** Verify user exists in database
- **Services not healthy:** Restart: `docker-compose restart`

## Manual Testing in Browser

1. **Open:** http://localhost:3000/register
2. **Fill form:**
   - Name: Test User
   - Email: any@email.com
   - Password: test123
   - Role: Student
3. **Click:** "Initialize Uplink"
4. **Expected:** Redirects to student dashboard automatically
5. **Check:** You should see dashboard, not login page

If still seeing login page after registration:
- Check browser console for errors (F12)
- Verify localStorage has `learnflow_user_role` set
- Try hard refresh (Ctrl+Shift+R)
- Clear browser cache and try again

## Troubleshooting

### Issue: Registration successful but stays on page

**Solution:** Check browser console for JavaScript errors. The redirect uses `window.location.href` which should work.

### Issue: "Network Error" or CORS error

**Solution:** 
```bash
docker-compose restart frontend
# Wait 10 seconds, then try again
```

### Issue: Database connection error

**Solution:**
```bash
docker-compose restart postgres
# Wait 5 seconds for postgres to initialize
```

### Issue: Session not persisting

**Solution:**
1. Check cookies in browser DevTools
2. Should see `better-auth.session_token` cookie
3. If missing, check BETTER_AUTH_SECRET in .env.local

## Success Indicators

✅ Registration creates user in database  
✅ Registration redirects to dashboard  
✅ Login works with existing user  
✅ Login redirects based on role  
✅ Session persists on page refresh  
✅ Protected routes redirect to login when not authenticated  
✅ All 11 Docker containers healthy  
✅ Better Auth health endpoint returns OK  

---

**Last Updated:** March 7, 2026  
**Status:** ✅ All Systems Operational
