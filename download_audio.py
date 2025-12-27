import yt_dlp
import sys
import os

def download_audio(url):
    """
    Downloads audio from a YouTube URL and tries to convert it to MP3.
    Requires yt-dlp. ffmpeg is recommended for MP3 conversion.
    """
    print(f"Bắt đầu xử lý link: {url}")
    
    # Cấu hình cho yt-dlp
    ydl_opts = {
        'format': 'bestaudio/best',
        'noplaylist': True,  # Chỉ tải clip đơn, không tải cả playlist
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': '%(title)s.%(ext)s',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            # Nếu ffmpeg có sẵn, ext sẽ được đổi thành mp3 bởi postprocessor
            # Nếu không, nó sẽ giữ nguyên định dạng gốc
            print(f"\n✅ Đã tải xong: {filename}")
    except Exception as e:
        print(f"\n❌ Có lỗi xảy ra: {str(e)}")
        if "ffmpeg" in str(e).lower():
            print("\n💡 Lưu ý: Code này cần 'ffmpeg' để chuyển sang MP3.")
            print("Đang thử tải định dạng audio gốc mà không chuyển đổi...")
            
            # Thử lại mà không có postprocessors
            ydl_opts.pop('postprocessors')
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([url])
                print("\n✅ Đã tải xong định dạng audio gốc.")
            except Exception as e2:
                print(f"❌ Vẫn không tải được: {str(e2)}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        video_url = sys.argv[1]
    else:
        # Link mặc định từ yêu cầu của bạn
        video_url = "https://youtu.be/v4xhCKLObtI?list=RDv4xhCKLObtI"
    
    download_audio(video_url)
