# import os
# import uuid
# import cv2
# import numpy as np
# import imageio
# import mimetypes
# from fastapi import FastAPI, File, UploadFile, Form
# from fastapi.responses import StreamingResponse
# from fastapi.middleware.cors import CORSMiddleware
# from ultralytics import YOLO, SAM

# # === Constants ===
# INPUT_DIR = "inputs"
# OUTPUT_DIR = "outputs"
# MODEL_DIR = "models"
# SAM_MODEL_PATH = "sam/sam2_b.pt"

# MODELS = {
#     "Army": os.path.join(MODEL_DIR, "army.pt"),
#     "Navy": os.path.join(MODEL_DIR, "navy.pt"),
#     "Airforce": os.path.join(MODEL_DIR, "airforce.pt")
# }

# # === App setup ===
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# os.makedirs(INPUT_DIR, exist_ok=True)
# os.makedirs(OUTPUT_DIR, exist_ok=True)

# # === ImageProcessor Class ===
# class ImageProcessor:
#     def __init__(self, yolo_path: str, sam_path: str):
#         self.yolo_model = YOLO(yolo_path)
#         self.sam_model = SAM(sam_path)

#     def process_video(self, video_path: str, output_path: str):
#         cap = cv2.VideoCapture(video_path)
#         if not cap.isOpened():
#             raise Exception("Could not open video")

#         fps = cap.get(cv2.CAP_PROP_FPS)
#         w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#         h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
#         out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))

#         while cap.isOpened():
#             ret, frame = cap.read()
#             if not ret:
#                 break

#             results_yolo = self.yolo_model(frame)
#             boxes_yolo = []
#             for result in results_yolo:
#                 class_ids = result.boxes.cls.int().tolist()
#                 if class_ids:
#                     boxes_yolo.extend(result.boxes.xyxy.tolist())

#             results_sam = None
#             if boxes_yolo:
#                 results_sam = self.sam_model(frame, bboxes=boxes_yolo, verbose=False, save=False, device="cpu")

#             frame_plot = results_yolo[0].plot()
#             if results_sam and results_sam[0].masks is not None:
#                 masks = results_sam[0].masks.data.cpu().numpy()
#                 combined_mask = np.zeros_like(frame[:, :, 0], dtype=np.uint8)
#                 for mask in masks:
#                     combined_mask = np.maximum(combined_mask, (mask * 255).astype(np.uint8))
#                 masked_frame = frame.copy()
#                 masked_frame[combined_mask > 0] = [0, 255, 0]
#                 frame_plot = cv2.addWeighted(frame_plot, 0.7, masked_frame, 0.3, 0)

#             out.write(frame_plot)

#         cap.release()
#         out.release()

#     def convert_to_gif(self, video_path: str, gif_path: str):
#         cap = cv2.VideoCapture(video_path)
#         if not cap.isOpened():
#             raise Exception("Failed to open video for GIF conversion")

#         fps = cap.get(cv2.CAP_PROP_FPS)
#         frames = []

#         while True:
#             ret, frame = cap.read()
#             if not ret:
#                 break
#             rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#             frames.append(rgb)

#         cap.release()

#         imageio.mimsave(gif_path, frames, fps=int(fps))


# # === Routes ===
# @app.post("/process")
# async def process_file(mode: str = Form(...), file: UploadFile = File(...)):
#     assert mode in MODELS, "Invalid mode"

#     file_id = str(uuid.uuid4())
#     filename_base = f"{file_id}_{file.filename.rsplit('.', 1)[0]}"
#     input_path = os.path.join(INPUT_DIR, f"{filename_base}.mp4")
#     output_video = os.path.join(OUTPUT_DIR, f"{filename_base}_processed.mp4")
#     output_gif = os.path.join(OUTPUT_DIR, f"{filename_base}_processed.gif")

#     # Save input video
#     with open(input_path, "wb") as f:
#         f.write(await file.read())

