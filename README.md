## FutureGPT 

### Quick Start

#### 1) Install dependencies
```bash
# from repo root
cd client && npm install
cd ../server && npm install
```

#### 2) Configure environment variables
Create a `.env` file inside `server/` with:
```bash
# server/.env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_jwt_key
PORT=4000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

 create a `.env` file inside `client/`:
```bash
# client/.env
VITE_API_BASE_URL=your_backend_url
```

#### 3) Run (development)
Open two terminals from the repo root:
```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

