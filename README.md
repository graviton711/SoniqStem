# SoniqStem AI

Advanced Neural Audio Extraction and Voice Processing.

## Features

### 1. Stem Separator
Split any song into two high-quality tracks:
- Vocals
- Instrumental (No Vocals)
Supports both local file uploads and YouTube URLs.

### 2. Voice Lab Lite
Transform vocals using Digital Signal Processing (DSP).
- Pitch Shift: Change gender or tone of a voice (Male to Female, Female to Male).
- Real-time conversion using Librosa.

## Installation

1. Prerequisites:
   - Python 3.10 or higher
   - Node.js (for Frontend)
   - FFmpeg (installed and added to PATH)

2. Setup Backend:
   cd E:\VSCODE_WORKSPACE\Music
   pip install -r requirements.txt

3. Setup Frontend:
   cd soniqstem-ai
   npm install

## Usage

1. Start the API Server:
   python api.py
   (Server runs on http://localhost:8001)

2. Start the Frontend:
   cd soniqstem-ai
   npm run dev
   (App runs on http://localhost:5173)

3. Open your browser and navigate to http://localhost:5173

## Tech Stack

- Backend: FastAPI, Demucs (Source Separation), Librosa (DSP), Torch
- Frontend: React, TailwindCSS, Lucide React
- Infrastructure: FFmpeg

## Troubleshooting

- If audio processing fails, ensure FFmpeg is correctly installed.
- Ensure backend server is running before uploading files.
