from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import shutil
import logging
from vocal_separator import process_youtube_link, split_vocals


# Cấu hình logging để hiện ra console của uvicorn
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("soniqstem-api")

app = FastAPI()

# Folder tạm để chứa file upload
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    logger.info(f"Nhận file upload: {file.filename}")
    
    # Lưu file tạm thời
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Xử lý tách lời từ file local
        vocals, no_vocals = split_vocals(file_path)
        
        # Chuyển đổi đường dẫn
        vocals_url = vocals.replace("\\", "/")
        no_vocals_url = no_vocals.replace("\\", "/")
        
        return {
            "status": "completed",
            "vocals_url": f"/{vocals_url}",
            "no_vocals_url": f"/{no_vocals_url}"
        }
    except Exception as e:
        logger.error(f"Lỗi khi xử lý file upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Xóa file upload sau khi xử lý (hoặc giữ lại tùy nhu cầu)
        # os.remove(file_path)
        pass

# Health check endpoint
@app.get("/health")
def health():
    return {"status": "ok", "message": "API is reachable"}

# Cho phép CORS để React có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cấu hình folder static để truy cập file audio đã tách
if not os.path.exists("separated"):
    os.makedirs("separated")
app.mount("/separated", StaticFiles(directory="separated"), name="separated")

class URLRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"status": "online", "message": "SoniqStem AI API is running"}

@app.post("/process-url")
def process_url(request: URLRequest):
    logger.info(f"Nhận yêu cầu xử lý URL: {request.url}")
    if not request.url:
        logger.error("Thiếu URL")
        raise HTTPException(status_code=400, detail="URL is required")
    
    result = process_youtube_link(request.url)
    
    if result["success"]:
        logger.info(f"Xử lý thành công: {result['vocals']}")
        # Chuyển đổi đường dẫn local sang URL path để frontend truy cập được
        # Ví dụ: separated\mdx_extra_q\temp_input\vocals.wav -> /separated/mdx_extra_q/temp_input/vocals.wav
        vocals_url = result["vocals"].replace("\\", "/")
        no_vocals_url = result["no_vocals"].replace("\\", "/")
        
        return {
            "status": "completed",
            "vocals_url": f"/{vocals_url}",
            "no_vocals_url": f"/{no_vocals_url}"
        }
    else:
        logger.error(f"Xử lý thất bại: {result['error']}")
        raise HTTPException(status_code=500, detail=result["error"])



@app.post("/voice-cover")
async def voice_cover_endpoint(
    audio_file: UploadFile = File(...),
    model_name: str = Form(...),
    pitch_shift: int = Form(...)
):
    logger.info(f"Yêu cầu Voice Clone: {audio_file.filename} -> Model: {model_name}, Pitch: {pitch_shift}")
    
    import time
    job_id = f"rvc_{int(time.time())}"
    job_dir = os.path.join("separated", job_id)
    os.makedirs(job_dir, exist_ok=True)
    
    input_path = os.path.join(job_dir, "input_audio" + os.path.splitext(audio_file.filename)[1])
    
    try:
        with open(input_path, "wb") as f:
            shutil.copyfileobj(audio_file.file, f)
            
        import rvc_engine
        result_path = rvc_engine.infer_audio(input_path, model_name, pitch_shift)
        
        rel_path = os.path.relpath(result_path, start=os.getcwd()).replace("\\", "/")
        return {
            "status": "completed",
            "url": f"/{rel_path}"
        }
    except Exception as e:
        logger.error(f"Lỗi Voice Clone: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Sử dụng reload=True để tự động tải lại khi code thay đổi
    uvicorn.run("api:app", host="0.0.0.0", port=8001, reload=True)