#     # Process video and convert to GIF
#     processor = ImageProcessor(MODELS[mode], SAM_MODEL_PATH)
#     processor.process_video(input_path, output_video)
#     processor.convert_to_gif(output_video, output_gif)

#     return {
#         "gif_path": os.path.basename(output_gif),
#         "mp4_path": os.path.basename(output_video)
#     }


# @app.get("/download/{filename}")
# def download_file(filename: str):
#     file_path = os.path.join(OUTPUT_DIR, filename)
#     mime_type, _ = mimetypes.guess_type(file_path)
#     if not mime_type:
#         mime_type = "application/octet-stream"

#     def iterfile():
#         with open(file_path, mode="rb") as file_like:
#             yield from file_like

#     return StreamingResponse(
#         iterfile(),
#         media_type=mime_type,
#         headers={
#             "Content-Disposition": f'attachment; filename="{filename}"',
#             "Cache-Control": "no-cache",
#             "Accept-Ranges": "bytes"
#         }
#     )



import os
import uuid
import cv2
import numpy as np
import imageio
import mimetypes
import shutil
import torch
from datetime import datetime
from PIL import Image as PILImage
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from ultralytics import YOLO, SAM
from fpdf import FPDF

# === CONFIG ===
INPUT_DIR = "inputs"
OUTPUT_DIR = "outputs"
MODEL_DIR = "models"
DEPTH_MODEL_NAME = "depth-anything/Depth-Anything-V2-Small-hf"
DEPTH_DIR = "depth_outputs"
SAM_MODEL_PATH = "sam/sam2_b.pt"

MODELS = {
    "Army": os.path.join(MODEL_DIR, "army.pt"),
    "Navy": os.path.join(MODEL_DIR, "navy.pt"),
    "Airforce": os.path.join(MODEL_DIR, "airforce.pt"),
    "Guns": os.path.join(MODEL_DIR, "guns.pt"),
}

os.makedirs(INPUT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(DEPTH_DIR, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === DEPTH SETUP ===
depth_pipe = pipeline(
    task="depth-estimation",
    model=DEPTH_MODEL_NAME,
    device=0 if torch.cuda.is_available() else -1
)

# === ImageProcessor Class ===
class ImageProcessor:
    def __init__(self, yolo_path: str, sam_path: str, file_id: str):
        self.yolo_model = YOLO(yolo_path) if yolo_path else None
        self.sam_model = SAM(sam_path) if sam_path else None
        self.file_id = file_id
        self.image_dir = os.path.join(OUTPUT_DIR, f"{file_id}_images")
        self.segmented_dir = os.path.join(OUTPUT_DIR, f"{file_id}_segmented")
        os.makedirs(self.image_dir, exist_ok=True)
        os.makedirs(self.segmented_dir, exist_ok=True)

    def estimate_depth(self, frame):
        image_pil = PILImage.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        depth_output = depth_pipe(image_pil)
        depth_map = depth_output["depth"]
        depth_path = os.path.join(DEPTH_DIR, f"{self.file_id}_depth.png")
        depth_map.save(depth_path)
        return depth_path

    def process_video(self, video_path: str):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception("Could not open video")

        fps = cap.get(cv2.CAP_PROP_FPS)
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        out_video_path = os.path.join(OUTPUT_DIR, f"{self.file_id}_processed.mp4")
        out = cv2.VideoWriter(out_video_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))

        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            img_path = os.path.join(self.image_dir, f"frame_{frame_idx:04d}.png")
            cv2.imwrite(img_path, frame)

            if frame_idx == 0:
                self.estimate_depth(frame)

            results_yolo = self.yolo_model(frame) if self.yolo_model else None
            boxes_yolo = [box.xyxy.tolist() for r in results_yolo for box in r.boxes if r.boxes.cls.numel() > 0] if results_yolo else []

            results_sam = self.sam_model(frame, bboxes=boxes_yolo, device="cuda" if torch.cuda.is_available() else "cpu") if boxes_yolo else None

            frame_plot = results_yolo[0].plot() if results_yolo else frame

            if results_sam and results_sam[0].masks is not None:
                masks = results_sam[0].masks.data.cpu().numpy()
                combined_mask = np.zeros_like(frame[:, :, 0], dtype=np.uint8)
                for mask in masks:
                    combined_mask = np.maximum(combined_mask, (mask * 255).astype(np.uint8))
                masked_frame = frame.copy()
                masked_frame[combined_mask > 0] = [0, 255, 0]
                frame_plot = cv2.addWeighted(frame_plot, 0.7, masked_frame, 0.3, 0)

                seg_path = os.path.join(self.segmented_dir, f"seg_{frame_idx:04d}.png")
                cv2.imwrite(seg_path, frame_plot)

            out.write(frame_plot)
            frame_idx += 1

        cap.release()
        out.release()
        return out_video_path

    def convert_to_gif(self, video_path: str):
        cap = cv2.VideoCapture(video_path)
        frames = []
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(rgb)
        cap.release()
        gif_path = os.path.join(OUTPUT_DIR, f"{self.file_id}_processed.gif")
        imageio.mimsave(gif_path, frames, fps=10,loop=0)
        return gif_path

    def generate_report(self):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        depth_img = os.path.join(DEPTH_DIR, f"{self.file_id}_depth.png")
        seg_first = os.path.join(self.segmented_dir, "seg_0000.png")

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=14)
        pdf.cell(200, 10, txt="AI Video Analysis Report", ln=True, align='C')
        pdf.cell(200, 10, txt=f"Generated: {timestamp}", ln=True)

        if os.path.exists(depth_img):
            pdf.cell(200, 10, txt="Depth Map:", ln=True)
            pdf.image(depth_img, x=30, w=150)
        if os.path.exists(seg_first):
            pdf.cell(200, 10, txt="First Frame Segmentation:", ln=True)
            pdf.image(seg_first, x=30, w=150)

        pdf_path = os.path.join(OUTPUT_DIR, f"{self.file_id}_report.pdf")
        pdf.output(pdf_path)
        return pdf_path

