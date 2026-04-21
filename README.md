# Glaucoma Student Volunteering Platform
A full stack web application built with Vue.js and Firebase.

## Live Application
The link is proived within the appendix of my report 
Open in any browser there is no installation needed

## Test Credentials

### Option 1 Pre-made Student Account
Use this to explore the platform straight away:
Email: studentglaucoma@gmail.com 
Password: 1234567.
This account is already verified and has passed the quiz
Tasks are unlocked and ready to enroll in

### Option 2 — Full Student Journey
To experience the complete registration process from scratch:
1. Click Register on the platform
2. Fill in your details must be 18 or over
3. Use a real email address you have access to
4. Check your inbox and click the verification link
5. Log in with your email and password
6. Take the glaucoma quiz and score 75% or above
7. Browse hubs and enroll in volunteering tasks
8. Submit evidence on your dashboard
9. Log in as an organisation to approve your submission
10. Return to student dashboard to download certificate

### Organisation Accounts
| Hub | Email | Password |

Moorfields Eye Hospital | moorfields@glaucoma.com | 123456. |
Sunrise Care Home | sunrise@glaucoma.com | 123456.|
Hackney Community Vision Centre | hackney@glaucoma.com | 123456.|

## Running Locally
1. Install Node.js from https://nodejs.org
2. Extract project zip file
3. Open terminal in project folder
4. Run: npm install
5. Create.env file and add: VITE_OPENAI_API_KEY=your-key - API key provided in my report appendix 
6. Run: npm run dev
7. Open: http://localhost:5173

## Technologies
- Vue.js 3 and Vue Router
- Firebase Authentication and Cloud Firestore
- Tailwind CSS
- OpenAI API (AI Chatbot)
- jsPDF (Certificate Generation)
- Vite
