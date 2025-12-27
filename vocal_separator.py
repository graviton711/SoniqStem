import os
import sys
import shutil
import subprocess
import yt_dlp
import time
import logging
from datetime import datetime

logger = logging.getLogger("soniqstem-api")

def get_ffmpeg_path():
    """Lấy đường dẫn ffmpeg dựa trên ENV hoặc đường dẫn mặc định của ffdl"""
    local_appdata = os.environ.get('LOCALAPPDATA', os.path.expanduser('~\\AppData\\Local'))
    return os.path.join(local_appdata, "ffmpegio", "ffmpeg-downloader", "ffmpeg", "bin")

def download_audio(url, output_dir="temp_downloads"):
    """Tải audio từ YouTube URL"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # Tạo tên file duy nhất để tránh cache hoặc overwrite
    timestamp = int(time.time())
    ydl_opts = {
        'format': 'bestaudio/best',
        'noplaylist': True,
        'outtmpl': os.path.join(output_dir, f'input_{timestamp}_%(id)s.%(ext)s'),
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)
        return filename

def split_vocals(input_file, output_base_dir="separated"):
    """Tách lời và nhạc nền bằng Demucs"""
    ffmpeg_bin = get_ffmpeg_path()
    env = os.environ.copy()
    env["PATH"] = ffmpeg_bin + os.pathsep + env["PATH"]

    # Tạo tên thư mục công việc duy nhất dựa trên timestamp
    job_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    job_dir = os.path.join(output_base_dir, job_id)
    if not os.path.exists(job_dir):
        os.makedirs(job_dir)

    # Đổi tên file tạm để tránh lỗi encoding
    ext = os.path.splitext(input_file)[1]
    temp_input = os.path.join(job_dir, f"input{ext}")
    shutil.copy(input_file, temp_input)

    logger.info(f"--- Bắt đầu tách lời (Demucs) vào {job_dir}... ---")
    start_time = time.time()
    
    command = [
        "demucs",
        "-n", "mdx_extra_q",
        "--two-stems", "vocals",
        "-o", job_dir,
        temp_input
    ]

    try:
        # Chạy demucs và in output trực tiếp ra console của API
        process = subprocess.Popen(command, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        for line in process.stdout:
            logger.info(f"  [Demucs] {line.strip()}")
        
        process.wait()
        if process.returncode != 0:
            raise subprocess.CalledProcessError(process.returncode, command)
        
        elapsed = time.time() - start_time
        logger.info(f"--- Tách lời hoàn tất! (Thời gian: {elapsed:.1f}s) ---")
        
        # Đường dẫn mặc định của demucs: job_dir / model_name / filename_without_ext / stem.wav
        model_name = "mdx_extra_q"
        output_dir = os.path.join(job_dir, model_name, "input")
        
        vocals_wav = os.path.join(output_dir, "vocals.wav")
        no_vocals_wav = os.path.join(output_dir, "no_vocals.wav")
        
        # Convert sang MP3 để trình duyệt seek mượt hơn
        vocals_mp3 = os.path.join(output_dir, "vocals.mp3")
        no_vocals_mp3 = os.path.join(output_dir, "no_vocals.mp3")
        
        logger.info("--- Đang chuyển đổi sang MP3 (CBR 192k)... ---")
        subprocess.run([os.path.join(ffmpeg_bin, "ffmpeg"), "-y", "-i", vocals_wav, "-b:a", "192k", vocals_mp3], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run([os.path.join(ffmpeg_bin, "ffmpeg"), "-y", "-i", no_vocals_wav, "-b:a", "192k", no_vocals_mp3], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Trả về đường dẫn tương đối để API dễ quản lý
        rel_vocals = os.path.relpath(vocals_mp3, start=os.getcwd())
        rel_no_vocals = os.path.relpath(no_vocals_mp3, start=os.getcwd())
        
        return rel_vocals, rel_no_vocals
    finally:
        if os.path.exists(temp_input):
            os.remove(temp_input)

def process_youtube_link(url):
    """Quy trình trọn gói: Tải -> Tách -> Trả về kết quả"""
    audio_file = None
    try:
        logger.info(f"--- Đang tải audio từ: {url} ---")
        audio_file = download_audio(url)
        
        logger.info(f"--- Đang tách lời cho: {audio_file} ---")
        vocals, no_vocals = split_vocals(audio_file)
        
        # Cleanup file tải về sau khi đã copy vào thư mục job
        if audio_file and os.path.exists(audio_file):
            try:
                os.remove(audio_file)
            except Exception as e:
                logger.warning(f"Không thể xóa file tạm {audio_file}: {e}")
        
        return {
            "success": True,
            "vocals": vocals,
            "no_vocals": no_vocals,
            "original_file": audio_file
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        res = process_youtube_link(sys.argv[1])
        print(res)
    else:
        print("Sử dụng: python vocal_separator.py <youtube_url>")