# === ROUTES ===
@app.post("/process")
async def process_file(mode: str = Form(...), file: UploadFile = File(...)):
    assert mode in MODELS, "Invalid mode"
    file_id = str(uuid.uuid4())
    input_path = os.path.join(INPUT_DIR, f"{file_id}.mp4")
    with open(input_path, "wb") as f:
        f.write(await file.read())

    processor = ImageProcessor(MODELS[mode], SAM_MODEL_PATH, file_id)
    processed_mp4 = processor.process_video(input_path)
    gif_path = processor.convert_to_gif(processed_mp4)

    return {
        "file_id": file_id,
        "gif_path": os.path.basename(gif_path),
        "mp4_path": os.path.basename(processed_mp4)
    }

@app.get("/download/{filename}")
def download_file(filename: str):
    path = os.path.join(OUTPUT_DIR, filename)
    mime_type, _ = mimetypes.guess_type(path)
    return FileResponse(path, media_type=mime_type or "application/octet-stream", filename=filename)

@app.get("/report/{file_id}")
def get_pdf(file_id: str):
    processor = ImageProcessor(None, None, file_id)
    report = processor.generate_report()
    return FileResponse(report, media_type="application/pdf", filename=os.path.basename(report))

@app.get("/imageszip/{file_id}")
def zip_original(file_id: str):
    dir_path = os.path.join(OUTPUT_DIR, f"{file_id}_images")
    zip_path = shutil.make_archive(dir_path, 'zip', dir_path)
    return FileResponse(zip_path, filename=f"{file_id}_images.zip")

@app.get("/segmentedzip/{file_id}")
def zip_segmented(file_id: str):
    dir_path = os.path.join(OUTPUT_DIR, f"{file_id}_segmented")
    zip_path = shutil.make_archive(dir_path, 'zip', dir_path)
    return FileResponse(zip_path, filename=f"{file_id}_segmented.zip")
