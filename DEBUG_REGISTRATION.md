# 🔍 DEBUG REGISTRATION - STEP BY STEP

**Frontend updated with detailed logging. Ab follow these steps EXACTLY:**

---

## 📋 STEP 1: Open Browser DevTools

1. Open: **http://localhost:3000/register**
2. Press: **F12** (opens Developer Tools)
3. Click on: **Console** tab (on the right side)

---

## 📋 STEP 2: Register a Test User

Fill the form with EXACT values:

```
Name: Test User
Email: test@example.com  
Password: test123
Role: Student (click "Student" button)
```

Then click: **"Initialize Uplink"** button

---

## 📋 STEP 3: Watch Console Output

You should see logs like this:

```
=== REGISTRATION STARTED ===
Form data: {email: "test@example.com", name: "Test User", role: "student"}
API URL: http://localhost:3000

=== SIGN UP RESPONSE ===
Data: {user: {...}, token: "..."}
Error: undefined

User registered successfully: {id: "...", email: "...", ...}
Role stored in localStorage: student
Verified stored role: student

Waiting 500ms for session cookie...

=== PREPARING REDIRECT ===
Role: student
Current URL: http://localhost:3000/register
Window location object: Location {...}

Redirecting to STUDENT dashboard...
Redirect initiated to: http://localhost:3000/student/dashboard

=== REGISTRATION HANDLER COMPLETE ===
Is loading: false
```

---

## 📋 STEP 4: Check What Happens

### ✅ IF IT WORKS (Redirects to Dashboard)

You'll see:
- URL changes to `/student/dashboard`
- Dashboard page loads
- You see the student interface

**CONGRATULATIONS!** 🎉 Registration is working!

---

### ❌ IF IT DOESN'T WORK (Stays on Register Page)

Check console for ONE of these errors:

#### Error Type 1: Network Error
```
Failed to fetch
NetworkError when attempting to fetch resource
```
**Meaning:** Backend API not reachable  
**Fix:** Run `docker-compose restart triage-agent`

#### Error Type 2: authClient Error
```
authClient is not defined
Cannot read property 'signUp' of undefined
```
**Meaning:** Frontend build issue  
**Fix:** Run `docker-compose restart frontend`

#### Error Type 3: Better Auth Error
```
Failed to execute 'signUp' on 'authClient': [error message]
```
**Meaning:** Better Auth configuration issue  
**Fix:** Share the exact error message

#### Error Type 4: No Logs At All
If you see NO logs in console:
**Meaning:** Form submit not triggering  
**Fix:** Check if button is disabled or form has validation error

---

## 📋 STEP 5: If Redirect Doesn't Happen

### Check Network Tab

1. Click on **Network** tab (F12)
2. Clear all logs (🚫 icon)
3. Try registering again
4. Look for request named `sign-up` or `email`
5. Click on it
6. Check **Status** column - should be **200 OK**
7. Check **Response** tab - should show user data

**Screenshot this and share if failing**

---

### Check Application/Storage Tab

1. Click on **Application** tab (F12)
2. On left side, expand **Local Storage**
3. Click on `http://localhost:3000`
4. Look for key: `learnflow_user_role`
5. Value should be: `student`

**If NOT present:** localStorage not working  
**If present:** Redirect logic issue

Screenshot this and share

---

### Check Cookies

1. Still in **Application** tab
2. Expand **Cookies** on left
3. Click on `http://localhost:3000`
4. Look for cookie named: `better-auth.session_token`
5. Should have a long string value

**If NOT present:** Better Auth not setting cookie  
**If present:** Session working but redirect broken

Screenshot this and share

---

## 📋 STEP 6: Manual Tests

### Test 1: Check localStorage Manually

In Console (F12 > Console), type:
```javascript
console.log('Role:', localStorage.getItem('learnflow_user_role'));
console.log('All items:', localStorage);
```

Should show: `Role: student`

---

### Test 2: Manual Redirect

In Console, type:
```javascript
window.location.href = '/student/dashboard';
```

**If this redirects:** Redirect code is working, issue is in flow  
**If this doesn't redirect:** Browser issue or route doesn't exist

---

### Test 3: Check if Route Exists

In browser address bar, manually go to:
```
http://localhost:3000/student/dashboard
```

**If page loads:** Route exists  
**If 404:** Dashboard page not deployed

---

## 📋 STEP 7: What to Share

If still not working, share THESE screenshots:

1. **Console Tab** - Full output after clicking register button
2. **Network Tab** - Show the sign-up request with status 200 or error
3. **Application > Local Storage** - Show all keys/values
4. **Application > Cookies** - Show all cookies
5. **Current URL** - What's in address bar after clicking button

---

## 🚀 Quick Diagnostic Commands

Run these in PowerShell to verify backend:

```powershell
Write-Host "=== Backend Health Check ==="

Write-Host "`n1. Better Auth API:"
curl.exe -s http://localhost:3000/api/auth/ok

Write-Host "`n`n2. Test Registration API:"
curl.exe -X POST http://localhost:3000/api/auth/sign-up/email `
  -H "Content-Type: application/json" `
  -d '{"email":"diag@test.com","password":"test123","name":"Diagnostic"}'

Write-Host "`n`n3. Database Users:"
docker exec hackahton-iii-postgres-1 psql -U learnflow -d learnflow -c "SELECT COUNT(*) as user_count FROM users;"

Write-Host "`n`n4. Container Status:"
docker-compose ps frontend triage-agent
```

---

## 🎯 Most Likely Issues

### Issue 1: Form Submit Not Working
**Symptoms:** No console logs at all  
**Cause:** Button disabled or form validation  
**Check:** Is button grayed out? Any HTML5 validation errors?

### Issue 2: API Call Failing
**Symptoms:** "Failed to fetch" or network error  
**Cause:** Backend not running on port 3000  
**Fix:** `docker-compose restart frontend triage-agent`

### Issue 3: Redirect Blocked
**Symptoms:** All logs show but no redirect  
**Cause:** Browser popup blocker or security setting  
**Fix:** Try different browser or incognito mode

### Issue 4: Session Not Setting
**Symptoms:** Redirects but immediately back to login  
**Cause:** Cookies blocked or Better Auth misconfigured  
**Fix:** Check Application > Cookies for session token

---

## 📞 Emergency Fallback

If NOTHING works, you can manually:

1. Register via API:
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"manual@test.com\",\"password\":\"test123\",\"name\":\"Manual\"}"
```

2. Manually set localStorage:
```javascript
localStorage.setItem('learnflow_user_role', 'student');
```

3. Manually redirect:
```javascript
window.location.href = '/student/dashboard';
```

---

**Updated:** March 7, 2026  
**Frontend:** Enhanced with detailed logging  
**Next:** Follow steps above and share console output
